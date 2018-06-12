<template>
    <div class="container">
        <div v-for="(item, index) in feeling">
            <el-input class="target-input" autosize clearable
                      v-model="feeling[index]"></el-input>
            <!--<el-button @click="del(index)" size="small" type="danger" icon="el-icon-delete"-->
                       <!--circle v-show="item"></el-button>-->
        </div>
        <div class="bottom-btn" v-show="feeling.length >2 && feeling[2]">
            <el-button @click="addNew" size="small" type="primary" icon="el-icon-plus"
                       circle></el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                feeling: []
            }
        },
        methods: {
            addNew: function () {
                this.feeling.push("")
            },
            del: function (index) {
                this.feeling.splice(index, 1);
            },
            generate: function () {
                let result = '';
                result += '\r\n';
                for(let i =0 ;i < this.feeling.length ;i ++) {
                    result += '- '+ this.feeling[i]+ '\r\n';
                }
                result += '\r\n';
                return result;
            }
        },
        mounted: function () {
            this.feeling = ['', '', ''];
        }
    }
</script>
<style scoped lang="scss">
    .container {
        /*width: 50%;*/
        margin: 0 auto;
        text-align: left;
    }
    
    .target-input {
        /*width: 85%;*/
        /*margin-right: 10px;*/
    }

</style> 