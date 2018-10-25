<!--日记模板-->
<template>
    <div class="">
        <div class="content">
            <div class="ui breadcrumb ">
                <a class="section labeled teal active">首页</a>
                <div class="divider"> |</div>
                <a class="section labeled teal " href="#"
                   @click="$router.push({path: '/target'})">
                    目标
                </a>
            </div>
            <div class="date">
                <a class="section labeled teal active" @click="preDay"><</a>
                <a class="section labeled teal active"
                   @click="changeDate3"><span>{{date}}</span></a>
                <a class="section labeled teal active" @click="nextDay">></a>
            </div>
            <diary-title :date="date" ref="diary_title"></diary-title>
            <diary_achievement :date="date" ref="diary_achievement"></diary_achievement>
            <diary_time_record2 :date="date" ref="diary_time_record"></diary_time_record2>
            <diary_target :date="date" ref="diary_target"></diary_target>
            <diary_inspiration :date="date" ref="diary_inspiration"></diary_inspiration>
            <diary_photos :date="date" ref="diary_photos"></diary_photos>
            
            <button class="ui teal button make" @click="remove">remove</button>
            <button class="ui teal button make" @click="make">make</button>
        
        </div>
    </div>

</template>
<script>
    import diary_target from '../widget/diary_target.vue'
    import diaryTitle from '../widget/diary_title';
    import diary_time_record2 from '../widget/diary_time_record_2';
    import diary_inspiration from '../widget/diary_inspiration';
    import diary_achievement from '../widget/diary_achievement';
    import Diary_photos from "../widget/diary_photos";
    import {EventBus} from "../../Events";
    import {
        SYSTEM,
        PRE,
        NEXT,
        save,
        QUIT,
        SYSTEM_QUIT,
        NEXT_ROUTER,
        ONSHOW,
        ONBLUR,
        ONFOCUS,
        SYSTEM_COPY
    } from '../../store/mutation-types'

    export default {
        components: {
            Diary_photos,
            diary_target,
            diaryTitle,
            diary_time_record2,
            diary_inspiration,
            diary_achievement,
        },
        data: function () {
            return {
                date: new Date().toLocaleDateString(),
                refsArray: []
            }
        },
        watch: {
            date: function (newVal, oldVal) {
                if(newVal !== oldVal){
                    this.save();
                }
            }
        },
        methods: {
            make: function () {
                this.save();
                this.generate();
            },
            save: function(){
                this.refsArray.forEach(ref =>{
                    if(ref){
                        ref.save();
                    }
                })
            },
            clear: function(){
                this.refsArray.forEach(ref =>{
                    if(ref){
                        ref.del();
                    }
                })
            },
            initRefsArray: function(){
                let diary_title = this.$refs.diary_title;
                let diary_achievement = this.$refs.diary_achievement;
                let diary_time_record = this.$refs.diary_time_record;
                let diary_target = this.$refs.diary_target;
                let diary_inspiration = this.$refs.diary_inspiration;
                let diary_photos = this.$refs.diary_photos;
                this.refsArray.push(diary_title);
                this.refsArray.push(diary_achievement);
                this.refsArray.push(diary_time_record);
                this.refsArray.push(diary_target);
                this.refsArray.push(diary_inspiration);
                this.refsArray.push(diary_photos);
            },
            //适用于前台点击保存
            generate: function () {
                let result = '';
                this.refsArray.forEach(ref => {
                    result += ref.parse();
                });
                let msg = '内容已粘贴到剪切板';
                this.showMessage(msg);
                this.$store.commit(SYSTEM_COPY, result);
            },
            showMessage: function (msg) {
                    this.$message({
                        message: msg,
                        type: 'success'
                    });
            },
            preDay: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() - 1);
                this.date = date.toLocaleDateString();
            },
            nextDay: function () {
                let date = new Date(this.date);
                date.setDate(date.getDate() + 1);
                this.date = date.toLocaleDateString();
            },
            changeDate3: function () {
                this.date = new Date().toLocaleDateString();
            },
            remove: function () {
                this.clear();
                this.showMessage('删除成功');
            }
        },
        mounted: function () {
            //初始化refs引用
            this.initRefsArray();
            EventBus.$on(SYSTEM, (data) => {
                if (data.action === PRE) {
                    this.preDay();
                } else if (data.action === NEXT) {
                    this.nextDay();
                } else if (data.action === save) {
                    this.save();
                } else if (data.action === QUIT) {
                    this.save();
                    this.$store.dispatch(SYSTEM_QUIT);
                } else if (data.action === NEXT_ROUTER) {
                    this.$router.push({path: '/target'});
                } else if (data.action === ONSHOW) {
                    //todo 这里还没有想好如何满足切换时间
                    // let dateStr = new Date().toLocaleDateString();
                    // if (dateStr !== this.date) {
                    //     this.date = dateStr;
                    // }
                } else if (data.action === ONBLUR) {
                    //undo
                } else if (data.action === ONFOCUS) {
                    //undo
                }
            });
        },
        beforeDestroy: function () {
            this.save();
            EventBus.$off(SYSTEM);
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