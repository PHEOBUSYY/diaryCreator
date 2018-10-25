<template>
    <!--自动根据当前的时间来获取目标列表-->
    <div class="container">
        <diary_section_header title="本周目标"></diary_section_header>
        <s_input disabled fluid color="teal" :label="index+1+''" :id="'target_week_'+index"
                 v-for="(item, index) in weekTarget" :key="'target_week_'+index"
                 v-model="weekTarget[index].text"></s_input>
        <diary_section_header title="今日目标"></diary_section_header>
        <s_input disabled fluid color="teal" :label="index2+1+''" :id="'target_toady_'+index2"
                 v-for="(item, index2) in todayTarget" :key="'target_today_'+index2"
                 v-model="todayTarget[index2].text"></s_input>
        <diary_section_header title="明日目标"></diary_section_header>
        <s_input fluid color="teal" :label="index3+1+''" :id="'target_tomorrow_'+index3"
                 v-for="(item, index3) in tomorrowTarget" :key="'target_tomorrow_'+index3"
                 v-model="tomorrowTarget[index3].text"></s_input>
        <button v-if="tomorrowTarget.length > 0"
                class="mini ui basic button teal"
                @click="addNew"
        >add
        </button>
        <div v-if="!weekTarget || weekTarget.length===0">
            还没有设置本周目标,
            <router-link to="/targetTemplate">
                <a href="#">设置目标</a>
            </router-link>
        </div>
    </div>
</template>
<script>
    import S_input from "./semantic/s_input";
    import diary_section_header from "./diary_section_header"

    import {
        TARGET_SENDIPC,
        TARGET_GETOBJ,
        METHOD_GET,
        METHOD_CREATE
    } from '../../store/mutation-types'

    export default {
        components: {S_input, diary_section_header},
        data: function () {
            return {
                weekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                output: '',
                targetList: [],
                weekTarget: [],
                todayTarget: [],
                tomorrowTarget: [],
                parseResult: ''
            }
        },
        props: {
            date: {
                type: String,
                default: '',
                required: true
            }
        },
        watch: {
            date: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.getTarget();
                }
            },
            targetObj: {
                handler: function (newVal) {
                    if (newVal) {
                        this.targetList = newVal.targetList;
                        this.onGet();
                    }
                },
                deep: true,
                immediate: true
            },
        },
        computed: {
            targetObj: function () {
                return this.$store.getters[TARGET_GETOBJ](this.realTime);
            },
            realTime: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() - date.getDay() + 1);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
        },
        methods: {
            getTarget: function () {
                this.$store.dispatch(TARGET_SENDIPC, {
                    method: METHOD_GET,
                    time: this.realTime
                });
            },
            generateSingleLine: function (prefix, item) {
                //生成的单行格式
                if (item.checked) {
                    return '- [X]' + prefix + '. ' + item.text + '\r\n'
                } else {
                    return '- [ ] ' + prefix + '. ' + item.text + '\r\n'
                }
            },
            parse: function () {
                let output = '\r\n';
                output += '### 本周目标\r\n';
                for (let i = 0; i < this.targetList.length; i++) {
                    output += this.generateSingleLine(i + 1, this.targetList[i]);
                }
                output += '\r\n';
                output += '### 今日目标\r\n';
                for (let i = 0; i < this.todayTarget.length; i++) {
                    output += this.generateSingleLine(i + 1, this.todayTarget[i]);
                }
                output += '\r\n';
                output += '### 明日目标\r\n';
                for (let i = 0; i < this.tomorrowTarget.length; i++) {
                    output += this.generateSingleLine(i + 1, this.tomorrowTarget[i]);
                }
                output += '\r\n';
                this.output = output;
                return this.output;
            },
            isChange: function () {
                return this.parseResult !== JSON.stringify(this.tomorrowTarget);
            },
            del: function () {
                //undo 不删除计划相关内容
            },
            isEmpty: function () {
                return true;
            },
            onGet: function () {
                //获取当前时间
                let date = new Date(this.date);
                let weekDay = date.getDay();
                //取到了本周的计划列表
                if (this.targetList && this.targetList.length > 0) {
                    this.weekTarget = this.targetList;
                    let result = [];
                    this.targetList.forEach(item => {
                        if (item.week && item.week.length > 0) {
                            let weekArray = item.week;
                            weekArray.forEach(weekDay => {
                                let index = this.weekDays.indexOf(weekDay);
                                if (!result[index]) {
                                    result[index] = [];
                                }
                                result[index].push(item);
                            })
                        } else {
                            let othersIndex = this.weekDays.length;
                            if (!result[othersIndex]) {
                                result[othersIndex] = [];
                            }
                            result[othersIndex].push(item);
                        }
                    });
                    if (result[weekDay]) {
                        this.todayTarget = result[weekDay];
                    }
                    if (weekDay + 1 < result.length) {
                        if (result[weekDay + 1]) {
                            this.tomorrowTarget = result[weekDay + 1];
                        }
                    }
                }
            },
            addNew: function () {
                let date = new Date(this.date);
                let weekDay = date.getDay();
                this.tomorrowTarget.push({
                    text: '',
                    star: false,
                    editable: false,
                    type: 0,
                    week: [this.weekDays[weekDay+1]],
                    checked: false
                });
            },
            save: function () {
                if (this.isChange()) {
                    let newList = [];
                    this.tomorrowTarget.forEach(item => {
                        let find = false;
                        for(let i =0;i< this.targetList.length;i++){
                            if(item.text === this.targetList[i].text){
                                find = true;
                            }
                        }
                        if(!find){
                            newList.push(item);
                        }
                    });
                    this.targetList = this.targetList.concat(newList);
                    this.$store.dispatch(TARGET_SENDIPC , {
                        method: METHOD_CREATE,
                        time: this.realTime,
                        targets: this.targetList,
                        summary: {}
                    });
                    this.parseResult = JSON.stringify(this.tomorrowTarget);
                }
            }
        },
        mounted: function () {
            this.getTarget();
        }
    }
</script>
<style scoped lang="scss">
    .container {
        padding: 15px;
    }
</style> 