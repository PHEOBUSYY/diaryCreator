import Vue from 'vue';
import 'babel-polyfill';


import ElementUI from 'element-ui'

Vue.use(ElementUI);
import App from './vue/app';
import vueRouter from 'vue-router'
import Routes from './routes';
import 'element-ui/lib/theme-chalk/index.css'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.js'
import './css/index.scss'

Vue.use(vueRouter);
import store from './store'

let electron;
if (global.electron) {
    //添加electron实例
    electron = global.electron;
    Vue.use({
        install(Vue, options) {
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
//接受electron ipc消息
new Vue({
    el: '#app',
    store,
    router: router,
    template: '<app/>',
    components: {
        app: App
    },
    mounted: function () {
    }
});

//这里是所有ipc通知的入口点
if (electron) {
    electron.ipcRenderer.on('targetRenderer', (event, args, res) => {
        console.log("ipc", 'receive targetRenderer',args ,res);
        store.dispatch('target/onIpcReceive',{
           args: args,
           res: res
        });
    })
}

