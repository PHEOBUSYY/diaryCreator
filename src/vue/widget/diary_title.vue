<script>
    import diary_dbhelper from './diary_dbhelper'

    const title = '标题';
    const labelArray = ['今日标题', '每日金句', '个人点评'];
    const placeholderArray = ['请输入标题', '请输入名言名句', '请输入个人点评'];
    export default {
        mixins: [diary_dbhelper],
        data: function () {
            return {
                dataList: [],
                title: title,
                type: 4,
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                showAdd: false
            }
        },
        computed: {
            styleOption: function () {
                let result = [];
                for (let i = 0; i < labelArray.length; i++) {
                    result.push({
                        fluid: true,
                        color: 'teal',
                        label: labelArray[i],
                        placeholder: placeholderArray[i]
                    })
                }
                return result;
            },
            weekDay: function () {
                let date = new Date(this.date);
                return this.weekDays[date.getDay() - 1];
            }
        },
        methods: {
            parse: function () {
                this.save();
                let result = '\n';
                if (this.dataList.length > 0) {
                    for (let i = 0; i < this.dataList.length; i++) {
                        if (i === 0) {
                            result += '## ' + this.weekDay + ':' + this.dataList[i].value + '\n';
                        } else if (i === 1) {
                            result += '### 每日金句\n';
                            result += '> ' + this.dataList[i].value + '\n'
                        } else if (i === 2) {
                            result += '- ' + this.dataList[i].value + '\n'
                        }
                    }
                    result += '\n';
                }
                return result;
            }
        }
    }

</script>