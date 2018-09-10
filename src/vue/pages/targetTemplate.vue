<template>
    <div class="container">
        <div class="ui breadcrumb ">
            <a class="section labeled teal " href="#" @click="$router.push({path: '/'})">
                首页
            </a>
            <div class="divider"> |</div>
            <a class="section labeled teal active">目标</a>
        </div>
        <diary_section_header title="目标模板"></diary_section_header>
        <div class="header">
            <a class="section labeled teal active" @click="preWeek"><</a>
            <el-date-picker
                    style="width: 50%"
                    v-model="timeRange"
                    type="week"
                    format="yyyy 第 WW 周"
                    placeholder="选择周"
                    :picker-options="pickerOptions"
            >
            </el-date-picker>
            <a class="section labeled teal active" @click="nextWeek">></a>
        </div>
        <target_item v-for="(item, index) in targetList" v-model="targetList[index]"
                     :key="index+'_target_item_'"
                     :sid="index+'_target_item_'+realTime"></target_item>
        <button v-if="targetList.length > 0 && targetList[targetList.length-1].text"
                class="mini ui basic button teal"
                @click="addNew"
        >add
        </button>
        <target_week_summary v-if="timeRange" :date="realTime"
                             v-model="summary" ref="summary"></target_week_summary>
        <div class="bottom-btn" v-if="timeRange  && targetList.length>0">
            <button class="ui button teal make" v-if="realData.length > 0"
                    @click="dialogVisible = true">clear
            </button>
            <button class="ui button teal make" @click="save" v-if="realData.length > 0">OK
            </button>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
        >
            <span>确定要清空吗?</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false;clear()">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import Target_item from "../widget/target_item";
    import diary_section_header from '../widget/diary_section_header'
    import Target_week_summary from "../widget/target_week_summary";
    import {EventBus} from "../../Events";
    import {
        TARGET_SENDIPC,
        TARGET_COPY,
        TARGET_GETOBJ,
        METHOD_GET,
        METHOD_CREATE,
        METHOD_DELETE,
        SYSTEM,
        AFTERSAVE,
        PRE,
        NEXT,
        QUIT,
        SYSTEM_QUIT
    } from '../../store/mutation-types'

    //目标就是把所有关于electron ipc的逻辑都放在后面的vux中，触发事件通过action来完成，解析结果在main.js中
    export default {
        components: {Target_week_summary, Target_item, diary_section_header},
        data: function () {
            return {
                dialogVisible: false,
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                targetList: [],
                summary: {},
                repeat_options: [{
                    value: '1',
                    label: '工作日'
                }, {
                    value: '2',
                    label: '每天'
                }, {
                    value: '3',
                    label: '自定义'
                }, {
                    value: '0',
                    label: '无'
                }],
                pickerOptions: {
                    firstDayOfWeek: 1
                },
                timeRange: new Date().toDateString(),
                generate: ''
            };
        },
        computed: {
            realTime: function () {
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() - date.getDay() + 1);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            },
            realTimeEnd: function () {
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() - date.getDay() + 1);
                date.setDate(date.getDate() + 6);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            },
            realData: function () {
                return this.targetList.filter(item => {
                    return item.text;
                })
            },
            targetObj: function () {
                return this.$store.getters[TARGET_GETOBJ](this.realTime);
            }
        },
        watch: {
            timeRange: {
                handler: function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        this.timeChange()
                    }
                },
                immediate: true
            },
            targetObj: {
                handler: function (newVal) {
                    if (newVal) {
                        this.targetList = newVal.targetList;
                        this.summary = newVal.summary;
                    }
                },
                deep: true,
                immediate: true
            },
        },
        methods: {
            preWeek: function () {
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() - 7);
                this.timeRange = date.toLocaleDateString();
            },
            nextWeek: function () {
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() + 7);
                this.timeRange = date.toLocaleDateString();
            },
            addNew: function () {
                this.targetList.push({
                    text: '',
                    star: false,
                    editable: false,
                    type: 0,
                    week: []
                })
            },
            save: function () {
                this.$store.dispatch(TARGET_SENDIPC , {
                    method: METHOD_CREATE,
                    time: this.realTime,
                    targets: this.realData,
                    summary: this.summary
                });
            },
            clear: function () {
                this.$store.dispatch(TARGET_SENDIPC, {
                    method: METHOD_DELETE,
                    time: this.realTime
                });
            },
            timeChange: function () {
                //切换时间,获取数据-通过vuex来获取
                this.$store.dispatch(TARGET_SENDIPC, {
                    method: METHOD_GET,
                    time: this.realTime
                });
            },
            generateSingleLine: function (prefix, item) {
                //生成的单行格式
                if (item.checked) {
                    return '- [X] ' + prefix + '. ' + item.text + '\r\n'
                } else {
                    return '- [ ] ' + prefix + '. ' + item.text + '\r\n'
                }
            },
            generateTemplate: function () {
                let output = '';
                let result = [];
                output += '## 每周目标' + this.realTime.replace(/-/g, '') + "-" + this.realTimeEnd.replace(/-/g, '');
                output += '\r\n';
                let index = 1;
                output += '### 本周目标\r\n';
                this.targetList.forEach(item => {
                    if (item && item.text) {
                        output += this.generateSingleLine(index, item);
                        index++;
                        if (item.week && item.week.length > 0) {
                            item.week.forEach(weekDay => {
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
                    }
                });
                output += "\r\n";
                output += "### 目标细化\r\n";
                for (let i = 0; i < result.length; i++) {
                    let alias = '其他';
                    if (i < this.weekDays.length) {
                        alias = this.weekDays[i];
                    }
                    output += '\r\n';
                    output += '#### ' + alias + '\r\n';
                    output += '\r\n';
                    if (result[i]) {
                        output += result[i].join('');
                    }
                    output += '\r\n';
                }
                output += this.$refs.summary.parse();
                this.generate = output;
                console.log("generate result ", output);
                //拼接总结部分
                this.$store.commit(TARGET_COPY, {
                    generate: this.generate
                });
                this.$message({
                    message: '计划已粘贴到剪切板',
                    type: 'success'
                });
            }
        },
        beforeDestroy: function () {
            EventBus.$off();
        },
        mounted: function () {
            EventBus.$on(SYSTEM, (data) => {
                if(data.action === PRE){
                    this.preWeek();
                }else if(data.action === NEXT){
                    this.nextWeek();
                }else if(data.action === QUIT){
                    this.save();
                    this.$store.dispatch(SYSTEM_QUIT);
                }
            });
            EventBus.$on(AFTERSAVE, () => {
                this.generateTemplate();
            });
        },
    };
</script>
<style scoped lang="scss">
    .container {
        width: 50%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        & > div {
            &:nth-child(2) {
                margin: 25px 5px;
            }
            
        }
    }
    
    .header {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .target-input {
    }
    
    label {
        cursor: pointer;
        color: #409eff;
    }
    
    .bottom-btn {
        margin: 10px auto;
        display: block;
    }
    
    .repeat-select {
        width: 100px;
        margin: 5px 0;
    }
    
    .make {
        margin: 40px;
    }
</style>