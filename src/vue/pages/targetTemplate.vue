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
        <div class="bottom-btn" v-if="timeRange  && targetList.length>0">
            <button v-if="targetList[targetList.length-1].text" class="mini ui basic button teal"
                    @click="addNew"
            >add
            </button>
            <button class="mini ui basic button teal" v-if="realData.length > 0"
                    @click="dialogVisible = true">clear
            </button>
            <button class="mini ui basic button teal" @click="save" v-if="realData.length > 0">OK
            </button>
        </div>
        <el-input v-if="generate" v-model="generate" type="textarea" autosize></el-input>
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

    export default {
        components: {Target_item, diary_section_header},
        data: function () {
            return {
                storageKey: 'target',
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
            };
        },
        computed: {
            realTime: function () {
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() - date.getDay() + 1);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            },
            realTimeEnd: function(){
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
                this.$electron.ipcRenderer.send('target', 'create', this.realTime, realList);
            },
            initEmpty: function () {
                this.targetList = [];
                for (let i = 0; i < 7; i++) {
                    this.addNew();
                }
                this.generate = '';
            },
            clear: function () {
                this.$electron.ipcRenderer.send('target', 'delete', this.realTime);
            },
            timeChange: function () {
                //切换时间
                this.$electron.ipcRenderer.send('target', 'get', this.realTime);

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
                output += '## 每周目标'+ this.realTime.replace('-','') + "-" + this.realTimeEnd.replace('-','');
                output += '\r\n';
                let index = 1;
                this.targetList.forEach(item => {
                    if(item && item.text){
                        output += this.generateSingleLine(index, item);
                        index ++;
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
                for (let i = 0; i < result.length; i++) {
                    let alias = '其他';
                    if (i < this.weekDays.length) {
                        alias = this.weekDays[i];
                    }
                    output += '\r\n';
                    output += '### ' + alias + '\r\n';
                    output += '\r\n';
                    if (result[i]) {
                        output += result[i].join('');
                    }
                    output += '\r\n';
                }
                // console.log("generate result ", output);
                this.generate = output;
            },
            onGet: function (res) {
                if(res){
                    this.targetList = res.targets.map(item =>{
                        return {
                            text: item.text,
                            star: item.star,
                            editable: item.editable,
                            type: item.type,
                            week: item.week
                        }
                    });
                }else{
                    this.initEmpty();
                }
                this.generate = "";
            },
            onDelete: function (res) {
                if(res){
                    this.initEmpty();
                }
            },
            onCreateOrUpdate: function (res) {
                if(res){
                    this.generateTemplate();
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }else{
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
                if(method === 'get'){
                    // console.log("ipcRenderer get", JSON.stringify(res));
                    this.onGet(res);
                }else if (method === 'delete'){
                    this.onDelete(res);
                }else if (method === 'create'){
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

</style>