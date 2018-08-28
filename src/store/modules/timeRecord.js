import Vue from 'vue';

import {
    TIMERECORD_IPCKEY,
    TIMERECORD_IPCRENDERERKEY,
    SENDIPC,
    ONIPCRECEIVE,
    REMOVEIPC,
    AFTERSAVE,
    GETOBJ,
    GETSAVE,
    METHOD_GET,
    METHOD_CREATE,
    METHOD_DELETE
} from '../mutation-types'

const ipcKey = TIMERECORD_IPCKEY;
const ipcRendererKey = TIMERECORD_IPCRENDERERKEY;
export default {
    namespaced: true,
    state: {
        records: {},
        save: {}
    },
    mutations: {
        [ONIPCRECEIVE]: function (state, payload) {
            //所有的ipc回调都在这里处理
            let args = payload.args;
            let res = payload.res;
            let method = args.method;
            let time = args.time;
            if (method === METHOD_GET) {
                onGet(state, time, res);
            } else if (method === METHOD_DELETE) {
                Vue.set(state.records, time, initDefault());
            } else if (method === METHOD_CREATE) {
                Vue.set(state.save, time, true);
            }
        },
        [AFTERSAVE]: function (state, payload) {
            Vue.set(state.save, payload.time, null);
        }
    },
    actions: {
        [SENDIPC]: function (context, payload) {
            if (global.electron) {
                global.electron.ipcRenderer.send(ipcKey, payload);
            } else {
                //todo 这里通过缓存来处理
            }
        },
        [ONIPCRECEIVE]: function (context, payload) {
            context.commit(ONIPCRECEIVE, payload);
        },
        [REMOVEIPC]: function () {
            if (global.electron) {
                global.electron.ipcRenderer.removeAllListeners(ipcRendererKey);
            } else {
                //todo 这里通过缓存来处理
            }
        }
    },
    getters: {
        [GETOBJ]: (state) => (time) => {
            let data = state.records[time];
            //数据初始化
            if (!data) {
                data = initDefault();
            }
            return data;
        },
        [GETSAVE]: (state) => (time) => {
            let isSave = state.save[time];
            return !!isSave;

        }
    }

}

function initDefault() {
    let dataList = [];
    for (let i = 0; i < 15; i++) {
        dataList.push({
            start: '',
            end: '',
            event: '',
            remark: ''
        })
    }
    return dataList;
}

function onGet(state, time, res) {
    if (res && res.data) {
        Vue.set(state.records, time, res.data);
    }
}