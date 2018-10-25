import {CLEAR_CLIPBOARD, COPY, QUIT, SYSTEM_IPCKEY} from "../mutation-types";
const ipcKey = SYSTEM_IPCKEY;
export default {
    namespaced: true,
    state: {
    },
    actions: {
        [QUIT]: function () {
            if (global.electron) {
                global.electron.ipcRenderer.send(ipcKey, {
                    action: QUIT
                });
            } else {
                //todo 这里通过缓存来处理
            }
        },
    },
    mutations: {
        [COPY]: function (state, payload) {
            if (global.electron) {
                global.electron.clipboard.writeText(payload);
            } else {
                //todo 这里通用的copy

            }
        },
        [CLEAR_CLIPBOARD]: function () {
            if (global.electron) {
                global.electron.clipboard.clear();
            } else {

            }
        },

    },
    getters: {
    }

}