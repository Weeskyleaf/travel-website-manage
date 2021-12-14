<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-global"></i> {{$t('international.breadcrumb')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <span>{{$t('international.tips')}}</span>
            <el-button type="primary" @click="$i18n.locale = $i18n.locale === 'zh'?'en':'zh';">{{$t('international.btn')}}</el-button>
            <div class="list">
            <h2>{{$t('international.title1')}}</h2>
                <p>{{$t('international.p1')}}</p>
                <p>{{$t('international.p2')}}</p>
                <p>{{$t('international.p3')}}</p>
            </div>
            <h2>{{$t('international.title2')}}</h2>
            <div>
                <i18n path="international.info" tag="p">
                    <a place="action" href='https://element.eleme.cn/2.0/International.vue#/zh-CN/component/i18n'>{{ $t('international.value') }}</a>
                </i18n>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data(){
        return {
        }
    }
}
</script>

<style scoped>
.list{
    padding: 30px 0;
}
.list p{
    margin-bottom: 20px;
}
a{
    color: #409eff;
}
</style>
