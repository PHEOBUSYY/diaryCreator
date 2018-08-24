import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex);

import actions from './actions';
import mutations from './mutations';


import target from './modules/target';
import inputGroup from './modules/inputGroup'
export default new Vuex.Store({
    //公共状态
    state: {
        count: 0
    },
    mutations: mutations,
    actions: actions,
    modules: {
        target: target,
        inputText: inputGroup
    }

})
