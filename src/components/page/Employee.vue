<template>
    <div>
        <!-- 外部标题 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-custom"></i>雇员申请管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 内部元素 -->
        <div class="container">

            <!-- 顶部处理栏 -->
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.ename" placeholder="姓名" class="handle-input mr10" @keyup.enter.native='handleSearch'></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="info" icon="el-icon-refresh" @click="refresh(allData)">刷新</el-button>
            </div>

            <!-- 数据表格 -->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                :cell-style="{'text-align': 'center'}"
                :header-cell-style="{'text-align': 'center'}"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="EID" label="EID" width="55"></el-table-column>
                <el-table-column prop="ename" label="姓名"></el-table-column>
                <el-table-column prop='eemail' label="电子邮箱"></el-table-column>
                <el-table-column prop='country' label="国家/地区"></el-table-column>
                <el-table-column prop='experience' label="工作经历"></el-table-column>
                <el-table-column prop='position' label="岗位"></el-table-column>
                <el-table-column prop='edate' label="提交时间"></el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="form.ename"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input v-model="form.eemail"></el-input>
                </el-form-item>
                <el-form-item label="国家/地区">
                    <el-input v-model="form.country"></el-input>
                </el-form-item>
                <el-form-item label="工作经历">
                    <el-input v-model="form.experience"></el-input>
                </el-form-item>
                <el-form-item label="岗位">
                    <el-select v-model="form.position">
                        <el-option label="技术" value="技术"></el-option>
                        <el-option label="产品" value="产品"></el-option>
                        <el-option label="运营" value="运营"></el-option>
                        <el-option label="销售" value="销售"></el-option>
                        <el-option label="市场" value="市场"></el-option>
                        <el-option label="设计" value="设计"></el-option>
                        <el-option label="人事/财务/行政" value="人事/财务/行政"></el-option>
                        <el-option label="旅游" value="旅游"></el-option>
                        <el-option label="服务业" value="服务业"></el-option>
                        <el-option label="金融" value="金融"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'employee',
    data() {
        return {
            query: { // 搜索
                ename: '',
                pageIndex: 1,
                pageSize: 10
            },
            allData: [], // 所有数据
            tableData: [], // 表格数据
            searchData: [], // 搜索数据
            multipleSelection: [], // 批量多选数组
            editVisible: false, // 编辑框状态
            pageTotal: 0, // 页面总数
            form: { // 编辑操作数据表单
                EID: '',
                ename: '',
                eemail: '',
                country: '',
                experience: '',
                position: '',
                edate: ''
            },
            idx: -1, // 编辑和删除操作指定元素下标
        };
    },
    created() {
        this.ajaxGet();
    },
    methods: {
        /* 刷新 */
        refresh(data) {
            this.ajaxGet();
            // 将搜索框以及搜索数据全置空
            this.query.ename = '';
            this.searchData = [];
        },

        /* 获取数据库所有数据 */
        ajaxGet() {
            this.$axios.get('/travel/employee/listAll').then(res => {
                if (res.data.status == 0) {
                    // 获取所有数据
                    this.allData = res.data.res;
                    this.pageTotal = res.data.res.length || 0;
                    // 渲染首页数据
                    this.getData(1, res.data.res);
                    this.$set(this.query, 'pageIndex', 1);
                } else this.$message.error(res.data.msg);
            }, err => this.$message.error(err));
        },

        /* 分页获取所需数据 */
        getData(page, data) {
            // 获取表格所需数据
            this.tableData = data.slice(10 * (page - 1), 10 * page);
        },

        /* 触发搜索按钮 */
        handleSearch() {
            if (this.query.ename != '') {
                this.$set(this.query, 'pageIndex', 1);
                // 获取搜索数据
                this.searchData = this.allData.filter((item) => item.ename == this.query.ename);
                // 更改数据数量
                this.pageTotal = this.searchData.length;
                // 设置分页
                this.getData(this.query.pageIndex, this.searchData);
            } else {
                this.refresh(this.allData);
                this.searchData = [];
            }
        },

        /* 删除操作 */
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.get(`travel/employee/delete?EID=${row.EID}`).then(res => {
                    if (res.data.status == 0 && res.data.msg == '删除成功!') {
                        this.$message.success(res.data.msg);
                        // 在所有数据中删除该数据
                        this.allData.forEach((item, id) => {
                            if (row.EID == item.EID) this.allData.splice(id, 1);
                        });
                        if (this.searchData.length == 0) this.refresh(this.allData);
                        else {
                            // 在搜索数据中删除该数据
                            this.searchData.forEach((item, id) => {
                                if (row.EID == item.EID) this.searchData.splice(id, 1);
                            });
                            // 重新渲染
                            this.$set(this.query, 'pageIndex', 1);
                            this.getData(this.query.pageIndex, this.searchData);
                            this.pageTotal = this.searchData.length;
                        }
                    } else if (res.data.status == 1) this.$message.error(res.data.msg);
                }, err => console.log(err));
            }).catch(err => true);
        },

        /* 多选操作 */
        handleSelectionChange(val) {
            // 重新获取已选数组
            this.multipleSelection = [];
            this.multipleSelection = val;
        },

        /* 删除选中项 */
        delAllSelection() {
            let length = this.multipleSelection.length;
            if (length != 0) {
                let deleteEID = [];
                this.multipleSelection.forEach(item => {
                    for (let i = 0; i < this.allData.length; i++) if (this.allData[i].EID == item.EID) deleteEID.push(item.EID);
                });
                let deleteStr = deleteGID.join(',');
                this.$axios.get(`travel/employee/deleteMultiple?EID=${deleteStr}`).then(res => {
                    if (res.data.status == 0 && res.data.msg == '删除成功!') this.$message.success(res.data.msg);
                    else if (res.data.status == 1) this.$message.error(res.data.msg);
                }, err => console.log(err));
                this.multipleSelection = [];
                // 重新渲染所有数据
                this.refresh(this.allData);
            } else this.$message.error(`删除失败，所选项为空!`);
        },

        /* 编辑操作 */
        handleEdit(index, row) {
            // 将行数据获取至表单中
            console.log(row);
            this.idx = index;
            this.form.EID = row.EID;
            this.form.ename = row.ename;
            this.form.eemail = row.eemail;
            this.form.country = row.country;
            this.form.experience = row.experience;
            this.form.position = row.position;
            this.form.edate = row.edate;
            this.editVisible = true;
        },

        /* 保存编辑 */
        saveEdit() {
            this.editVisible = false;
            let EID = this.form.EID, ename = this.form.ename, eemail = this.form.eemail, country = this.form.country, experience = this.form.experience, position = this.form.position;
            this.$axios.get(`/travel/employee/update?EID=${EID}&&ename=${ename}&&eemail=${eemail}&&country=${country}&&experience=${experience}&&position=${position}`).then(res => {
                if (res.data.status == 0 && res.data.msg == '修改成功!') {
                    this.$message.success(res.data.msg);
                    // 修改表格数据中指定位置的对象元素
                    this.$set(this.tableData, this.idx, this.form);
                }
                else if (res.data.status == 1) this.$message.error(res.data.msg);
            }, err => console.log(err));
        },

        /* 分页导航 */
        handlePageChange(val) {
            // 修改分页页数
            this.$set(this.query, 'pageIndex', val);
            let data = this.searchData.length == 0 ? this.allData : this.searchData;
            this.getData(val, data);
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
