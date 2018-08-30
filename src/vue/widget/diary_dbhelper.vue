<template>
    <div class="container">
        <diary_section_header :title="title"></diary_section_header>
        <s_input_group :showAdd="showAdd" :dataList="dataList"
                       @addNewLine="addNewLine"></s_input_group>
        <!--<button @click="save" class="ui teal basic button mini" style="margin-top: 5px">save-->
        <!--</button>-->
    </div>

</template>

<script>
    import S_input_group from "./semantic/s_input_group";
    import Diary_section_header from "./diary_section_header";
    import {
        INPUTGROUP_SENDIPC,
        INPUTGROUP_GETOBJ,
        METHOD_GET,
        METHOD_DELETE,
        METHOD_CREATE
    } from '../../store/mutation-types'

    export default {
        components: {Diary_section_header, S_input_group},
        data: function () {
            return {
                title: '',
                dataList: [],
                initLength: 3,
                showAdd: true,
                parseResult: ''
            }
        },
        props: {
            date: {
                type: String,
                default: "",
                required: true
            }
        },
        watch: {
            date: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.initData();
                }
            },
            inputGroupObj: {
                handler: function (newVal) {
                    // console.log("inputGroupObj", newVal);
                    this.onGet(newVal);
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            styleOption: function () {
                return [{
                    fluid: true,
                    color: 'teal',
                    label: this.title,
                    placeholder: '请输入' + this.title
                }]
            },
            inputGroupObj: function () {
                return this.$store.getters[INPUTGROUP_GETOBJ](this.date, this.type);
            }
        },
        methods: {
            addNewLine: function () {
                let obj = {value: ''};
                let option = {};
                if (this.dataList.length < this.styleOption.length) {
                    option = this.styleOption[this.dataList.length];
                } else {
                    option = this.styleOption[0];
                }
                this.dataList.push(this.wrap(obj, option));
            },
            parse: function () {
                //渲染为markdown
                this.save();
                let result = '\n';
                if (this.dataList.length > 0) {
                    result += '### ' + this.title + '\n\n';
                    this.dataList.forEach(item => {
                        if (item.value) {
                            result += '- ' + item.value + "\n";
                        }
                    });
                    result += '\n';
                }
                return result;
            },
            isChange: function () {
                return this.parseResult !== JSON.stringify(this.dataList);
            },
            save: function () {
                if (this.isChange()) {

                    this.$store.dispatch(INPUTGROUP_SENDIPC, {
                        method: METHOD_CREATE,
                        time: this.date,
                        type: this.type,
                        data: this.dataList.map(item => {
                            return {
                                value: item.value
                            }
                        })
                    });
                    this.parseResult = JSON.stringify(this.dataList);
                }
            },
            del: function () {
                this.$store.dispatch(INPUTGROUP_SENDIPC, {
                    method: METHOD_DELETE,
                    time: this.date,
                    type: this.type
                });
            },
            isEmpty: function () {
                return this.dataList.filter(item => {
                    return item.value;
                }).length === 0;
            },
            wrap: function (obj, option) {
                //包裹数据库对象+样式对象
                Object.keys(option).forEach(key => {
                    obj[key] = option[key];
                });
                return obj;
            },
            onGet: function (resultList) {
                this.dataList = [];

                if (resultList && resultList.length > 0) {
                    for (let i = 0; i < resultList.length; i++) {
                        let item = resultList[i];
                        let option = {};
                        if (i < this.styleOption.length) {
                            option = this.styleOption[i];
                        } else {
                            option = this.styleOption[0];
                        }
                        this.dataList.push(this.wrap(item, option))
                    }
                } else {
                    this.initDefault();
                }
            },
            initDefault: function () {
                this.dataList = [];
                for (let i = 0; i < this.initLength; i++) {
                    let obj = {value: ""};
                    let option = {};
                    if (i < this.styleOption.length) {
                        option = this.styleOption[i];
                    } else {
                        option = this.styleOption[0];
                    }
                    this.dataList.push(this.wrap(obj, option))
                }
            },
            initData: function () {
                this.$store.dispatch(INPUTGROUP_SENDIPC, {
                    method: METHOD_GET,
                    time: this.date,
                    type: this.type
                });
            }
        },
        mounted: function () {
            this.initData();
        }
    }
</script>

<style scoped>
    .container {
        padding: 15px;
    }
</style>