<template>
    <div class="container">
    <h3 class="ui header teal">
        <img src="../../css/static/img/diary.svg"
             class="ui rounded mini image">
        {{title}}
    </h3>
    </div>
</template>

<script>
    export default {
        name: "diary_section_header",
        props: {
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        margin: 25px;
    }
</style>