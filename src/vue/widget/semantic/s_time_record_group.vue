<template>
    <div class="group">
        <s_time_record_input v-for="(item, index) in size" color="teal"
                             :selected.number="index %event.length"
                             :event="event" :id="sign + 's_time_record_input'+index"
                             :key="item"
                             @timeChange="updateTime(index,arguments)"></s_time_record_input>
        <button class="ui button" @click="parseAll">增加</button>
    </div>
</template>

<script>
    import s_time_record_input from './s_time_record_input';

    export default {
        name: "s_time_record_group",
        components: {
            s_time_record_input
        },
        data: function () {
            return {
                realSize :this.size
            }
        },
        props: {
            event: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            size: {
                type: Number,
                default: 1
            },
            sign: {
                type: String,
                default: ''
            }
        },
        methods: {
            updateTime: function (item, args) {
                for (let i = 0; i < args.length; i++) {
                    console.log("arg", args[i]);
                }
                console.log("arg", item);
            },
            parseAll: function () {
                let result = '';
                console.log("$children", this.$children);
                if(this.$children && this.$children.length > 0){
                    this.$children.forEach(child => {
                        result += child.parse();
                        result += '\r\n';
                    });
                }
                console.log("result", result);
                return result;
            },
            addNewLine: function () {
            
            }

        }
    }
</script>

<style scoped>
</style>