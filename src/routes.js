import htmlTableParser from './vue/pages/htmlTableParser.vue'
import diaryTemplate from './vue/pages/diaryTemplate.vue';
import targetTemplate from './vue/pages/targetTemplate.vue'
import todayTarget from './vue/pages/todayTarget.vue'
import todayEvent from './vue/pages/todayEvent.vue'
import todayFeeling from './vue/pages/todayFeeling.vue';
import calendarDemo from './vue/pages/calendarDemo.vue'
export default [
    {
        path: '/htmlTableParser',
        name: 'htmlTableParser',
        component: htmlTableParser
    },
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
    },
    {
        path: '/todayEvent',
        name: 'todayEvent',
        component: todayEvent
    },
    {
        path: '/todayFeeling',
        name: 'todayFeeling',
        component: todayFeeling
    },
    {
        path: '/calendarDemo',
        name: 'calendarDemo',
        component: calendarDemo
    }
]
