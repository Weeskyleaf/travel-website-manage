<template>
    <div>
        <!-- 外部标题 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-edit-outline"></i>攻略游记申请管理
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
                <el-input v-model="query.sname" placeholder="姓名" class="handle-input mr10" @keyup.enter.native='handleSearch'></el-input>
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
                <el-table-column prop="SID" label="SID" width="55"></el-table-column>
                <el-table-column prop="sname" label="姓名"></el-table-column>
                <el-table-column prop='semail' label="电子邮箱"></el-table-column>
                <el-table-column prop='title' label="标题"></el-table-column>
                <el-table-column prop='content' label="大致内容"></el-table-column>
                <el-table-column prop='classify' label="分类"></el-table-column>
                <el-table-column prop='isHot' label="热门帖"></el-table-column>
                <el-table-column prop="sdate" label="提交时间"></el-table-column>

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
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="姓名">
                    <el-input v-model="form.sname"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input v-model="form.semail"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="大致内容">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="form.classify">
                        <el-option label="美图" value="美图"></el-option>
                        <el-option label="实用" value="实用"></el-option>
                        <el-option label="精华" value="精华"></el-option>
                        <el-option label="典藏" value="典藏"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="热门贴">
                    <el-switch v-model="form.isHot"></el-switch>
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
    name: 'services',
    data() {
        return {
            query: { // 搜索
                sname: '',
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
                SID: '',
                sname: '',
                semail: '',
                title: '',
                content: '',
                classify: '',
                isHot: '',
                sdate: ''
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
            this.query.sname = '';
            this.searchData = [];
        },

        /* 获取数据库所有数据 */
        ajaxGet() {
            this.$axios.get('/travel/services/listAll').then(res => {
                if (res.data.status == 0) {
                    // 获取所有数据
                    this.allData = res.data.res;
                    this.allData.forEach(item => {
                        item.isHot = item.isHot == '1' ? '是' : '否';
                    })
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
            if (this.query.sname != '') {
                this.$set(this.query, 'pageIndex', 1);
                // 获取搜索数据
                this.searchData = this.allData.filter((item) => item.sname == this.query.sname);
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
                this.$axios.get(`travel/services/delete?SID=${row.SID}`).then(res => {
                    if (res.data.status == 0 && res.data.msg == '删除成功!') {
                        this.$message.success(res.data.msg);
                        // 在所有数据中删除该数据
                        this.allData.forEach((item, id) => {
                            if (row.SID == item.SID) this.allData.splice(id, 1);
                        });
                        if (this.searchData.length == 0) this.refresh(this.allData);
                        else {
                            // 在搜索数据中删除该数据
                            this.searchData.forEach((item, id) => {
                                if (row.SID == item.SID) this.searchData.splice(id, 1);
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
                let deleteSID = [];
                this.multipleSelection.forEach(item => {
                    for (let i = 0; i < this.allData.length; i++) if (this.allData[i].SID == item.SID) deleteSID.push(item.SID);
                });
                let deleteStr = deleteSID.join(',');
                this.$axios.get(`travel/services/deleteMultiple?SID=${deleteStr}`).then(res => {
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
            this.form.SID = row.SID;
            this.form.sname = row.sname;
            this.form.semail = row.semail;
            this.form.title = row.title;
            this.form.content = row.content;
            this.form.classify = row.classify;
            this.form.isHot = row.isHot == '是' ? true : false;
            this.form.sdate = row.sdate;
            this.editVisible = true;
        },

        /* 保存编辑 */
        saveEdit() {
            this.editVisible = false;
            let SID = this.form.SID, sname = this.form.sname, semail = this.form.semail, title = this.form.title, content = this.form.content, classify = this.form.classify, isHot = this.form.isHot == true ? 1 : 0;
            this.$axios.get(`/travel/services/update?SID=${SID}&&sname=${sname}&&semail=${semail}&&title=${title}&&content=${content}&&classify=${classify}&&isHot=${isHot}`).then(res => {
                if (res.data.status == 0 && res.data.msg == '修改成功!') {
                    this.$message.success(res.data.msg);
                    this.form.isHot = this.form.isHot == 1 ? '是' : '否';
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
