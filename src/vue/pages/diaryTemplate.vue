<!--日记模板-->
<template>
    <div class="">
        <div class="content">
            <div class="ui breadcrumb ">
                <a class="section labeled teal active">首页</a>
                <div class="divider"> |</div>
                <a class="section labeled teal " href="#"
                   @click="$router.push({path: '/targetTemplate'})">
                    目标
                </a>
            </div>
            <div class="date">
                <a class="section labeled teal active" @click="changeDate"><</a>
                <a class="section labeled teal active" @click="changeDate3"><span>{{date}}</span></a>
                <a class="section labeled teal active" @click="changeDate2">></a>
            </div>
            <diary-title :date="date" ref="diary_title"></diary-title>
            <diary_achievement :date="date" ref="diary_achievement"></diary_achievement>
            <diary_time_record :date="date" ref="diary_time_record"></diary_time_record>
            <diary_target :date="date" ref="diary_target"></diary_target>
            <diary_inspiration :date="date" ref="diary_inspiration"></diary_inspiration>
            <diary_photos :date="date" ref="diary_photos"></diary_photos>
            
            <button class="ui teal button make" @click="generate">make</button>
            <!--<el-input v-if="output" ref="output" type="textarea" autosize-->
                      <!--v-model="output"></el-input>-->
        
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
                output: '',
                date: new Date().toLocaleDateString()
            }
        },
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
                try {
                    // if (this.$refs.output) this.$refs.output.select();
                    if(this.$electron){
                        this.$electron.clipboard.writeText(this.output);
                    }else{
                        document.execCommand("Copy");
                    }
                    this.$message({
                        message: '内容已成功粘贴到剪切板',
                        type: 'success'
                    });
                } catch (e) {
                    console.log(e);
                }
            },
            changeDate: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() - 1);
                this.date = date.toLocaleDateString();
            },
            changeDate2: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() + 1);
                this.date = date.toLocaleDateString();
            },
            changeDate3: function () {
                this.date = new Date().toLocaleDateString();
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
    }
    
    .date {
        margin: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
    }
</style>