<template>
    <div class="ui buttons">
        <button class="ui button teal" @click="checkItem(index)"
                :class="item.checked ? 'active':''" v-for="(item,index) in dataList" :key="index">
            {{item.title}}
        </button>
    </div>
</template>

<script>
    export default {
        name: "s_button_group",
        data: function () {
            return {
                week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                dataList: []
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
            init: function () {
                this.week.forEach(item => {
                    this.dataList.push({
                        title: item,
                        checked: false
                    })
                })
            },
            changeCheck: function (type) {
                console.log("changeCheck", type);
                //这个时候dom元素并没有完全变化，需要等待下次渲染完成回调才能显示出来，所以使用nextTick
                this.$nextTick(function () {
                    if (type === 2) {
                        //工作日
                        for (let i = 0; i < this.dataList.length; i++) {
                            let item = this.dataList[i];
                            item.checked = i < 5;
                            this.$set(this.dataList, i, item);
                        }
                    } else if (type === 3) {
                        //每天
                        for (let i = 0; i < this.dataList.length; i++) {
                            let item = this.dataList[i];
                            item.checked = true;
                            this.$set(this.dataList, i, item);
                        }
                    } else if (type === 1 || type === 0) {
                        //自定义
                        for (let i = 0; i < 7; i++) {
                            let item = this.dataList[i];
                            item.checked = false;
                            this.$set(this.dataList, i, item);
                        }
                    }
                    let result = this.getCheckedList();
                    console.log("changeCheck", JSON.stringify(this.dataList));
                    console.log("changeCheck", JSON.stringify(result));
                    this.$emit('input', result);
                })
             
            },
            getCheckedList: function () {
                let result = [];
                this.dataList.forEach(item => {
                    if (item.checked) {
                        result.push(item.title);
                    }
                });
                return result;
            },
            checkItem: function (index) {
                let item = this.dataList[index];
                item.checked = !item.checked;
                this.$set(this.dataList, index, item);
                this.$emit('input',this.getCheckedList())
            }
        },
        mounted: function () {
            this.init();
        }
    }
</script>

<style scoped>

</style>