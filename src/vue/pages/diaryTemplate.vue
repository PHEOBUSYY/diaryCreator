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
                <a class="section labeled teal active"
                   @click="changeDate3"><span>{{date}}</span></a>
                <a class="section labeled teal active" @click="changeDate2">></a>
            </div>
            <diary-title :date="date" ref="diary_title"></diary-title>
            <diary_achievement :date="date" ref="diary_achievement"></diary_achievement>
            <diary_time_record :date="date" ref="diary_time_record"></diary_time_record>
            <diary_target :date="date" ref="diary_target"></diary_target>
            <diary_inspiration :date="date" ref="diary_inspiration"></diary_inspiration>
            <diary_photos :date="date" ref="diary_photos"></diary_photos>
            
            <button class="ui teal button make" @click="remove">remove</button>
            <button class="ui teal button make" @click="generate(false)">make</button>
        
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
                date: new Date().toLocaleDateString(),
                
            }
        },
        methods: {
            //组件内容是否变化
            isContentChange: function(){
            
            },
            //isAuto 是否为自动保存
            generate: function (isAuto) {
                let result = '';
                let diary_title = this.$refs.diary_title;
                let diary_achievement = this.$refs.diary_achievement;
                let diary_time_record = this.$refs.diary_time_record;
                let diary_target = this.$refs.diary_target;
                let diary_inspiration = this.$refs.diary_inspiration;
                let diary_photos = this.$refs.diary_photos;
                let refs = [];
                refs.push(diary_title);
                refs.push(diary_achievement);
                refs.push(diary_time_record);
                refs.push(diary_target);
                refs.push(diary_inspiration);
                refs.push(diary_photos);
                //这些组件中必须包含两个方法： parse和isChange
                let isChange = false;
                let isEmpty = true;
                refs.forEach(item => {
                    if(!item.isEmpty()){
                        isEmpty = false;
                    }
                });
                refs.forEach(item => {
                    if(item !== diary_target && item.isChange()){
                        isChange = true;
                    }
                });
                let msg = '';
                if(isAuto && isChange && !isEmpty){
                    refs.forEach(item => {
                        result += item.parse();
                    });
                    this.output = result;
                    msg = '内容已自动保存';
                    this.showMessage(msg)
                }
                if(!isAuto && !isEmpty){
                    refs.forEach(item => {
                        result += item.parse();
                    });
                    this.output = result;
                    msg = '内容已成功粘贴到剪切板';
                    this.showMessage(msg)
                }else{
                    this.$message({
                        message: '请输入内容后再保存',
                        type: 'error'
                    });
                }
            },
            showMessage: function(msg){
                try {
                    if (this.$electron) {
                        this.$electron.clipboard.writeText(this.output);
                    } else {
                        document.execCommand("Copy");
                    }
                    this.$message({
                        message: msg,
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
            },
            remove: function () {
                let diary_title = this.$refs.diary_title;
                let diary_achievement = this.$refs.diary_achievement;
                let diary_time_record = this.$refs.diary_time_record;
                let diary_target = this.$refs.diary_target;
                let diary_inspiration = this.$refs.diary_inspiration;
                let diary_photos = this.$refs.diary_photos;
                let refs = [];
                refs.push(diary_title);
                refs.push(diary_achievement);
                refs.push(diary_time_record);
                refs.push(diary_target);
                refs.push(diary_inspiration);
                refs.push(diary_photos);
                let isEmpty = true;
                refs.forEach(item => {
                   if(!item.isEmpty()){
                       isEmpty = false;
                   }
                });
                if(isEmpty){
                    this.$message({
                        message: '请输入内容后再删除',
                        type: 'error'
                    });
                }else{
                    refs.forEach(item => {
                        item.del();
                    });
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                
            }
        },
        mounted: function () {
            if (this.$electron) {
                this.$electron.ipcRenderer.on('schedule', (event, args) => {
                    //日程，接收到日程的通知后，自动保存
                    if (args === 'autosave') {
                        this.generate(true);
                    }
                });
            }
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