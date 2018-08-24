import Vue from 'vue';

const ipcKey = 'target';
const ipcRendererKey = 'targetRenderer';
export default {
    namespaced: true,
    state: {
        targets: {},
        save: {}
    },
    mutations: {
        onIpcReceive: function (state, payload) {
            //所有的ipc回调都在这里处理
            console.log("onIpcReceive payload", payload);
            let args = payload.args;
            let res = payload.res;
            let method = args.method;
            let time = args.time;
            if (method === 'get') {
                onGet(state, time, res);
            } else if (method === 'delete') {
                Vue.set(state.targets, time, initDefault());
            } else if (method === 'create') {
                Vue.set(state.save, time, true);
            }
        },
        copy: function (state, payload) {
            if (global.electron) {
                global.electron.clipboard.writeText(payload.generate);
            } else {
                // document.execCommand("Copy");
                //todo 这里通用的copy

            }
        },
        afterSave: function (state, payload) {
            Vue.set(state.save, payload.time, null);
        }
    },
    actions: {
        sendIpc: function (context, payload) {
            if (global.electron) {
                global.electron.ipcRenderer.send(ipcKey, payload);
            }else{
                //todo 这里通过缓存来处理
            }
        },
        onIpcReceive: function (context, payload) {
            context.commit('onIpcReceive', payload);
        },
        removeIpc: function (context) {
            if (global.electron) {
                global.electron.ipcRenderer.removeAllListeners(ipcRendererKey);
            }else{
                //todo 这里通过缓存来处理
            }
        }
    },
    getters: {
        getTargetObj: (state) => (time) => {
            let data = state.targets[time];
            //数据初始化
            if (!data) {
                data = initDefault();
            }
            return data;
        },
        getSave: (state) => (time) => {
            let isSave = state.save[time];
            return !!isSave;

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
            week: []
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
    if(res && res.targets){
        result.targetList = res.targets.map(item => {
            return {
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