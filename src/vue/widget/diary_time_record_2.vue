<template>
    <div>
        <diary_section_header title="时间记录"></diary_section_header>
        <div v-for="(item,index) in dataList" class=" daterow" :key="'time_record'+index">
            <div class="ui right icon input teal dateinput" :class="item.sError ? 'error':''">
                <input type="text" placeholder="开始" v-model="item.start" @blur="timeBlur(index,0)">
                <i class="clock outline icon"></i>
            </div>
            <div class="ui right icon input teal dateinput" :class="item.eError ? 'error':''">
                <input type="text" placeholder="结束" v-model="item.end" @blur="timeBlur(index,1)">
                <i class="clock outline icon"></i>
            </div>
            <div class="ui input teal timeEvent">
                <input type="text" placeholder="活动" v-model="item.event" @blur="eventBlur(index)">
            </div>
        </div>
        <button v-if="dataList.length>0 && dataList[dataList.length - 1].end" @click="addNewLine"
                class="ui teal basic button mini" style="margin-top: 5px">add
        </button>
        <!--<button @click="parse" class="ui teal basic button mini" style="margin-top: 5px">save-->
        <!--</button>-->
    </div>
</template>

<script>
    import s_input from './semantic/s_input';
    import Diary_section_header from "./diary_section_header";
    import s_time_record_input from './semantic/s_time_record_input';

    import {
        TIMERECORD_GETOBJ,
        TIMERECORD_SENDIPC,
        TIMERECORD_REMOVEIPC,
        METHOD_GET,
        METHOD_CREATE,
        METHOD_DELETE
    } from '../../store/mutation-types'

    export default {
        name: "diary_time_record",
        components: {
            Diary_section_header,
            s_input, s_time_record_input
        },
        data: function () {
            return {
                dataList: [],
                parseResult: ''

            }
        },
        watch: {
            date: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.initData();
                }
            },
            recordObj: {
                handler: function (newVal) {
                    if (newVal) {
                        this.dataList = newVal;
                    }
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            recordObj: function () {
                return this.$store.getters[TIMERECORD_GETOBJ](this.date);
            },
        },
        props: {
            date: {
                type: String,
                default: new Date().toLocaleDateString()
            }
        },
        methods: {
            isCorrect: function (text) {
                let regex = RegExp('^\\d{1,2}\\.\\d{2}$');
                return regex.test(text) || !text;
            },
            timeBlur: function (index, order) {
                let obj = this.dataList[index];
                if (order === 0) {
                    let start = obj.start;
                    obj.sError = !this.isCorrect(start);
                } else {
                    let end = obj.end;
                    obj.eError = !this.isCorrect(end);
                }
                this.$set(this.dataList, index, obj);
            },
            eventBlur: function (index) {
                if (index < this.dataList.length - 1) {
                    let end = this.dataList[index].end;
                    let next = this.dataList[index + 1];
                    next.start = end;
                    this.$set(this.dataList, index + 1, next);
                }
            },
            parse: function () {
                this.save();
                let result = '### 时间记录\n';
                result += '|事项|开始|结束|备注|\n';
                result += '|---|---|---|---|\n';
                this.dataList.forEach(item => {
                    if (item.start && item.end) {
                        result += '|' + item.event || '';
                        result += '|' + item.start || '';
                        result += '|' + item.end || '';
                        result += '|' + item.remark || '';
                        result += '|\n';
                    }
                });
                result += '\n';
                return result;
            },
            isChange: function () {
                return this.parseResult !== JSON.stringify(this.dataList);
            },
            save: function () {
                if (this.isChange()) {
                    this.$store.dispatch(TIMERECORD_SENDIPC, {
                        method: METHOD_CREATE,
                        time: this.date,
                        data: this.dataList.map(item => {
                            return {
                                start: item.start,
                                end: item.end,
                                event: item.event,
                                remark: item.remark
                            }
                        })
                    });
                    this.parseResult = JSON.stringify(this.dataList);
                }
            },
            del: function () {
                this.$store.dispatch(TIMERECORD_SENDIPC, {
                    method: METHOD_DELETE,
                    time: this.date
                });
            },
            isEmpty: function () {
                return this.dataList.filter(item => {
                    return item.start && item.end;
                }).length === 0;
            },
            initData: function () {
                //恢复时间间隔
                this.$store.dispatch(TIMERECORD_SENDIPC, {
                    method: METHOD_GET,
                    time: this.date
                });
            },
            addNewLine: function () {
                //设置时间
                let start = '';
                if (this.dataList.length > 0) {
                    let temp = this.dataList[this.dataList.length - 1];
                    if (temp.end) {
                        start = temp.end;
                    }
                }
                for (let i = 0; i < 5; i++) {
                    this.dataList.push({
                        start: i === 0 ? start : '',
                        end: '',
                        event: '',
                        remark: ''
                    })
                }

            }
        },
        mounted: function () {
            this.initData();
        },
        beforeDestroy: function () {
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
    
    .daterow {
        display: flex;
        margin: 5px;
    }
    
    .dateinput {
        width: 20%;
    }
    .timeEvent{
        flex-grow:1;
    }
</style>