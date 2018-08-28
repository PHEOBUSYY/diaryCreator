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
import {
    TARGET_IPCRENDERERKEY,
    TARGET_ONIPCRECEIVE,
    INPUTGROUP_IPCRENDERERKEY,
    TIMERECORD_IPCRENDERERKEY,
    TIMERECORD_ONIPCRECEIVE,
    INPUTGROUP_ONIPCRECEIVE,
    SYSTEM_IPCRENDERERKEY
} from './store/mutation-types'
//这里是所有ipc通知的入口点
import {EventBus} from './Events'

if (electron) {
    electron.ipcRenderer.on(TARGET_IPCRENDERERKEY, (event, args, res) => {
        console.log("ipc", 'receive targetRenderer', args, res);
        store.dispatch(TARGET_ONIPCRECEIVE, {
            args: args,
            res: res
        });
    });
    electron.ipcRenderer.on(INPUTGROUP_IPCRENDERERKEY, (event, args, res) => {
        // console.log("ipc", 'receive inputGroupRenderer',args ,res);
        store.dispatch(INPUTGROUP_ONIPCRECEIVE, {
            args: args,
            res: res
        });
    });
    electron.ipcRenderer.on(TIMERECORD_IPCRENDERERKEY, (event, args, res) => {
        // console.log("ipc", 'receive timeRecordRenderer',args ,res);
        store.dispatch(TIMERECORD_ONIPCRECEIVE, {
            args: args,
            res: res
        });
    });
    electron.ipcRenderer.on(SYSTEM_IPCRENDERERKEY, (event, args, res) => {
        console.log("ipc", 'receive SYSTEM_IPCRENDERERKEY', args, res);
        EventBus.$emit('system', args);
    })
}

