<template>
   <div class="container">
       <h3 class="ui header teal">
           <img src="https://semantic-ui.com/images/avatar2/large/patrick.png" class="ui circular image">
           标题
       </h3>
       <s_input label="今日标题" color="teal" place-holder="请输入标题" fluid></s_input>
       <s_input label="名言名句" color="teal" place-holder="请输入名言名句" fluid></s_input>
       <s_input label="个人点评" color="teal" place-holder="请输入个人点评" fluid></s_input>
   </div>
</template>

<script>
    import s_input from './semantic/s_input';
    export default {
        name: "diary_title",
        components: {
            s_input
        }
    }
</script>

<style scoped lang="scss">
    .container{
        & > div {
            &:first-child{
                margin:5px 0 25px;
            }
            &:not(first-child){
                margin: 5px;
            }
        }
    }
   
</style>