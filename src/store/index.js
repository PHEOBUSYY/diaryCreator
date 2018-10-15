import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex);

import target from './modules/target';
import inputGroup from './modules/inputGroup'
import timeRecord from './modules/timeRecord'
import system from './modules/system'
import {CLEAR_CLIPBOARD, COPY} from "./mutation-types";

export default new Vuex.Store({
    //公共状态
    state: {
        count: 0
    },
    modules: {
        target: target,
        inputgroup: inputGroup,
        timeRecord: timeRecord,
        system: system
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

    }

})
