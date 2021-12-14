<template>
    <!-- 左侧导航栏 -->
    <div class="sidebar">

        <!-- 最外层包裹圈 -->
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        > <!-- router会以index作为path进行路由跳转 -->

            <!-- 条件(循环)渲染所有内部导航按钮 -->
            <template v-for="item in items">

                <!-- 条件(判断)渲染存在子项的一级导航按钮 -->
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>

                        <!-- 条件(循环)渲染所有二级子项按钮 -->
                        <template v-for="subItem in item.subs">

                            <!-- 条件(判断)渲染所有包含三级子菜单的按钮 -->
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>

                                <!-- 条件(循环)渲染三级菜单按钮 -->
                                <el-menu-item
                                    v-for="threeItem in subItem.subs"
                                    :key="threeItem.index"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>

                            <!-- 不含三级菜单按钮，渲染二级菜单按钮 -->
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>

                <!-- 不存在子项的一级导航按钮 -->
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false, // 控制左侧折叠栏
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-chat-dot-round',
                    index: 'contact',
                    title: '联系管理'
                },
                {
                    icon: 'el-icon-edit-outline',
                    index: 'services',
                    title: '攻略游记申请管理'
                },
                {
                    icon: 'el-icon-collection',
                    index: 'services_official',
                    title: '官方攻略游记管理'
                },
                {
                    icon: 'el-icon-s-custom',
                    index: 'employee',
                    title: '雇员申请管理'
                },
                {
                    icon: 'el-icon-s-promotion',
                    index: 'line',
                    title: '出行计划管理'
                },
                {
                    icon: 'el-icon-edit',
                    index: 'editor',
                    title: '富文本编辑器'
                },
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: 'menu1',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: '4-1',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '4-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: '5',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: '6',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: 'menu2',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: '7-1',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: '7-2',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'international',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: 'menu3',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: '403',
                //             title: '403页面'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     index: '10',
                //     title: '支持作者'
                // }
            ]
        };
    },
    computed: {
        /* 获取当前路由名称并激活左侧导航栏 */
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        /* 通过 Event Bus 进行组件间通信，来折叠侧边栏 */
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
