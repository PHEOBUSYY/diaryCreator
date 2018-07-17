<template>
    <div class="ui labeled input" :class="classList">
        <div class="ui dropdown label" :class="labelClass" :id="id">
            <div class="text"></div>
            <i class="dropdown icon"></i>
        </div>
        <el-time-select style="width: 100px" :picker-options="pickRange" title="input"
                        v-model="value.start"
                        @change="dataChange(0)"
        />
        <el-time-select style="width: 100px" :picker-options="pickRange" title="input"
                        v-model="value.end"
                        @change="dataChange(1)"
        />
        <el-input style="width: 100px" v-model="value.remark"></el-input>
        <div v-if="rLabel" class="ui basic label">{{rLabel}}</div>
    </div>
</template>

<script>
    export default {
        name: "s_input",
        components: {},
        data: function () {
            return {
                eventOption: [],
                time: "",
            }
        },
        props: {
            selected: {
                type: Number,
                default: 0
            },
            rLabel: {
                type: String,
                default: ''
            },
            fluid: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: ""
            },
            event: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            id: {
                type: String,
                default: '',
                required: true
            },
            value: {
                type: Object,
                default: function () {
                    return {
                        start: '',
                        end: '',
                        event: '',
                        remark: ''
                    };
                },
                required: false
            },
            pickRange: {
                type: Object,
                default: function () {
                    return {
                        start: '05:00', step: '00:10', end: '23:30'
                    }
                }
            }
        },
        computed: {
            classList: function () {
                let list = [];
                if (this.fluid) {
                    list.push('fluid');
                }
                return list;
            },
            labelClass: function () {
                let list = ['w100'];
                if (this.color) {
                    list.push(this.color);
                }
                return list;
            },
            dropdownEvent: function () {
                let values = [];

                if (this.event && this.event.length > 0) {
                    for (let i = 0; i < this.event.length; i++) {
                        values.push({
                            name: this.event[i],
                            value: i + "",//这里必须是字符串
                            selected: this.event[i] === this.value.event ? this.event[i] === this.value.event  :  i === this.selected

                        })
                    }
                }
                return values;
            },
            // timeOptionStart: function(){
            //     return this.realData.start;
            // },
            // timeOptionEnd: function(){
            //     return this.realData.start;
            // },

        },
        // watch: {
        //     timeOptionStart: function (newData) {
        //       if(newData){
        //           // this.$set(this.pickOption,'start',newData);
        //       }
        //   }
        // },
        methods: {
            dataChange: function (index) {
                // if (!this.realData.start) {
                //     this.realData.start = '';
                // }
                // if (!this.realData.end) {
                //     this.realData.end = '';
                // }
                // if (!this.realData.remark) {
                //     this.realData.remark = '';
                // }
                // this.$emit('input',this.value);
                this.$emit('timeChange', this.value);
            },
            dropdownInit: function () {
                let dropdown = $('#' + this.id);
                dropdown.dropdown({
                    transition: 'drop',
                    values: this.dropdownEvent,
                    onChange: (value, text) => {
                        //监听选中
                        this.value.event = text;
                        this.dataChange();
                    }
                })
            }

        },
        mounted: function () {
            this.dropdownInit();
        }
    }
</script>

<style scoped lang="scss">
    .w100 {
        min-width: 90px;
        display: flex;
        justify-content: center;
    }
</style>