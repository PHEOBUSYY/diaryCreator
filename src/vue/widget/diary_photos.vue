<template>
    <div class="container">
        <diary_section_header :title="title"></diary_section_header>
        <s_input_group show-add :dataList="dataList" @addNewLine="addNewLine"></s_input_group>
    </div>

</template>

<script>
    import S_input_group from "./semantic/s_input_group";
    import Diary_section_header from "./diary_section_header";
    const title = '今日照片';
    export default {
        name: "diary_photos",
        components: {Diary_section_header, S_input_group},
        data: function () {
            return {
                title: title,
                dataList: [
                    {
                        value: '',
                        fluid: true,
                        color: 'teal',
                        label: title,
                        placeholder: '请输入照片名称'
                    }
                ]
            }
        },
        methods: {
            addNewLine: function () {
                this.dataList = this.dataList.concat([{
                    value: '',
                    fluid: false,
                    color: 'teal',
                    label: title,
                    placeholder: '请输入照片名称'
                }]);
            },
            parse: function () {
                let result = '\n';
                result += '### '+this.title+'\n\n';
                if (this.dataList.length > 0) {
                    this.dataList.forEach(item => {
                        result += '- ' + item.value + "\n";
                    });
                    result += '\n';
                }
                return result;
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 15px;
    }
</style>