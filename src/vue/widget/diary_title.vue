<template>
    <div class="container">
        <diary_section_header title="标题"></diary_section_header>
        <s_input_group :dataList="dataList"></s_input_group>
    </div>
</template>

<script>
    import S_input_group from "./semantic/s_input_group";
    import Diary_section_header from "./diary_section_header";

    export default {
        name: "diary_title",
        components: {
            Diary_section_header,
            S_input_group,
        },
        data: function () {
            return {
                dataList: [
                    {
                        value: '',
                        fluid: true,
                        color: 'teal',
                        label: '今日标题',
                        placeholder: '请输入标题'
                    },
                    {
                        value: '',
                        fluid: true,
                        color: 'teal',
                        label: '名言名句',
                        placeholder: '请输入名言名句'
                    },
                    {
                        value: '',
                        fluid: true,
                        color: 'teal',
                        label: '个人点评',
                        placeholder: '请输入个人点评'
                    }
                ],
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            }
        },
        methods: {
            createDefaultTitle: function () {
                let date = new Date();
                return this.weekDays[date.getDay() - 1];
            },
            parse: function () {
                let result = '\n';
                if (this.dataList.length > 0) {
                    for (let i = 0; i < this.dataList.length; i++) {
                        if (i === 0) {
                            result += '## '+this.createDefaultTitle() +':'+this.dataList[i].value +'\n';
                        } else if (i === 1) {
                            result += '### 每日金句\n';
                            result += '> '+this.dataList[i].value+'\n'
                        } else if (i === 2) {
                            result += '- '+this.dataList[i].value+'\n'
                        }
                    }
                    result += '\n';
                }
                return result;
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding: 15px;
    }

</style>