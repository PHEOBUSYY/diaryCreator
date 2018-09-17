<template>
    <div style="width: 100%;display: flex;flex-direction: column;justify-content: center">
        <diary_section_header title="本周主题"></diary_section_header>
        <s_input color="teal" label="1" id="summary_theme"
                 v-model="value.theme" style="margin: 5px 0"></s_input>
        <diary_section_header title="本周照片"></diary_section_header>
        <s_input color="teal" label="1" id="summary_photo"
                 v-model="value.photo" style="margin: 5px 0"></s_input>
        <diary_section_header title="本周成就"></diary_section_header>
        <s_input disabled fluid color="teal" :label="(index+1)+''" :id="'summary'+index"
                 v-for="(item, index) in dataList" :key="'summary'+index"
                 v-model="dataList[index].value"></s_input>
        <diary_section_header title="需要提升的地方"></diary_section_header>
        <s_input_group_2 :dataList="value.improve"></s_input_group_2>
        <diary_section_header title="总  评"></diary_section_header>
        <s_input color="teal" label="完成度" id="summary_score"
                 v-model="value.score" style="margin: 5px 0"></s_input>
        <s_input fluid color="teal" label="总评" id="summary_all"
                 v-model="value.overall"></s_input>
    
    </div>
</template>

<script>
    import diary_section_header from './diary_section_header';
    import s_input from './semantic/s_input';
    import s_input_group_2 from './semantic/s_input_group_2'

    const ipcKey = 'inputGroup';
    const rendererKey = 'inputGroupRenderer';
    export default {
        name: "target_week_summary",
        components: {
            diary_section_header, s_input, s_input_group_2
        },
        data: function () {
            return {
                dataList: [],
                tSummary: '',
            }
        },
        props: {
            date: {
                type: String,
                default: new Date().toLocaleDateString()
            },
            value: {
                type: Object,
                default: function () {
                    return {
                        improve: [
                            {
                                value: ''
                            },
                            {
                                value: ''
                            },
                            {
                                value: ''
                            }],
                        overall: '',
                        score: '',
                        theme: '',
                        photo: ''
                    }
                }
            }
        },
        watch: {
            date: function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.getData();
                }
            }
        },
        methods: {
            getData: function () {
                if (this.$electron) {
                    this.$electron.ipcRenderer.send(ipcKey, {
                        method: 'query',
                        time: this.date,
                        type: [1],//只取成就
                    });
                }
            },
            onRenderer: function () {
                if (this.$electron) {
                    this.$electron.ipcRenderer.on(rendererKey, (event, args, res) => {
                        if (args.method === 'query') {
                            //查询结果
                            this.onQuery(res);
                        }
                    })
                }
            },
            onQuery: function (res) {
                let result = [];
                res.forEach(item => {
                    if (item && item.data) {
                        item.data.forEach(dataItem => {
                            if (dataItem && dataItem.value) {
                                let obj = {};
                                obj.fluid = true;
                                obj.color = 'teal';
                                obj.label = item.type === 1 ? '成就' : '感悟';
                                obj.value = dataItem.value;
                                result.push(obj);
                            }
                        })
                    }
                });
                this.dataList = result;
            },
            parse: function () {
                let result = '## 总结\r\n';
                if(this.value && this.value.theme){
                    result += '\r\n';
                    result += '### 本周主题\r\n';
                    result += this.value.theme;
                    result += '\r\n';
                }
                if(this.value && this.value.photo){
                    result += '\r\n';
                    result += '### 本周照片\r\n';
                    result += this.value.photo;
                    result += '\r\n';
                }
                if(this.dataList && this.dataList.length > 0){
                    result += '\r\n';
                    result += '### 本周成就\r\n';
                    let index = 1;
                    this.dataList.forEach(item => {
                        result += index +'. '+ item.value + '\r\n';
                        index ++;
                    })
                }
                if(this.value && this.value.improve){
                    result += '\r\n';
                    result += '### 需要改进的地方\r\n';
                    this.value.improve.forEach(item => {
                        result += item.value + '\r\n';
                    })
                }
                if(this.value && this.value.overall){
                    result += '\r\n';
                    result += '### 总评\r\n';
                    result += '完成度:'+this.value.score;
                    result += this.value.overall;
                    result += '\r\n';
                }
                return result;
            }
        },
        mounted: function () {
            this.onRenderer();
            this.getData();
        },
        beforeDestroy: function () {
            if (this.$electron) {
                this.$electron.ipcRenderer.removeAllListeners(rendererKey);
            }
        }
    }
</script>

<style scoped>

</style>