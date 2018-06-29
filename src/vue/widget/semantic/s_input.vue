<template>
    <div class="ui labeled input " :class="classList">
        <div class="ui label" :class="labelClass">
            {{label}}
        </div>
        <input title="input" type="text" :placeholder="placeHolder" v-model="value"/>
        <div v-if="rLabel" class="ui basic label">{{rLabel}}</div>
    </div>
</template>

<script>
    export default {
        name: "s_input",
        data: function () {
            return {
                value: "",
                time: "",
            }
        },
        props: {
            label: {
                type: String,
                default: 'label'
            },
            rLabel: {
                type: String,
                default: ''
            },
            placeHolder: {
                type: String,
                default: "input something"
            },
            fluid: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: ""
            }
        },
        computed: {
            classList: function () {
                let list = [];
                if (this.fluid) {
                    list.push('fluid');
                }
                return list;
            },
            labelClass: function () {
                let list = [];
                if (this.color) {
                    list.push(this.color);
                }
                return list;
            }
        },
        mounted: function () {
        }
    }
</script>

<style scoped>
    .singleLine {
        display: inline;
    }
</style>