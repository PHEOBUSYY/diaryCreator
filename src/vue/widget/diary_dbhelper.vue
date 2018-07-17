<template>
    <div class="container">
        <diary_section_header :title="title"></diary_section_header>
        <s_input_group :showAdd="showAdd" :dataList="dataList" @addNewLine="addNewLine"></s_input_group>
        <!--<button @click="save" class="ui teal basic button mini" style="margin-top: 5px">save-->
        <!--</button>-->
    </div>

</template>

<script>
    import S_input_group from "./semantic/s_input_group";
    import Diary_section_header from "./diary_section_header";

    const rendererKey = 'inputGroupRenderer';
    const ipcKey = 'inputGroup';
    export default {
        components: {Diary_section_header, S_input_group},
        data: function () {
            return {
                title: '',
                dataList: [],
                initLength: 3,
                originObj: {
                    value: ''//原始对象
                },
                showAdd: true
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
        },
        methods: {
            addNewLine: function () {
                let obj = {value: ''};
                let option = {};
                if(this.dataList.length < this.styleOption.length){
                    option = this.styleOption[this.dataList.length];
                }else{
                    option = this.styleOption[0];
                }
                this.dataList.push(this.wrap(obj,option));
            },
            parse: function () {
                this.save();
                let result = '\n';
                if (this.dataList.length > 0) {
                    result += '### ' + this.title + '\n\n';
                    this.dataList.forEach(item => {
                        result += '- ' + item.value + "\n";
                    });
                    result += '\n';
                }
                return result;
            },
            save: function () {
                if(this.$electron){
                    this.$electron.ipcRenderer.send(ipcKey, {
                        method: 'create',
                        time: this.date,
                        type: this.type,
                        data: this.dataList.filter(item => {
                            return item.value;
                        }).map(item => {
                            return {
                                value: item.value
                            }
                        })
                    });
                }
              
            },
            wrap: function (obj,option) {
                //包裹数据库对象+样式对象
                Object.keys(option).forEach(key => {
                    obj[key] = option[key];
                });
                return obj;
            },
            onRenderer: function () {
                if(!this.$electron){
                    return;
                }
                this.$electron.ipcRenderer.on(rendererKey, (event, args, res) => {
                    let method = args.method;
                    let type = args.type;
                    if (type === this.type) {
                        // console.log(rendererKey, args, res);
                        if (method === 'get') {
                            // console.log("ipcRenderer get", JSON.stringify(res));
                            this.onGet(res);
                        } else if (method === 'delete') {
                        } else if (method === 'create') {
                        }
                    }

                })
            },
            onGet: function (res) {
                this.dataList = [];
                // console.log("diary_dbhelper renderer get", res);
                if (res && res.data && res.data.length > 0) {
                    for (let i =0 ;i< res.data.length ;i ++){
                        let item = res.data[i];
                        let obj = {value: item.value};
                        let option = {};
                        if(i < this.styleOption.length){
                            option = this.styleOption[i];
                        }else{
                            option = this.styleOption[0];
                        }
                        this.dataList.push(this.wrap(obj,option))
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
                    if(i < this.styleOption.length){
                        option = this.styleOption[i];
                    }else{
                        option = this.styleOption[0];
                    }
                    this.dataList.push(this.wrap(obj,option))
                }
            },
            initData: function () {
                if (this.$electron) {
                    this.$electron.ipcRenderer.send(ipcKey, {
                        method: 'get',
                        time: this.date,
                        type: this.type,
                    });
                } else {
                    this.initDefault();
                }
            }
        },
        mounted: function () {
            this.onRenderer();
            this.initData();
        }
    }
</script>

<style scoped>
    .container {
        padding: 15px;
    }
</style>