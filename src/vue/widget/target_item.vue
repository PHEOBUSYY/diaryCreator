<template>
    <div class="group">
        <div class="ui fluid right labeled input ">
            <div class="ui label teal" @click="starChange">
                <i class="star icon" style="margin:0" :class="value.star ? '':'outline'"></i>
            </div>
            <input type="text" placeholder="写点什么吧" v-model="value.text"
                   @input="inputChange($event.target.value)">
            <div class="ui dropdown label teal" :id="sid">
                <div class="text default">频率</div>
                <i class="dropdown icon"></i>
            </div>
        </div>
        <s_button_group v-show="value.type === 1" :checkType="value.type"
                        v-model="value.week"></s_button_group>
    </div>
</template>

<script>
    import S_button_group from "./semantic/s_button_group";
    import S_input from "./semantic/s_input";

    const dropdownEvent = [
        {
            name: '频率',
            value: "0",//这里必须是字符串
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
    ];
    export default {
        name: "target_item",
        components: {S_input, S_button_group},
        data: function () {
            return {
                dropdown: null
            }
        },
        methods: {
            changeDropdownEvent: function () {
                this.dropdown.dropdown('set selected', this.value.type + '');
            },
            dropdownInit: function () {
                this.dropdown = $('#' + this.sid);
                dropdownEvent.forEach(item => {
                    item.selected = item.value === this.value.type + ''
                });
                this.dropdown.dropdown({
                    transition: 'drop',
                    values: dropdownEvent,
                    onChange: (dvalue, text, $selectedItem) => {
                        //监听选中
                        // console.log("dropdown", dvalue);
                        this.value.type = Number.parseInt(dvalue)
                    }
                })
            },
            inputChange: function (value) {
                this.value.text = value;
                this.$emit('input', this.value);
            },
            starChange: function () {
                this.value.star = !this.value.star;
                this.$emit('input', this.value);
            }
        },
        props: {
            sid: {
                type: String,
                default: ''
            },
            value: {
                type: Object,
                default: function () {
                    return {
                        star: false,
                        editable: false,
                        type: 0,
                        text: '',
                        week: []
                    }
                },
            }

        },
        watch: {
            value: {
                handler: function (newVal, oldVal) {
                    if (oldVal.type !== newVal.type) {
                        this.changeDropdownEvent();
                    }
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
    .group {
        width: 100%;
        & > div {
            margin: 5px;
        }
    }
</style>