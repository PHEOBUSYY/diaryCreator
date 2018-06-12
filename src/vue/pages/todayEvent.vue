<template>
    <div class="container">
        <table>
            <tr v-for="(item,index) in realArray" :key="index">
                <th v-if="index === 0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-input class="event-head" v-model="realArray[index][index2]"
                              @blur="onBlur(index,index2)"
                              :placeholder="'标题'+(index2+1)"></el-input>
                </th>
                <td v-if="index !==0" v-for="(item2,index2) in realArray[index]" :key="index2">
                    <el-time-select v-if="index2 < 2"
                                    class="time-pick"
                                    v-model="realArray[index][index2]"
                                    :picker-options="pickOption"
                                    @change="onTimeChange(index,index2)"
                                    @focus="onTimeFocus(index,index2)"
                                    @blur="onBlur(index,index2)"
                                    placeholder="">
                    </el-time-select>
                    <el-input v-else v-model="realArray[index][index2]"
                    ></el-input>
                </td>
            </tr>
        </table>
        <div class="bottom-btn" v-show="realArray && realArray.length > 0 && realArray[realArray.length -1] && realArray[realArray.length -1][0] ">
            <el-button @click="addNew" size="small" type="primary" icon="el-icon-plus"
                       circle></el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                row: 5,
                column: 3,
                output: '',
                realArray: null,
                pickOption: {
                    start: '05:00', step: '00:10', end: '23:30'
                },
                title: ['开始时间', '结束时间', '事项']
            }
        },
        computed: {},
        methods: {
            initRealArray: function () {
                let copyData = this.realArray ? this.realArray.slice(0) : null;
                let a = [];
                for (let i = 0; i < this.row; i++) {        //一维长度为3
                    a[i] = [];
                    for (let j = 0; j < this.column; j++) {    //二维长度为5
                        if (i === 0 && j < this.title.length) {
                            a[i][j] = this.title[j];
                        } else if (copyData && copyData.length > 0 && copyData.length > i && copyData[i].length > j && copyData[i][j]) {
                            a[i][j] = copyData[i][j];
                        } else {
                            a[i][j] = '';
                        }
                    }
                }
                this.realArray = a;
            },
            generate: function () {
                if (!this.row || !this.column) {
                    this.$message({
                        message: '请选择模板或者具体的行列数',
                        type: 'warning'
                    });
                    return;
                }
                //存储
                localStorage.setItem('data', JSON.stringify(this.realArray));
                localStorage.setItem('row', this.row);
                localStorage.setItem('column', this.column);
                this.output = this.parser2();
                return this.output;
//                    this.$refs.preview.innerHTML = this.parser();
//                    this.$nextTick(() => {
//                        this.$refs.output.select();
//                        document.execCommand("Copy");
//                        navigator.clipboard.writeText(this.output);
//                    });
            },
            parser2: function () {
                //生成一个row * column的markdown table
                let result = '\n';

                for (let i = 0; i < this.realArray.length; i++) {
                    let sp = '';
                    let line = '';
                    let isEmpty = true;
                    for (let j = 0; j < this.realArray[i].length; j++) {
                        if (this.realArray[i][0] && this.realArray[i][1]) {
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
                if (column === 1 && !this.realArray[row][0]) {
                    this.$message({
                        message: '请选择开始时间',
                        type: 'warning'
                    });
                    return;
                }
                if (column === 1 && row > 1 && this.realArray[row][0]) {
                    this.$set(this.pickOption, 'start', this.realArray[row][0]);
                }
            },
            onBlur: function (row, column) {
                if (this.realArray[row][column]) {

                }
            },
            onTimeChange: function (row, column) {
                if (column === 1 && row + 1 < this.realArray.length && this.realArray[row][column]) {
                    //设置完第二列直接把下面那一行的第一列赋值
                    //注意这里vue无法监听数组中内容的变化,需要通过$set来重新赋值
                    let temp = this.realArray[row + 1].slice(0);
                    temp[0] = this.realArray[row][column];
                    this.$set(this.realArray, row + 1, temp);
                }
            },
            addNew: function () {
                this.row = this.row + 2;
                this.initRealArray();
            }
        },
        mounted: function () {
            this.initRealArray();
        }
    }
</script>
<style scoped lang="scss">
    .container {
        /*width: 50%;*/
    }
    
    .time-pick {
        width: 100px;
    }
    
    .event-head {
    }
</style> 