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
        <el-date-picker
                style="width: 50%"
                v-model="timeRange"
                type="week"
                @change="timeChange"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                :picker-options="pickerOptions"
        >
        </el-date-picker>
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
    const ipcKey = 'target';
    export default {
        components: {Target_week_summary, Target_item, diary_section_header},
        data: function () {
            return {
                dialogVisible: false,
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                targetList: [],
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
                timeRange: '',
                generate: '',
                summary: {
                    improve: [
                        {
                            value: ''
                        },
                        {
                            value: ''
                        },
                        {
                            value: ''
                        }
                    ],
                    overall: '',
                    score: ''
                }
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
            }
        },
        methods: {
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
                let realList = this.targetList.filter(item => {
                    return item.text;
                });
                this.$electron.ipcRenderer.send(ipcKey, 'create', this.realTime, realList ,this.summary, );
            },
            initEmpty: function () {
                this.targetList = [];
                for (let i = 0; i < 7; i++) {
                    this.addNew();
                }
                this.summary = {
                    improve: [
                        {
                            value: ''
                        },
                        {
                            value: ''
                        },
                        {
                            value: ''
                        }
                    ],
                    overall: '',
                    score: ''
                };
                this.generate = '';
            },
            clear: function () {
                this.$electron.ipcRenderer.send(ipcKey, 'delete', this.realTime);
            },
            timeChange: function () {
                //切换时间
                this.$electron.ipcRenderer.send(ipcKey, 'get', this.realTime);

            },
            generateSingleLine: function (prefix, item) {
                //生成的单行格式
                if (item.star) {
                    return '- [ ] <font color=44C0FF>' + prefix + '. ' + item.text + '</font>\r\n'
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
                try {
                    if (this.$electron) {
                        this.$electron.clipboard.writeText(this.generate);
                    } else {
                        document.execCommand("Copy");
                    }
                    this.$message({
                        message: '计划已粘贴到剪切板',
                        type: 'success'
                    });
                } catch (e) {
                    console.log(e);
                }
            },
            onGet: function (res) {
                if (res) {
                    this.targetList = res.targets.map(item => {
                        return {
                            text: item.text,
                            star: item.star,
                            editable: item.editable,
                            type: item.type,
                            week: item.week
                        }
                    });
                    this.summary.score = res.summary.score;
                    this.summary.overall = res.summary.overall;
                    this.summary.improve = res.summary.improve.map(item => {
                        return {
                            value: item.value
                        }
                    })
                } else {
                    this.initEmpty();
                }
                this.generate = "";
            },
            onDelete: function (res) {
                if (res) {
                    this.initEmpty();
                }
            },
            onCreateOrUpdate: function (res) {
                if (res) {
                    this.generateTemplate();
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '目标不能为空',
                        type: 'error'
                    });
                }
            }

        },
        mounted: function () {
            this.timeRange = new Date().toDateString();
            this.timeChange();
            this.$electron.ipcRenderer.on('targetRenderer', (event, method, time, res) => {
                if (method === 'get') {
                    this.onGet(res);
                } else if (method === 'delete') {
                    this.onDelete(res);
                } else if (method === 'create') {
                    this.onCreateOrUpdate(res);
                }
            })
        }
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