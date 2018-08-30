import Vue from 'vue';

import {
    TARGET_IPCKEY,
    TARGET_IPCRENDERERKEY,
    SENDIPC,
    ONIPCRECEIVE,
    REMOVEIPC,
    COPY,
    AFTERSAVE,
    GETOBJ,
    METHOD_GET,
    METHOD_CREATE,
    METHOD_DELETE
} from '../mutation-types'

const ipcKey = TARGET_IPCKEY;
const ipcRendererKey = TARGET_IPCRENDERERKEY;
import {EventBus} from '../../Events';
export default {
    namespaced: true,
    state: {
        targets: {},
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
                Vue.set(state.targets, time, initDefault());
            } else if (method === METHOD_CREATE) {
                //保存成功
                EventBus.$emit(AFTERSAVE);
            }
        },
        [COPY]: function (state, payload) {
            if (global.electron) {
                global.electron.clipboard.writeText(payload.generate);
            } else {
                //todo 这里通用的copy

            }
        },
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
            let data = state.targets[time];
            //数据初始化
            if (!data) {
                data = initDefault();
            }
            return data;
        }
    }

}

function initDefault() {
    let data = {};
    data.targetList = [];
    for (let i = 0; i < 7; i++) {
        data.targetList.push({
            text: '',
            star: false,
            editable: false,
            type: 0,
            week: [],
            checked: false
        })
    }
    data.summary = {
        improve: [
            {
                value: ''
            },
            {
                value: ''
            },
            {
                value: ''
            }
        ],
        overall: '',
        score: ''
    };
    return data;
}

function onGet(state, time, res) {
    let result = {};
    if (res && res.targets) {
        result.targetList = res.targets.map(item => {
            return {
                checked: item.checked,
                text: item.text,
                star: item.star,
                editable: item.editable,
                type: item.type,
                week: item.week
            }
        });
        result.summary = {};
        result.summary.score = res.summary.score;
        result.summary.overall = res.summary.overall;
        result.summary.improve = res.summary.improve.map(item => {
            return {
                value: item.value
            }
        });
        Vue.set(state.targets, time, result);
    }

}