<template>
    <div class="wrapper">

        <!-- 页面头部 -->
        <v-head></v-head>

        <!-- 页面左侧导航栏 -->
        <v-sidebar></v-sidebar>

        <!-- 页面中心内容 -->
        <div class="content-box" :class="{'content-collapse': collapse}">

            <!-- 标签页 -->
<!--            <v-tags></v-tags>-->

            <!-- 主体内容 -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive> <!-- :include="tagsList" -->
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop></el-backtop> <!-- target=".content" -->
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
// import vTags from './Tags.vue';
import bus from './bus';
export default {
    data() {
        return {
            // tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar
        // vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        // bus.$on('tags', msg => {
        //     let arr = [];
        //     for (let i = 0, len = msg.length; i < len; i++) {
        //         msg[i].name && arr.push(msg[i].name);
        //     }
        //     this.tagsList = arr;
        // });
    }
};
</script>
