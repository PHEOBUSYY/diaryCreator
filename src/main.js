import Vue from 'vue';
import 'babel-polyfill';


import ElementUI from 'element-ui'
Vue.use(ElementUI);
import App from './vue/app';
import vueRouter from 'vue-router'
import Routes from './routes';
import Vuex from 'vuex';
import 'element-ui/lib/theme-chalk/index.css'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.js'
import './css/index.scss'
Vue.use(vueRouter);
Vue.use(Vuex);
if(global.electron){
    //添加electron实例
    Vue.use({
        install (Vue, options) {
            //添加实例方法
            Vue.prototype.$electron = global.electron;
        }
    });
}
const router = new vueRouter({
    routes: Routes
});
import axios from 'axios'
import VueAxios from 'vue-axios'
import toasted from 'vue-toasted';
Vue.use(VueAxios, axios);
Vue.use(toasted);
new Vue({
    el: '#app',
    router: router,
    template: '<app/>',
    components: {
        app: App
    },
});

