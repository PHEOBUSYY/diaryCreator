<template>
    <div class="container">
    <h3 class="ui header teal">
        <img src="https://semantic-ui.com/images/avatar2/large/patrick.png"
             class="ui circular image">
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