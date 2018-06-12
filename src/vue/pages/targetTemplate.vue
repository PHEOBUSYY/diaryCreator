<template>
    <div class="container">
        <nav>
            <router-link to="/">
                <a href="#">首页</a>
            </router-link>
        </nav>
        <h3>目标模板</h3>
        <el-date-picker
                v-model="timeRange"
                type="week"
                @change="timeChange"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                :picker-options="pickerOptions"
        >
        </el-date-picker>
        <!--<el-date-picker-->
        <!--v-model="timeRange"-->
        <!--type="week"-->
        <!--align="right"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--@change="timeChange"-->
        <!--format="yyyy-MM-dd"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--:picker-options="pickerOptions2">-->
        <!--</el-date-picker>-->
        <div v-for="(item, index) in targetList">
            <label :for="'star'+index"><i
                    :class="item.isStar? 'el-icon-star-on':'el-icon-star-off'"></i></label>
            <input title="star" v-show="false" type="checkbox" v-model="item.isStar"
                   :id="'star'+index"/>
            <el-input class="target-input" autosize clearable
                      v-model="targetList[index].value"></el-input>
            <el-button @click="item.editable = !item.editable" size="small" type="primary"
                       icon="el-icon-edit" circle
                       v-if="item.value"></el-button>
            <el-button @click="delTarget(index)" size="small" type="danger" icon="el-icon-delete"
                       circle v-if="item.value"></el-button>
            <div style="padding:10px 20px;background: #f3f3f3" v-if="item.editable && item.value">
                <div style="font-size: 12px;margin:0 5px;">重复频率</div>
                <el-select value="" class="repeat-select" size="mini" v-model="item.repeatType"
                           placeholder="" @change="changeRepeatType(item)">
                    <el-option
                            v-for="option in repeat_options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value">
                    </el-option>
                </el-select>
                <el-checkbox-group v-if="item.repeatType === '3'" v-model="item.frequency"
                                   size="mini">
                    <el-checkbox-button v-for="day in weekDays" :label="day" :key="day">{{day}}
                    
                    
                    
                    </el-checkbox-button>
                </el-checkbox-group>
            </div>
        
        </div>
        <div class="bottom-btn">
            <el-button @click="addNew" size="small" type="primary" icon="el-icon-plus"
                       circle></el-button>
            <el-button v-if="realData.length > 0" @click="dialogVisible = true" size="small"
                       type="danger" icon="el-icon-close"
                       circle></el-button>
            <el-button @click="save" v-if="realData.length > 0" size="small" type="success"
                       icon="el-icon-check" circle></el-button>
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
    export default {
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
                    firstDayOfWeek : 1
                },
//                pickerOptions2: {
//                    shortcuts: [{
//                        text: '当前周',
//                        onClick(picker) {
//                            const now = new Date();
//                            const end = new Date();
//                            //获取每周的第一天是 天数date - 星期数 + 1;最后一天是获取到第一天之后加6
//                            end.setDate(now.getDate() - now.getDay() + 1 + 6);
//                            const start = new Date();
//                            start.setDate(now.getDate() - now.getDay() + 1);
//                            picker.$emit('pick', [start, end]);
//                        }
//                    }, {
//                        text: '当前月',
//                        onClick(picker) {
//                            const now = new Date();
//                            const end = new Date();
//                            end.setMonth(now.getMonth() + 1);
//                            end.setDate(0);
//                            const start = new Date();
//                            start.setDate(1);
//                            picker.$emit('pick', [start, end]);
//                        }
//                    }, {
//                        text: '当前年',
//                        onClick(picker) {
//                            const now = new Date();
//                            const end = new Date();
//                            end.setFullYear(now.getFullYear() + 1);
//                            end.setMonth(0);
//                            end.setDate(0);
//                            const start = new Date();
//                            start.setDate(1);
//                            start.setMonth(0);
//                            picker.$emit('pick', [start, end]);
//                        }
//                    }]
//                },
                timeRange: '',
                generate: ''
            };
        },
        computed: {
            realData: function () {
                return this.targetList.filter(item => {
                    return item.value;
                });
            },
            realTime: function () {
                console.log("timeRange", this.timeRange);
                let date = new Date(this.timeRange);
                date.setDate(date.getDate() - date.getDay() + 1);
                return date.getFullYear() + "-" + ( date.getMonth() + 1) + "-" + date.getDate();
            }
        },
        methods: {
            addNew: function () {
                this.targetList.push({
                    value: '',
                    isStar: false,
                    editable: false,
                    repeatType: '',
                    frequency: []
                })
            },
            delTarget: function (index) {
                this.targetList.splice(index, 1);
            },
            save: function () {
                console.log("realTime", this.realTime);
                let cache = {};
                if (this.realData.length > 0) {
                    cache[this.realTime] = this.realData;
                    localStorage.setItem(this.storageKey, JSON.stringify(cache));
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

            },
            clear: function () {
                localStorage.removeItem(this.storageKey);
                this.targetList = [];
                this.addNew();
            },
            timeChange: function () {
                let cache = localStorage.getItem(this.storageKey);
                if (cache) {
                    cache = JSON.parse(cache);
                    if (cache[this.realTime]) {
                        this.targetList = cache[this.realTime];
                    } else {
                        this.targetList = [];
                        this.addNew();
                    }
                } else {
                    this.targetList = [];
                    this.addNew();
                }
            },
            changeRepeatType: function (item) {
                item.frequency = [];
                if (item.repeatType === '1') {
                    //工作日
                    item.frequency = this.weekDays.slice(0, 5);
                } else if (item.repeatType === '2') {
                    item.frequency = this.weekDays.slice();
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
            generateTemplate: function () {
                let result = [];
                this.targetList.forEach(item => {
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
                let output = '';
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
                console.log("generate result ", output);
                this.generate = output;
            }

        },
        mounted: function () {

        }
    };
</script>
<style scoped lang="scss">
    .container {
        width: 50%;
        margin: 0 auto;
    }
    
    .target-input {
        width: 200px;
        margin-right: 10px;
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