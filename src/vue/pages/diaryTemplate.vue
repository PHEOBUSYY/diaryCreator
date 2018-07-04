<!--日记模板-->
<template>
    <div class="">
        <div class="content">
            <div class="ui breadcrumb ">
                <a class="section labeled teal active">首页</a>
                <div class="divider"> | </div>
                <a class="section labeled teal " href="#" @click="$router.push({path: '/targetTemplate'})">
                    目标
                </a>
            </div>
        
            <diary-title ref="diary_title"></diary-title>
            <diary_achievement ref="diary_achievement"></diary_achievement>
            <diary_time_record ref="diary_time_record"></diary_time_record>
            <diary_target ref="diary_target"></diary_target>
            <diary_inspiration ref="diary_inspiration"></diary_inspiration>
            <diary_photos ref="diary_photos"></diary_photos>
            
            <button class="ui teal button make" @click="generate">make</button>
            <el-input v-if="output" ref="output" type="textarea" autosize
                      v-model="output"></el-input>
        </div>
    </div>

</template>
<script>
    import diary_target from '../widget/diary_target.vue'
    import diaryTitle from '../widget/diary_title';
    import diary_time_record from '../widget/diary_time_record';
    import diary_inspiration from '../widget/diary_inspiration';
    import diary_achievement from '../widget/diary_achievement';
    import Diary_photos from "../widget/diary_photos";

    export default {
        components: {
            Diary_photos,
            diary_target,
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
                refs.push(this.$refs.diary_achievement);
                refs.push(this.$refs.diary_time_record);
                refs.push(this.$refs.diary_target);
                refs.push(this.$refs.diary_inspiration);
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
    .content {
        width: 50%;
        text-align: center;
        margin: 0 auto;
    }
    
    .make {
        margin: 40px;
        width: 80%;
    }
</style>