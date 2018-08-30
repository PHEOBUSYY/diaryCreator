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
        <s_input disabled fluid color="teal" :label="index3+1+''" :id="'target_tomorrow_'+index3"
                 v-for="(item, index3) in tomorrowTarget" :key="'target_tomorrow_'+index3"
                 v-model="tomorrowTarget[index3].text"></s_input>
        <!--<div v-if="output" v-html="show" style="text-align: left">-->
        <!--</div>-->
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
        METHOD_GET
    } from '../../store/mutation-types'

    export default {
        components: {S_input, diary_section_header},
        data: function () {
            return {
                weekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                output: '',
                weekTarget: [],
                todayTarget: [],
                tomorrowTarget: [],
                show: ''
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
                        this.onGet(newVal.targetList);
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
                return this.output;
            },
            isChange: function () {
                return false;
            },
            del: function () {
                //undo 不删除计划相关内容
            },
            isEmpty: function () {
                return true;
            },
            onGet: function (targetList) {
                //获取当前时间
                let date = new Date(this.date);
                let weekDay = date.getDay();
                //取到了本周的计划列表
                if (targetList && targetList.length > 0) {
                    let output = '\r\n';
                    output += '### 本周目标\r\n';
                    for (let i = 0; i < targetList.length; i++) {
                        // targetList[i].output = this.generateSingleLine(i + 1, targetList[i]);
                        output += this.generateSingleLine(i + 1, targetList[i]);
                    }
                    this.weekTarget = targetList;
                    output += '\r\n';
                    let result = [];
                    targetList.forEach(item => {
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
                    output += '### 今日目标\r\n';
                    if (result[weekDay]) {
                        let index = 1;
                        result[weekDay].forEach(item => {
                            output += this.generateSingleLine(index, item);
                            index ++;
                        });
                        this.todayTarget = result[weekDay];
                    }
                    output += '\r\n';
                    if (weekDay + 1 < result.length) {
                        output += '### 明日目标\r\n';
                        if (result[weekDay + 1]) {
                            let index = 1;
                            result[weekDay + 1].forEach(item => {
                                output += this.generateSingleLine(index, item);
                                index ++;
                            });
                            this.tomorrowTarget = result[weekDay + 1];
                        }
                    }
                    output += '\r\n';
                    this.output = output;
                    this.show = output.replace(/\r\n/g, '<br>').replace(/\- \[ \] /g, '').replace(/### /g, '');
                    // console.log("output", output);
                }
            },
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