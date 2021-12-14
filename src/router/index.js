import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            // 重定向至系统首页
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    // 系统首页
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    // 联系管理页面
                    path: '/contact',
                    component: () => import(/* webpackChunkName: "contact" */ '../components/page/Contact.vue'),
                    meta: { title: '联系管理' }
                },
                {
                    // 攻略游记申请管理页面
                    path: '/services',
                    component: () => import(/* webpackChunkName: "services" */ '../components/page/Services.vue'),
                    meta: { title: '攻略游记申请管理' }
                },
                {
                    // 官方攻略游记管理页面
                    path: '/services_official',
                    component: () => import(/* webpackChunkName: "services_official" */ '../components/page/ServicesOfficial.vue'),
                    meta: { title: '官方攻略游记管理' }
                },
                {
                    // 雇员申请管理页面
                    path: '/employee',
                    component: () => import(/* webpackChunkName: "employee" */ '../components/page/Employee.vue'),
                    meta: { title: '雇员申请管理' }
                },
                {
                    // 出行计划管理页面
                    path: '/line',
                    component: () => import(/* webpackChunkName: "line" */ '../components/page/Line.vue'),
                    meta: { title: '出行计划管理' }
                },
                {
                    // 富文本编辑器组页面
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                /*-------------------------------------------------------------------------------------------------*/
                {
                    // tab选项卡页面
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/other/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    // 文件上传页面
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/other/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // 基本表单页面
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/other/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // markdown页面
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/other/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 自定义图表页面
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/other/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    // schart图表页面
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/other/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表页面
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/other/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽弹框页面
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/other/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化功能页面
                    path: '/international',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/other/international.vue'),
                    meta: { title: '国际化功能' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/other/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    // 404页面
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/other/404.vue'),
                    meta: { title: '404' }
                },
                {
                    // 403页面
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/other/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/other/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            // 登录页面
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            // 其他非路由页面
            path: '*',
            redirect: '/404'
        }
    ]
});
