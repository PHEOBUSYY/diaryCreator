import {QUIT, SYSTEM_IPCKEY} from "../mutation-types";
const ipcKey = SYSTEM_IPCKEY;
export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        [QUIT]: function () {
            console.log("system quit");
            if (global.electron) {
                global.electron.ipcRenderer.send(ipcKey, {
                    action: QUIT
                });
            } else {
                //todo 这里通过缓存来处理
            }
        },
    },
    getters: {
    }

}