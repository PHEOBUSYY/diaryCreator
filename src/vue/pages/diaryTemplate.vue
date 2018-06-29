<!--日记模板-->
<template>
    <div class="container">
        <nav>
            <router-link to="/targetTemplate">
                <a href="#">设置目标</a>
            </router-link>
        </nav>
        <div class="section">
            <diary-title></diary-title>
            <!--<h4>标题</h4>-->
            <!--<el-input v-model="title" class="new_input"></el-input>-->
            <!--<el-input v-model="subTitle"></el-input>-->
            <!--<h4>每日金句</h4>-->
            <!--<el-input autosize v-model="diaryNote"></el-input>-->
            <!--<h5>点评</h5><el-input autosize v-model="diaryNoteComment"></el-input>-->
            <h4>本周目标</h4>
            <todayTarget ref="target"></todayTarget>
            <diary_time_record></diary_time_record>
            <h4>时间记录</h4>
            <todayEvent ref="event"></todayEvent>
            <h4>感悟</h4>
            <today-feeling ref="feeling"></today-feeling>
            <h4>每日照片</h4>
            <el-input v-model="picNote"></el-input>
            <el-button style="margin: 10px" type="primary" @click="generate">生成</el-button>
            <el-input ref="output" type="textarea" autosize v-model="output"></el-input>
        </div>
    </div>

</template>
<script>
    import htmlTableParser from './htmlTableParser.vue';
    import todayTarget from './todayTarget.vue'
    import todayEvent from './todayEvent.vue'
    import todayFeeling from './todayFeeling.vue'
    import diaryTitle from '../widget/diary_title';
    import diary_time_record from '../widget/diary_time_record';

    export default {
        components: {
            htmlTableParser, todayTarget, todayEvent, todayFeeling, diaryTitle, diary_time_record
        },
        data: function () {
            return {
                weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                title: '',
                subTitle: '',
                diaryNote: '',
                diaryNoteComment: '',
                picNote: '',
                output: ''

            }
        },
        props: {},
        methods: {
            createDefaultTitle: function () {
                let date = new Date();
                return this.weekDays[date.getDay() - 1];
            },
            generate: function () {
                let result = '';
                if (this.title) {
                    result += '## ' + this.title;
                } else {
                    result += '## ' + this.createDefaultTitle();
                }
                if (this.subTitle) {
                    result += '- ' + this.subTitle;
                }
                result += '\r\n';

                result += '### 每日金句\r\n';
                result += '> ' + this.diaryNote + '\r\n';
                result += '- ' + this.diaryNoteComment + '\r\n';
                result += '\r\n';

                result += this.$refs.target.generate();
                result += '\r\n';
                result += '### 今日记录\r\n';
                result += this.$refs.event.generate();

                result += '\r\n';
                result += '### 今日感悟\r\n';
                result += this.$refs.feeling.generate();

                result += '\r\n';
                result += '### 今日照片\r\n';
                result += '\r\n';
                result += '\r\n';
                result += this.picNote + '\r\n';
                result += '\r\n';
                console.log("result", result);
                this.output = result;
                this.$nextTick(() => {
                    this.$refs.output.select();
                    document.execCommand("Copy");
                    navigator.clipboard.writeText(this.output);
                });
            }
        },
        mounted: function () {
        }
    }
</script>
<style scoped lang="scss">
    .container {
    }
    
    .section {
        width: 50%;
        text-align: center;
        margin: 0 auto;
        /*color: white;*/
    }
</style>