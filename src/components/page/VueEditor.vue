<template>
    <div>
        <!-- 外部标题 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-edit"></i>富文本编辑器
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
<!--            <div class="plugins-tips">-->
<!--                Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。-->
<!--                访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>-->
<!--            </div>-->
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: 'Hello World'
                }
            }
        },
        components: {
            quillEditor
        },
        methods: {
            submit(){
                let params = new URLSearchParams();
                params.append("content", this.content);
                this.$axios.post(`/test/edit`, params).then(res => {
                    if (res.status == 200) this.$message.success(res.data);
                    else this.$message.error(res.data);
                }, err => console.log(err));
            }
        }
    }
</script>
<style scoped>
    .editor-btn {
        margin-top: 20px;
    }
</style>