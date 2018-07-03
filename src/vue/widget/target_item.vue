<template>
    <div class="group">
        <div class="ui labeled action input fluid">
            <div class="ui right labeled input ">
                <div class="ui label teal" @click="starChange">
                    <i class="star icon" style="margin:0" :class="star ? '':'outline'"></i>
                </div>
                <input type="text" placeholder="写点什么吧"  @input="inputChange($event.target.value)">
                <div class="ui dropdown label teal" :id="'target_'+id">
                    <div class="text default">频率</div>
                    <i class="dropdown icon"></i>
                </div>
            </div>
        </div>
        <s_button_group v-show="checkType === 1" :checkType="checkType" v-model="checkValue"></s_button_group>
    </div>
</template>

<script>
    import S_button_group from "./semantic/s_button_group";

    export default {
        name: "target_item",
        components: {S_button_group},
        data: function () {
            return {
                dropdownEvent: [
                    {
                        name: '频率',
                        value: "0",//这里必须是字符串
                        selected: true
                    },
                    {
                        name: '自定义',
                        value: "1",//这里必须是字符串
                    },
                    {
                        name: '工作日',
                        value: "2",//这里必须是字符串
                    },
                    {
                        name: '每天',
                        value: "3",//这里必须是字符串
                    },
                ],
                checkValue:[],
                star: false,
                checkType: 0
            }
        },
        methods: {
            dropdownInit: function () {
                let dropdown = $('#target_' + this.id);
                dropdown.dropdown({
                    transition: 'drop',
                    values: this.dropdownEvent,
                    onChange: (value, text, $selectedItem) => {
                        //监听选中
                        this.checkType = parseInt(value);
                    }
                })
            },
            inputChange: function (value) {
                this.value.text = value;
                this.$emit('input',this.value);
            },
            starChange: function () {
                this.star = !this.star;
                this.value.star = this.star;
                this.$emit('input',this.value);
            }
        },
        props: {
            id: {
                type: String,
                default: 'target_item'
            },
            value: {
                type: Object,
                default: function () {
                    return {}
                }
            }
            
        },
        watch: {
            checkValue:{
                handler: function (newVal) {
                    console.log("checkValue", newVal);
                    this.value.week = newVal;
                    this.value.type = this.checkType;
                    this.$emit('input',this.value);
                },
                deep: true
            }
        },
        mounted: function () {
            this.dropdownInit();
        }
    }

</script>

<style scoped lang="scss">
    .group{
        & > div {
            margin: 5px;
        }
    }
</style>