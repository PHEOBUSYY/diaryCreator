<template>
    <div class="ui labeled input " :class="classList">
        <div class="ui label" :class="labelClass">
            {{label}}
        </div>
        <input :disabled="disabled" title="input" type="text" :placeholder="placeholder" @input="$emit('input', $event.target.value)" :value="value"/>
        <div v-if="rLabel" class="ui basic label">{{rLabel}}</div>
    </div>
</template>

<script>
    export default {
        name: "s_input",
        data: function () {
            return {
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
            placeholder: {
                type: String,
                default: "写点什么吧"
            },
            fluid: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: ""
            },
            value: {
                type: String,
                default: ""
            },
            disabled: {
                type: Boolean,
                default: false
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
        },
        methods: {
        }
    }
</script>

<style scoped>
    .singleLine {
        display: inline;
    }
</style>