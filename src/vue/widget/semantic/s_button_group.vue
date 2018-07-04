<template>
    <div class="ui buttons">
        <button class="mini ui button teal" @click="checkItem(index)"
                :class="dataList.indexOf(item) >-1 ? 'active':''" v-for="(item,index) in week"
                :key="index">
            {{item}}
        </button>
    </div>
</template>

<script>
    export default {
        name: "s_button_group",
        data: function () {
            return {
                week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                dataList: this.value
            }
        },
        props: {
            checkType: {
                type: Number,
                default: 0
            },
            value: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        watch: {
            checkType: {
                handler: function (newVal) {
                    this.changeCheck(newVal);
                },
                immediate: true//如果不加这个属性，初次赋值的时候watch不会触发
            }
        },
        methods: {
            changeCheck: function (type) {
                //这个时候dom元素并没有完全变化，需要等待下次渲染完成回调才能显示出来，所以使用nextTick
                this.$nextTick(function () {
                    if (type === 2) {
                        //工作日
                        this.dataList = this.week.slice(0, 5);
                    } else if (type === 3) {
                        //每天
                        this.dataList = this.week.slice(0, 7);
                    } else if (type === 1 || type === 0) {
                        //自定义
                        this.dataList = this.value;
                    }
                    this.$emit('input', this.dataList);
                })

            },
            checkItem: function (index) {
                if(this.value.indexOf(this.week[index]) > -1){
                    //删除
                    this.dataList.splice(this.dataList.indexOf(this.week[index]),1);
                }else{
                    this.dataList.push(this.week[index]);
                }
                this.$emit('input', this.dataList)
            }
        },
        mounted: function () {
        }
    }
</script>

<style scoped>

</style>