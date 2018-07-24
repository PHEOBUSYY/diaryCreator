<template>
    <div class="group">
        <s_input :disabled="config.disabled" v-model="item.value" v-for="(item, index) in dataList" :key="index"
                 :label="item.label || config.label || (index +1) +''" :placeholder="config.placeholder"
                 :fluid="config.fluid" :color="config.color"
        ></s_input>
        <button v-if="showAdd && dataList.length>0 && dataList[dataList.length -1].value" @click="addNewLine" class="ui teal basic button mini" style="margin-top: 5px">add</button>
    </div>
</template>

<script>
    import s_input from './s_input';

    export default {
        name: "s_input_group",
        components: {s_input},
        props: {
            dataList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            config: {
                type:Object,
                default: function () {
                    return {
                        label: '',
                        fluid: true,
                        color: 'teal',
                        placeholder: '写点什么',
                        disabled: false
                    }
                }
            },
            showAdd: {
                type: Boolean,
                default: false
            }
            
        },
        methods: {
            addNewLine: function () {
                this.$emit('addNewLine');
            }
        }
    }
</script>

<style scoped lang="scss">
    .group {
        width: 100%;
        & > div {
            margin-bottom: 5px;
            display: block;
        }
        button{
            display: inline-block;
        }
    }
</style>