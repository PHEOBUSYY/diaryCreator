
import {
    INPUTGROUP_IPCKEY,
    INPUTGROUP_IPCRENDERERKEY,
    SENDIPC,
    ONIPCRECEIVE,
    REMOVEIPC,
    GETOBJ,
    METHOD_GET,
    METHOD_CREATE,
    METHOD_DELETE
} from '../mutation-types'

const ipcKey = INPUTGROUP_IPCKEY;
const ipcRendererKey = INPUTGROUP_IPCRENDERERKEY;
export default {
    namespaced: true,
    state: {
        inputGroups: [],
    },
    mutations: {
        [ONIPCRECEIVE]: function (state, payload) {
            //所有的ipc回调都在这里处理
            let args = payload.args;
            let res = payload.res;
            let method = args.method;
            let time = args.time;
            let type = args.type;
            if (method === METHOD_GET) {
                onGet(state, time, type, res);
            } else if (method === METHOD_DELETE) {
                let index = -1;
                for(let i =0;i< state.inputGroups.length ; i++){
                    let item = state.inputGroups[i];
                    if(item.time === time && item.type === type){
                        index = i;
                    }
                }
                if(index >=0){
                    state.inputGroups.splice(index,1);
                }
                // console.log("del inputGroups", state.inputGroups);
            } else if (method === METHOD_CREATE) {
                //todo

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
        [GETOBJ]: (state) => (time, type) => {
            let result = [];
            state.inputGroups.forEach(item =>{
                if(item.time === time && item.type === type){
                    result = item.data;
                }
            });
            return result;
        }
    }

}

function onGet(state, time, type, res) {
    if (res && res.data) {
        let result = [];
        if(res.data instanceof Array){
            res.data.forEach(item =>{
                result.push({
                    value: item.value
                })
            })
        }
        let isFind = false ;
        state.inputGroups.forEach(item =>{
            if(item.time === time && item.type === type){
                isFind = true;
                item.data = result;
            }
        });
        if(!isFind){
            state.inputGroups.push({
                time: time,
                type: type,
                data: result
            })
        }
        // console.log("onGet inputGroups", state.inputGroups);
    }

}