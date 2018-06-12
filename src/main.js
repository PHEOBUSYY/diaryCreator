import Vue from 'vue';
import 'babel-polyfill';


// Import App Custom Styles
// import AppStyles from './css/app.css'

import ElementUI from 'element-ui'
Vue.use(ElementUI);
import App from './vue/app';
import vueRouter from 'vue-router'
import Routes from './routes';
import Vuex from 'vuex';
import 'element-ui/lib/theme-chalk/index.css'
import './css/index.css';
Vue.use(vueRouter);
Vue.use(Vuex);
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

