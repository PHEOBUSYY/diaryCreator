<template>
    <div>
        <diary_section_header title="时间记录"></diary_section_header>
        <div class="ui tabular menu">
            <div @click="current = index" v-for="(tab, index) in tabs" class="item"
                 :class="index === current ? 'active': ''" :data-tab="'tab-'+index">{{tab}}
            </div>
        </div>
        <div v-for="(tab, index) in tabs" class="ui tab" :class="index === current ? 'active': ''"
             :data-tab="'tab-'+index">
            <div v-if="index === 0" class="ui container">
                <s_time_record_group ref="group" :sign="tab" :size.number="3" :event="events[index]"></s_time_record_group>
            </div>
            <div v-if="index === 1">
                <s_time_record_group ref="group" :sign="tab" :size.number="5" :event="events[index]"></s_time_record_group>
            </div>
            <div v-if="index === 2">
                <s_time_record_group ref="group" :sign="tab" :size.number="5" :event="events[index]"></s_time_record_group>
            </div>
            <div v-if="index === 3">
                <s_time_record_group ref="group" :sign="tab"  :size.number="5" :event="events[index]"></s_time_record_group>
            </div>
            <div v-if="index === 4">
                <s_time_record_group ref="group" :sign="tab"  :size.number="5" :event="events[index]"></s_time_record_group>
            </div>
            
        </div>
    </div>
</template>

<script>
    import s_input from './semantic/s_input';
    import s_time_record_group from './semantic/s_time_record_group';
    import Diary_section_header from "./diary_section_header";

    export default {
        name: "diary_time_record",
        components: {
            Diary_section_header,
            s_input, s_time_record_group
        },
        data: function () {
            return {
                tabs: ['早晨', '上午', '中午', '下午', '晚上'],
                events: [
                    ['起床','吃早饭','跑步','开车上班','读书','看孩子','其他'],
                    ['工作','上网','编程','看书','杂务'],
                    ['吃饭','玩游戏','上网','睡觉','看书','其他'],
                    ['工作','上网','编程','看书','杂务'],
                    ['加班','上网','编程','看书','看孩子','杂务'],
                    
                ],
                current: 0
            }
        },
        methods: {
            parse: function () {
                let result = '### 时间记录\n';
                result += '|事项|开始|结束|备注|\n';
                result += '|---|---|---|---|\n';
                this.$refs.group.forEach(item =>{
                    result += item.parse();
                });
                result += '\n';
                console.log("parse result", result);
                return result;
            }
        }
    }
</script>

<style scoped>
    .ui.tab > div {
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
</style>