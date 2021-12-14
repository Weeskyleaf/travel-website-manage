<template>
    <div>
        <!-- 外部标题 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-promotion"></i>出行计划管理
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
                <el-input v-model="query.destination" placeholder="目的地" class="handle-input mr10" @keyup.enter.native='handleSearch'></el-input>
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
                <el-table-column prop="LID" label="LID" width="55"></el-table-column>
                <el-table-column prop="destination" label="目的地"></el-table-column>
                <el-table-column prop='place' label="景点"></el-table-column>
                <el-table-column prop='image' label="展示图">
                    <template width="90" slot-scope="scope">
                        <img style="width: 80px; height: 80px; border: none;" :src="scope.row.image">
                    </template>
                </el-table-column>
                <el-table-column prop='rate' label="评分"></el-table-column>
                <el-table-column prop='startTime' label="开始时间"></el-table-column>
                <el-table-column prop='endTime' label="结束时间"></el-table-column>
                <el-table-column prop='member' label="出行人数"></el-table-column>
                <el-table-column prop='cmtNums' label="点评数"></el-table-column>

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
                <el-form-item label="评分">
                    <el-input v-model="form.rate"></el-input>
                </el-form-item>
                <el-form-item label="评分">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="出行人数">
                    <el-input v-model="form.member"></el-input>
                </el-form-item>
                <el-form-item label="点评数">
                    <el-input v-model="form.cmtNums"></el-input>
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
                destination: '',
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
                LID: '',
                destination: '',
                place: '',
                image: '',
                rate: '',
                startTime: '',
                endTime: '',
                member: '',
                cmtNums: '',
                time: ''
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
            this.query.destination = '';
            this.searchData = [];
        },

        /* 获取数据库所有数据 */
        ajaxGet() {
            this.$axios.get('/travel/line/listAll').then(res => {
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
            if (this.query.destination != '') {
                this.$set(this.query, 'pageIndex', 1);
                // 获取搜索数据
                this.searchData = this.allData.filter((item) => item.destination == this.query.destination);
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
                this.$axios.get(`travel/line/delete?LID=${row.LID}`).then(res => {
                    if (res.data.status == 0 && res.data.msg == '删除成功!') {
                        this.$message.success(res.data.msg);
                        // 在所有数据中删除该数据
                        this.allData.forEach((item, id) => {
                            if (row.LID == item.LID) this.allData.splice(id, 1);
                        });
                        if (this.searchData.length == 0) this.refresh(this.allData);
                        else {
                            // 在搜索数据中删除该数据
                            this.searchData.forEach((item, id) => {
                                if (row.LID == item.LID) this.searchData.splice(id, 1);
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
                let deleteLID = [];
                this.multipleSelection.forEach(item => {
                    for (let i = 0; i < this.allData.length; i++) if (this.allData[i].LID == item.LID) deleteLID.push(item.LID);
                });
                let deleteStr = deleteLID.join(',');
                this.$axios.get(`travel/line/deleteMultiple?LID=${deleteStr}`).then(res => {
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
            this.form.LID = row.LID;
            this.form.destination = row.destination;
            this.form.place = row.place;
            this.form.image = row.image;
            this.form.rate = row.rate;
            this.form.startTime = row.startTime;
            this.form.endTime = row.endTime;
            this.form.member = row.member;
            this.form.cmtNums = row.cmtNums;
            this.form.time = [new Date(row.startTime), new Date(row.endTime)];
            this.editVisible = true;
        },

        /* 保存编辑 */
        saveEdit() {
            this.editVisible = false;
            let LID = this.form.LID, rate = this.form.rate, startTime = `${this.form.time[0].getFullYear()}-${(this.form.time[0].getMonth() + 1) < 10 ? '0' + (this.form.time[0].getMonth() + 1) : (this.form.time[0].getMonth() + 1)}-${this.form.time[0].getDate() < 10 ? '0' + this.form.time[0].getDate() : this.form.time[0].getDate()}`, endTime = `${this.form.time[1].getFullYear()}-${(this.form.time[1].getMonth() + 1) < 10 ? '0' + (this.form.time[1].getMonth() + 1) : (this.form.time[1].getMonth() + 1)}-${this.form.time[1].getDate() < 10 ? '0' + this.form.time[1].getDate() : this.form.time[1].getDate()}`, member = Number(this.form.member), cmtNums = Number(this.form.cmtNums);
            this.$axios.get(`/travel/line/update?LID=${LID}&&rate=${rate}&&startTime=${startTime}&&endTime=${endTime}&&member=${member}&&cmtNums=${cmtNums}`).then(res => {
                if (res.data.status == 0 && res.data.msg == '修改成功!') {
                    this.$message.success(res.data.msg);
                    // 修改表格数据中指定位置的对象元素
                    this.form.startTime = startTime, this.form.endTime = endTime;
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
