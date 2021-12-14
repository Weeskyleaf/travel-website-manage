import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

/* 使用钩子函数对路由进行权限跳转 */
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 旅游后台管理系统`;
    // 从本地存储中查看是否登录过，如果登录过则实现自动登录
    const role = localStorage.getItem('ms_username');
    // 通过登录名查看是否拥有登录权限
    if (!role && to.path !== '/login') next('/login'); // 未登录过则跳转至登录页面
    else if (to.meta.permission) role === 'admin' ? next() : next('/403'); // 如果是管理员权限(用户名为admin)则可进入，否则进入至403页面
    else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        // if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
        //     Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', { confirmButtonText: '确定' });
        // } else next();
        next();
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App),
}).$mount('#app');
