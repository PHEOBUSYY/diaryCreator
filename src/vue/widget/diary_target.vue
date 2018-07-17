<template>
    <!--自动根据当前的时间来获取目标列表-->
    <div class="container">
        <diary_section_header title="本周目标"></diary_section_header>
        <s_input disabled fluid color="teal" :label="index+1+''" :id="'target_week_'+index"
                 v-for="(item, index) in weekTarget" :key="'target_week_'+index"
                 v-model="weekTarget[index].text"></s_input>
        <diary_section_header title="今日目标"></diary_section_header>
        <s_input disabled fluid color="teal" :label="index+1+''" :id="'target_toady_'+index"
                 v-for="(item, index) in todayTarget" :key="'target_today_'+index"
                 v-model="todayTarget[index].text"></s_input>
        <diary_section_header title="明日目标"></diary_section_header>
        <s_input disabled fluid color="teal" :label="index+1+''" :id="'target_tomorrow_'+index"
                 v-for="(item, index) in tomorrowTarget" :key="'target_tomorrow_'+index"
                 v-model="tomorrowTarget[index].text"></s_input>
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
            date:{
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
          }
        },
        methods: {
            getTarget: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() - date.getDay() + 1);
                let key = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                this.$electron.ipcRenderer.send('target', 'get', key);
            },
            generateSingleLine: function (prefix, item) {
                //生成的单行格式
                if (item.star) {
                    return '- [ ] <font color=1cb5ac>' + prefix + '. ' + item.text + '</font>\r\n'
                } else {
                    return '- [ ] ' + prefix + '. ' + item.text + '\r\n'
                }
            },
            parse: function () {
                return this.output;
            },
            onGet: function (time, res) {
                if (res) {
                    //获取当前时间
                    let date = new Date(this.date);
                    let weekDay = date.getDay();
                    //取到了本周的计划列表
                    let targetList = res.targets;
                    if (targetList && targetList.length > 0) {
                        let output = '\r\n';
                        output += '### 本周目标\r\n';
                        for (let i = 0; i < targetList.length; i++) {
                            targetList[i].output = this.generateSingleLine(i + 1, targetList[i]);
                            output += targetList[i].output;
                            this.weekTarget.push(targetList[i]);
                        }
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
                            result[weekDay].forEach(item => {
                                output += item.output;
                            });
                            this.todayTarget = result[weekDay];
                        }
                        output += '\r\n';
                        if (weekDay + 1 < result.length) {
                            output += '### 明日目标\r\n';
                            if (result[weekDay + 1]) {
                                result[weekDay + 1].forEach(item => {
                                    output += item.output;
                                });
                                this.tomorrowTarget = result[weekDay + 1];
                            }
                        }
                        output += '\r\n';
                        this.output = output;
                        this.show = output.replace(/\r\n/g, '<br>').replace(/\- \[ \] /g, '').replace(/### /g, '');
                        // console.log("output", output);
                    }
                }
            }
        },
        mounted: function () {
            this.$electron.ipcRenderer.on('targetRenderer', (event, method, time, res) => {
                if (method === 'get') {
                    this.onGet(time, res);
                } else if (method === 'delete') {
                    // this.onDelete(res);
                } else if (method === 'create') {
                    // this.onCreateOrUpdate(res);
                }
            });
            this.getTarget();
        }
    }
</script>
<style scoped lang="scss">
    .container {
        padding: 15px;
    }
</style> 