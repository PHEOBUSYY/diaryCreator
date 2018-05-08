<template>
    <div class="container">
        <h2>Markdown Table Parser</h2>
        <h3>html样式转换成markdown的table格式工具</h3>
        <div class="input">
            <el-select v-model="template" placeholder="模板" class="template_input" @change="templateChange">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            /
           
           行
           
           
           <el-input v-model.number="row" class="row_input"></el-input>
            列
            
            
            <el-input v-model.number="column" class="column_input"></el-input>
            
           
            
            
            
        </div>
        <h4>请输入表格内容</h4>
        <table>
            <tr v-for="(item,index) in realArray" :key="index">
                <th v-if="index === 0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-input v-model="realArray[index][index2]"
                              placeholder="表头"></el-input>
                </th>
                <td v-if="index !==0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-time-select v-if="index2 < 2 && template === 'time'"
                                    v-model="realArray[index][index2]"
                                    :picker-options="pickOption"
                                    @change="onTimeChange(index,index2)"
                                    @focus="onTimeFocus(index,index2)"
                                    placeholder="">
                    </el-time-select>
                    <el-input v-else v-model="realArray[index][index2]"
                              ></el-input>
                </td>
            </tr>
        </table>
        <!--<label>预览</label>-->
        <div ref="preview">
        </div>
        <el-button type="primary" @click="btnClick" >{{state === 0 ? '点击生成': '清空'}}</el-button>
        <h4>输出</h4>
        <textarea class="output" ref="output" title="output" v-model="output"></textarea>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                row: '',
                column: '',
                output: '',
                copyData: [],
                testTime: '',
                realArray: null,
                pickOption: {
                    start: '05:00', step: '00:15', end: '23:30'
                },
                options: [
                    {
                        value: 'time',
                        label: '时间记录'
                    },
                    {
                        value: 'thinking',
                        label: '心得感悟'
                    }, {
                        value: 'other',
                        label: '其他'
                    }
                ],
                template: '',
                state: 0
            }
        },
        computed: {},
        watch: {
            row: function () {
                this.initRealArray();
            },
            column: function () {
                this.initRealArray();
            }
        },
        methods: {
            initRealArray: function () {
                let a = [];
                for (let i = 0; i < this.row; i++) {        //一维长度为3
                    a[i] = [];
                    for (let j = 0; j < this.column; j++) {    //二维长度为5
                        if (this.copyData && this.copyData.length > 0 && this.copyData.length > i && this.copyData[i].length > j && this.copyData[i][j]) {
                            a[i][j] = this.copyData[i][j];
                        } else {
                            a[i][j] = '';
                        }
                    }
                }
                if (this.row > 0 && this.column > 0) {
                    this.copyData = a;
                }
                this.realArray = a;
            },
            btnClick: function () {
                if(!this.row || !this.column){
                    this.$message({
                        message: '请选择模板或者具体的行列数',
                        type: 'warning'
                    });
                    return ;
                }
                if(this.state === 0){
                    //存储
                    localStorage.setItem('data', JSON.stringify(this.copyData));
                    localStorage.setItem('row', this.row);
                    localStorage.setItem('column', this.column);
                    this.output = this.parser2();
                    this.$refs.preview.innerHTML = this.parser();
                    this.$nextTick(() => {
//                    navigator.clipboard.writeText(this.output);
                        this.$refs.output.select();
                        document.execCommand("Copy");
                        navigator.clipboard.writeText(this.output);
                        this.state = 1;
                    });
                }else{
                    this.copyData = [];
                    this.initRealArray();
                    localStorage.setItem('data', "");
                    this.$refs.preview.innerHTML = '';
                    this.output = '';
                    this.state = 0;
                    localStorage.setItem('row', '');
                    localStorage.setItem('column', '');
                }
                

            },
            parser: function () {
                //生成一个row * column的table
                let result = '<table>\n';
                for (let i = 0; i < this.realArray.length; i++) {
                    if (i % 2 === 0) {
                        result += '  <tr style="background: #f2f2f2">\n';
                    } else {
                        result += '  <tr style="background: #ffffff">\n';
                    }
                    let line = '';
                    let isEmpty = true;
                    for (let j = 0; j < this.realArray[i].length; j++) {
                        if (this.realArray[i][j]) {
                            isEmpty = false;
                        }
                        let tag = i === 0 ? 'th' : 'td';
                        line += '    <' + tag + '>\n';
                        line += "        " + this.realArray[i][j] ? this.realArray[i][j] : '' + "\n";
                        line += '    </' + tag + '>\n';
                    }
                    if (!isEmpty) {
                        result += line;
                    }
                    result += "  </tr>\n";
                }
                result += "</table>\n";
                return result;
            },
            parser2: function () {
                //生成一个row * column的markdown table
                let result = '\n';

                for (let i = 0; i < this.realArray.length; i++) {
                    let sp = '';
                    let line = '';
                    let isEmpty = true;
                    for (let j = 0; j < this.realArray[i].length; j++) {
                        if (this.realArray[i][j]) {
                            isEmpty = false;
                        }
                        line += "|" + this.realArray[i][j];
                        if (i === 0) {
                            //表头
                            sp += "|:---:";
                        }
                    }
                    line += "|\n";
                    if (!isEmpty) {
                        result += line;
                    }
                    if (i === 0) {
                        //如果是第一行,需要在后面追加"|---|---|----|"
                        sp += "|\n";
                        result += sp;
                    }
                }
                result += "\n";
                return result;
            },
            onTimeFocus: function (row, column) {
                if(column === 1){
                    this.$set(this.pickOption, 'start', this.realArray[row][0]);
                }
            },
            onTimeChange: function (row, column) {

                if (column === 1 && row + 1 < this.realArray.length && this.realArray[row][column]) {
                    //设置完第二列直接把下面那一行的第一列赋值
                    //注意这里vue无法监听数组中内容的变化,需要通过$set来重新赋值
                    let temp = this.realArray[row + 1].slice(0);
                    temp[0] = this.realArray[row][column];
                    this.$set(this.realArray, row + 1, temp);
//                    this.$set(this.pickOption, 'start', this.realArray[row][0]);
                }
            },
            templateChange: function () {
                if(this.template === 'time'){
                    this.row = '15';
                    this.column = '4';
                }else if(this.template === 'thinking'){
                    this.row = '10';
                    this.column = '2';
                }else{
                    this.row = '3';
                    this.column = '3';
                }
            }
        },
        mounted: function () {
            if(localStorage.getItem('data')){
                this.copyData = JSON.parse(localStorage.getItem('data'));
            }
            this.row = localStorage.getItem('row');
            this.column = localStorage.getItem('column');
            this.realArray = this.initRealArray();
        }
    }
</script>
<style lang="scss">
    table, td, th {
        /*border: 1px solid #ddd;*/
        padding: 8px;
        /*border-collapse: collapse;*/
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    }
    
    input {
        text-align: center;
    }
    
    table {
        width: 90%;
        margin: 10px;
        padding: 10px;
    }
    
    td, th {
        text-align: center;
        vertical-align: center;
        padding: 5px;
        width: 50px;
        height: 40px;
        input {
            width: 100%;
            height: 100%;
            border: none;
            background: none;
        }
    }
    
    th {
        padding-top: 12px;
        padding-bottom: 12px;
        /*background-color: #bec0bf;*/
        /*color: white;*/
    }
    
    tr:nth-child(even) {
        /*background-color: #f2f2f2;*/
    }
    
    td:hover {
        /*background-color: #ddd;*/
    }
</style>
<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
    }
    .input{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .output {
        height: 400px;
    }
    
    .row_input, .column_input {
        width: 100px;
        margin: 20px;
    }
    button {
        height: 45px;
        width: 60%;
        margin: 10px auto;
        /*background: #2c7dc9;*/
        color: white;
        border-radius: 9px;
    }
    .template_input {
        width: 200px;
        margin: 20px;
    }
</style>