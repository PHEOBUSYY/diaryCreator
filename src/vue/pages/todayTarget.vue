<template>
    <!--自动根据当前的时间来获取目标列表-->
    <div>
        <div v-if="output" v-html="show" style="text-align: left">
        </div>
        <div v-else>
        还没有设置本周目标,
        <router-link to="/targetTemplate">
            <a href="#">设置目标</a>
        </router-link>
        </div>
    </div>
    <!--<el-input type="textarea" v-model="output" autosize></el-input>-->
</template>
<script>
    export default {
        data: function () {
            return {
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                output: '',
                show: ''
            }
        },
        methods: {
            getTarget: function () {
                let date = new Date();
                let weekDay = date.getDay();
                date.setDate(date.getDate() - date.getDay() + 1);
                let key = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                console.log("key", key);
                let cache = localStorage.getItem('target');
                if (cache) {
                    cache = JSON.parse(cache);
                    //取到了本周的计划列表
                    let targetList = cache[key];
                    if (targetList && targetList.length > 0) {
                        let output = '\r\n';
                        output += '### 本周目标\r\n';
                        for (let i = 0; i < targetList.length; i++) {
                            output += this.generateSingleLine(i + 1, targetList[i])
                        }
                        output += '\r\n';
                        let result = [];
                        targetList.forEach(item => {
                            if (item.frequency && item.frequency.length > 0) {
                                let weekArray = item.frequency;
                                weekArray.forEach(weekDay => {
                                    let index = this.weekDays.indexOf(weekDay);
                                    if (!result[index]) {
                                        result[index] = [];
                                    }
                                    result[index].push(this.generateSingleLine(result[index].length + 1, item));
                                })
                            } else {
                                let othersIndex = this.weekDays.length;
                                if (!result[othersIndex]) {
                                    result[othersIndex] = [];
                                }
                                result[othersIndex].push(this.generateSingleLine(result[othersIndex].length + 1, item));
                            }
                        });
                        console.log("result", result);
                        output += '### 今日目标\r\n';
                        output += result[weekDay - 1].join('');
                        output += '\r\n';
                        if (weekDay < result.length) {
                            output += '### 明日目标\r\n';
                            output += result[weekDay].join('');
                        }
                        output += '\r\n';
                        this.output = output;
                        this.show = output.replace(/\r\n/g, '<br>').replace(/\- \[ \] /g, '').replace(/### /g, '');
                        ;
                        console.log("output", output);
                        console.log("show", this.show);
                    }
                }
            },
            generateSingleLine: function (prefix, item) {
                //生成的单行格式
                if (item.isStar) {
                    return '- [ ] <font color=44C0FF>' + prefix + '. ' + item.value + '</font>\r\n'
                } else {
                    return '- [ ] ' + prefix + '. ' + item.value + '\r\n'
                }
            },
            generate: function () {
                return this.output;
            }
        },
        mounted: function () {
            this.getTarget();
        }
    }
</script>
<style scoped lang="scss">

</style> 