import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex);

import target from './modules/target';
import inputGroup from './modules/inputGroup'
import timeRecord from './modules/timeRecord'
export default new Vuex.Store({
    //公共状态
    state: {
        count: 0
    },
    modules: {
        target: target,
        inputgroup: inputGroup,
        timeRecord:timeRecord
    }

})
