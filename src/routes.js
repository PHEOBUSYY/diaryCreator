import diaryTemplate from './vue/pages/diaryTemplate.vue';
import targetTemplate from './vue/pages/targetTemplate.vue'
export default [
    {
        path: '/',
        name: 'diary',
        component: diaryTemplate
    },
    {
        path: '/target',
        name: 'target',
        component: targetTemplate
    }
]
