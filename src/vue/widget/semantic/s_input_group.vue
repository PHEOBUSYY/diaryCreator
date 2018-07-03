<template>
    <div class="group">
        <s_input v-model="item.value" v-for="(item, index) in dataList" :key="index"
                 :label="item.label" :placeholder="item.placeholder"
                 :fluid="item.fluid" :color="item.color"
        ></s_input>
        <button v-if="showAdd && dataList.length>0 && dataList[dataList.length -1].value" @click="addNewLine" class="ui teal basic button mini" style="margin-top: 5px">add</button>
    </div>
</template>

<script>
    import s_input from './s_input';

    export default {
        name: "s_input_group",
        components: {s_input},
        data: function () {
            return {
            }
        },
        props: {
            dataList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            showAdd: {
                type: Boolean,
                default: false
            }
            
        },
        methods: {
            parse: function () {
                return this.dataList;
            },
            addNewLine: function () {
                this.$emit('addNewLine');
                // this.dataList = this.dataList.concat(this.dataList.slice(this.dataList.length - 1));
            }
        }
    }
</script>

<style scoped lang="scss">
    .group {
        & > div {
            margin-bottom: 5px;
            display: block;
        }
        button{
            display: inline-block;
        }
    }
</style>