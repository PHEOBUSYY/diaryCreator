<template>
    <div class="ui labeled input" :class="classList">
        <div class="ui dropdown label" :class="labelClass" :id="id">
            <div class="text"></div>
            <i class="dropdown icon"></i>
        </div>
        <el-time-select style="width: 100px" :picker-options="pickOption" title="input"
                        v-model="realData.start"
                        @change="timeChange(0)"
        />
        <el-time-select style="width: 100px" :picker-options="pickOption" title="input"
                        v-model="realData.end"
                        @change="timeChange(1)"
        />
        <el-input style="width: 100px"></el-input>
        <div v-if="rLabel" class="ui basic label">{{rLabel}}</div>
    </div>
</template>

<script>
    export default {
        name: "s_input",
        data: function () {
            return {
                pickOption: {
                    start: '05:00', step: '00:10', end: '23:30'
                },
                eventOption: [],
                time: "",
                realData: this.data
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
            data: {
                type: Object,
                default: function () {
                    return {
                        start: '',
                        end: '',
                        event: ''
                    };
                },
                required: false
            },
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
                console.log("selected", this.selected);

                if (this.event && this.event.length > 0) {
                    for (let i = 0; i < this.event.length; i++) {
                        values.push({
                            name: this.event[i],
                            value: i + "",//这里必须是字符串
                            selected: i === this.selected

                        })
                    }
                }
                return values;
            },
        },
        methods: {
            getDropdownValue: function () {
                let dropdown = $('#' + this.id);
                return dropdown.dropdown('get text');//如果取值就用「get value」
            },
            parse: function () {
                this.realData.event = this.getDropdownValue();
                let result = '|' + this.getDropdownValue();
                result += '|' + this.realData.start;
                result += '|';
                result += '|' + this.realData.end;
                result += '|';
                return result;
            },
            timeChange: function (index) {
                if (index === 1) {
                    //如果是第二个时间切换，通知外部组件
                    this.$emit('timeChange', this.realData.end);
                }
            },

        },
        mounted: function () {
            let dropdown = $('#' + this.id);
            dropdown.dropdown({
                transition: 'drop',
                values: this.dropdownEvent
            });
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