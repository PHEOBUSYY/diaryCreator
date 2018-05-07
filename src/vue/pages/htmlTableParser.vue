<template>
    <div class="container">
        <div class="input">
            行
            <el-input v-model.number="row" class="row_input"></el-input>
            列
            <el-input v-model.number="column" class="column_input"></el-input>
        </div>
        <label>请输入表格内容</label>
        <table>
            <tr v-for="(item,index) in realArray" :key="index">
                <th v-if="index === 0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-input v-model="realArray[index][index2]" @change="inputChange"
                              @focus="inputFocus" @blur="inputBlur"
                              placeholder="点击输入表头内容"></el-input>
                </th>
                <td v-if="index !==0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-time-select v-if="index2 < 2"
                                    v-model="realArray[index][index2]"
                                    :picker-options="pickOption"
                                    @change="onTimeChange(index,index2)"
                                    placeholder="选择时间">
                    </el-time-select>
                    <el-input v-else v-model="realArray[index][index2]"
                              @change="inputChange"></el-input>
                </td>
            </tr>
        </table>
        <label>预览</label>
        <div ref="preview">
        </div>
        <button @click="genarate">生成</button>
        <textarea class="output" row="30" ref="output" title="output" v-model="output"></textarea>
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
                    start: '05:00',step: '00:15',end: '23:30'
                }
            }
        },
        computed: {},
        watch: {
//            realArray: function (newD, old) {
//                console.log("data old", old);
//                console.log("data new", newD);
//            },
            row: function () {
                this.initRealArray();
            },
            column: function () {
                this.initRealArray();
            }
        },
        methods: {
//            pickOption: function () {
//              return {
//                  start: '05:00',step: '00:15',end: '23:30'
//              };
//            },
            initRealArray: function () {
                console.log("row", this.row);
                console.log("column", this.column);
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
            genarate: function (e) {
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
//                    alert("Copied the text: " +    this.$refs.output.value);
                });

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
                        if(this.realArray[i][j] ){
                            isEmpty = false;
                        }
                        let tag = i === 0 ? 'th' : 'td';
                        line += '    <' + tag + '>\n';
                        line += "        " + this.realArray[i][j] ? this.realArray[i][j] : '' + "\n";
                        line += '    </' + tag + '>\n';
                    }
                    if(!isEmpty){
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
                        if(this.realArray[i][j]){
                            isEmpty = false;
                        }
                        line += "|" + this.realArray[i][j];
                        if (i === 0) {
                            //表头
                            sp += "|:---:";
                        }
                    }
                    line += "|\n";
                    if(!isEmpty){
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
            inputChange: function (e) {
            },
            inputOn: function (e) {
            },
            inputFocus: function (e) {
            },
            inputBlur: function (e) {
            },
            onTimeChange: function (row, column) {

                if (column === 1 && row +1 < this.realArray.length && this.realArray[row][column]) {
                    //设置完第二列直接把下面那一行的第一列赋值
                    //注意这里vue无法监听数组中内容的变化,需要通过$set来重新赋值
                    let temp = this.realArray[row+1].slice(0);
                    temp[0] = this.realArray[row][column];
                    this.$set(this.realArray,row + 1,temp);
                    this.$set(this.pickOption,'start',this.realArray[row+1][0]);
                }
            }
        },
        mounted: function () {
            this.copyData = JSON.parse(localStorage.getItem('data'));
            this.row = localStorage.getItem('row');
            this.column = localStorage.getItem('column');
            this.realArray = this.initRealArray();
        }
    }
</script>
<style lang="scss">
    table, td, th {
        border: 1px solid #ddd;
        padding: 8px;
        border-collapse: collapse;
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
        background-color: #4CAF50;
        color: white;
        input {
            &:first-child {
                /*color: white;*/
            }
        }
    }
    
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    
    td:hover {
        background-color: #ddd;
    }
</style>
<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
    }
    
    .output {
        height: 400px;
    }
    
    .row_input, .column_input {
        width: 100px;
        height: 50px;
        margin: 10px;
    }
    
    .column_input {
    }
    
    button {
        height: 50px;
        width: 80%;
        margin: 10px auto;
        background: #133533;
        color: white;
    }
</style>