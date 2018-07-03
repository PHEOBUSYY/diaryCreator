<template>
    <div class="container">
        <diary_section_header title="今日感悟"></diary_section_header>
        <s_input_group show-add :dataList="dataList" @addNewLine="addNewLine"></s_input_group>
    </div>
</template>

<script>
    import S_input_group from "./semantic/s_input_group";
    import Diary_section_header from "./diary_section_header";

    export default {
        name: "diary_inspiration",
        components: {
            Diary_section_header,
            S_input_group,
        },
        data: function () {
            return {
                dataList: []
            }
        },
        methods: {
            mockDefault: function(){
              return {
                  value: '',
                  fluid: true,
                  color: 'teal',
                  placeholder: '请输入感悟',
                  label: '今日感悟'
              }
            },
            addNewLine: function () {
                this.dataList = this.dataList.concat([this.mockDefault()])
            },
            parse: function () {
                let result = '\n';
                result += '### 今日感悟\n';
                if(this.dataList.length > 0){
                    this.dataList.forEach(item =>{
                        result += '- ' +item.value + "\n";
                    });
                    result += '\n';
                }
                return result;
            }
        },
        mounted: function () {
            for (let i = 1; i <= 3; i++) {
                this.dataList.push(this.mockDefault())
            }
        }

    }
</script>

<style scoped lang="scss">
    .container {
        padding:15px
    }
</style>