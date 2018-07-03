<!--日记模板-->
<template>
    <div class="container">
        <nav>
            <router-link to="/targetTemplate">
                <a href="#">设置目标</a>
            </router-link>
        </nav>
        <div class="section">
            <diary-title ref="diary_title"></diary-title>
            <h4>本周目标</h4>
            <todayTarget ref="target"></todayTarget>
            <diary_time_record ref="diary_time_record"></diary_time_record>
            <diary_inspiration ref="diary_inspiration"></diary_inspiration>
            <diary_achievement ref="diary_achievement"></diary_achievement>
            <diary_photos ref="diary_photos"></diary_photos>
            
            <button class="ui teal button make" @click="generate">make</button>
            <el-input v-if="output" ref="output" type="textarea" autosize
                      v-model="output"></el-input>
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
    import diary_inspiration from '../widget/diary_inspiration';
    import diary_achievement from '../widget/diary_achievement';
    import Diary_photos from "../widget/diary_photos";

    export default {
        components: {
            Diary_photos,
            htmlTableParser,
            todayTarget,
            todayEvent,
            todayFeeling,
            diaryTitle,
            diary_time_record,
            diary_inspiration,
            diary_achievement
        },
        data: function () {
            return {
                output: ''

            }
        },
        props: {},
        methods: {
            generate: function () {
                let result = '';

                let refs = [];
                refs.push(this.$refs.diary_title);
                refs.push(this.$refs.diary_time_record);
                refs.push(this.$refs.diary_inspiration);
                refs.push(this.$refs.diary_achievement);
                refs.push(this.$refs.diary_photos);
                refs.forEach(item => {
                    result += item.parse();
                });
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
    
    .make {
        margin: 40px;
        width: 80%;
    }
</style>