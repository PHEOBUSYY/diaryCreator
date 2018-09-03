<template>
    <div>
        <diary_section_header title="时间记录"></diary_section_header>
        <div class="ui tabular menu">
            <div @click="current = index" v-for="(tab, index) in tabs" class="item"
                 :class="index === current ? 'active': ''" :data-tab="'tab-'+index">{{tab}}
            </div>
        </div>
        <div v-for="(tab, pindex) in tabs" class="ui tab" :class="pindex === current ? 'active': ''"
             :data-tab="'tab-'+pindex">
            <div class="ui container" v-if="pindex === current">
                <s_time_record_input v-for="(item, index) in dataList" color="teal"
                                     :selected.number="index %events[pindex].length"
                                     :event="events[pindex]" :id="tab + 's_time_record_input'+index"
                                     :key="index"
                                     :data="item"
                                     v-model="dataList[index]"
                                     :pickRange="pickRange"
                                     @timeChange="updateTime(index,arguments)"></s_time_record_input>
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
                tabs: ['全部', '锻炼', '常规', '编程', '加班'],
                events: [['起床', '跑步', '去黑山', '看孩子', '开车', '吃饭', '读书', '总结', '工作', '编程', '阅读', '写作', '其他', '游戏', '上网'],
                    ['起床', '跑步', '吃饭', '去黑山', '开车', '工作', '吃饭', '午休', '工作', '总结'],
                    ['起床', '去黑山', '开车', '吃饭', '工作', '吃饭', '午休', '工作', '总结'],
                    ['起床', '去黑山', '开车', '吃饭', '编程', '吃饭', '午休', '编程', '总结'],
                    ['起床', '去黑山', '开车', '吃饭', '编程', '吃饭', '午休', '编程', '吃饭', '加班']],
                current: 0,
                dataList: [],
                pickRange: {
                    start: '05:00', step: '00:10', end: '23:30'
                },
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
                    this.$store.dispatch(TIMERECORD_SENDIPC , {
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
                this.$store.dispatch(TIMERECORD_SENDIPC , {
                    method: METHOD_DELETE,
                    time: this.date
                });
            },
            isEmpty: function () {
                return this.dataList.filter(item => {
                    return item.start && item.end;
                }).length === 0;
            },
            updateTime: function (index, args) {
                let itemData = args[0];//当前行对象
                let changeIndex = args[1];//哪一行发生了变化
                this.$set(this.dataList, index, itemData);
                //调整时间选择的范围
                if (changeIndex === 0) {
                    //第一行的时间发生了改变，第二行的时间范围调整
                    if (!itemData.start) {
                        this.$set(this.pickRange, 'start', '05:00');
                    }
                } else {
                    //第二行发生了改变
                    this.$set(this.pickRange, 'start', itemData.end ? itemData.end : '05:00');
                }
                if (index < this.dataList.length - 1) {
                    //把当前行的end时间设置为下一行的start
                    let nextData = this.dataList[index + 1];
                    nextData.start = itemData.end;
                    this.$set(this.dataList, index + 1, nextData);
                }
            },
            initData: function () {
                //恢复时间间隔
                this.$set(this.pickRange, 'start', '05:00');
                this.$store.dispatch(TIMERECORD_SENDIPC , {
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
                        this.$set(this.pickRange, 'start', start);
                    }
                }
                this.dataList.push({
                    start: start,
                    end: '',
                    event: '',
                    remark: ''
                })
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
</style>