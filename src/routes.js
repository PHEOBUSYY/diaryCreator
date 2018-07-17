import diaryTemplate from './vue/pages/diaryTemplate.vue';
import targetTemplate from './vue/pages/targetTemplate.vue'
import todayTarget from './vue/widget/diary_target.vue'
export default [
    {
        path: '/',
        name: 'diaryTemplate',
        component: diaryTemplate
    },
    {
        path: '/targetTemplate',
        name: 'targetTemplate',
        component: targetTemplate
    },
    {
        path: '/todayTarget',
        name: 'todayTarget',
        component: todayTarget
    }
]
