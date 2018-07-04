<template>
    <div class="group">
        <s_time_record_input v-for="(item, index) in dataList" color="teal"
                             :selected.number="index %event.length"
                             :event="event" :id="sign + 's_time_record_input'+index"
                             :key="index"
                             :data="item"
                             :pickRange="pickRange"
                             @timeChange="updateTime(index,arguments)"></s_time_record_input>
        <button v-if="dataList.length>0 && dataList[dataList.length - 1].end" @click="addNewLine" class="ui teal basic button mini" style="margin-top: 5px">add</button>
    </div>
</template>

<script>
    import s_time_record_input from './s_time_record_input';

    export default {
        name: "s_time_record_group",
        components: {
            s_time_record_input
        },
        data: function () {
            return {
                realSize :this.size,
                dataList: []
            }
        },
        props: {
            event: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            size: {
                type: Number,
                default: 1
            },
            sign: {
                type: String,
                default: ''
            },
            pickRange: {
                type:Object,
                default: function () {
                    return {};
                }
            }
        },
        methods: {
            updateTime: function (index, args) {
                let itemData = args[0];//当前行对象
                this.$set(this.dataList,index,itemData);
                if(index < this.dataList.length -1){
                    //把当前行的end时间设置为下一行的start
                    let nextData = this.dataList[index + 1];
                    nextData.start = itemData.end;
                    this.$set(this.dataList,index+1,nextData);
                }
            },
            parse: function () {
                let result = '';
                if(this.dataList.length > 0){
                    this.dataList.forEach(item => {
                            if(item.start && item.end){
                                result += '|' + item.event || '';
                                result += '|' + item.start|| '';
                                result += '|' + item.end|| '';
                                result += '|' + item.remark|| '';
                                result += '|\n';
                            }
                    })
                }
                console.log("result time group", result);
                return result;
            },
            addNewLine: function () {
                this.dataList = this.dataList.concat([{
                    start: '',
                    end: '',
                    event: '',
                    remark: ''
                }])
            },
            initDataList: function () {
                for(let i =0;i<this.realSize;i++){
                    this.dataList.push({
                        start: '',
                        end: '',
                        event: ''
                    })
                }
            }

        },
        mounted: function () {
            this.initDataList();
        }
    }
</script>

<style scoped lang="scss">
    .group {
        & > div {
            margin-bottom: 5px;
        }
    }
</style>