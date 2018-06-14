<template>
    <div class="container">
        <div class="title">
            2018-06
        </div>
        <div class="week">
            <div v-for="item in weekDays">
                {{item}}
            </div>
        </div>
        <div class="month">
            <div v-for="day in days" class="day" :style="'height:'+cellHeight + 'px'">
                <div class="day-title" :style="'height:'+dayTitleHeight+'px;line-height:'+dayTitleHeight+'px'">
                    {{day.getDate()}}
                </div>
            </div>
            <div v-for="(list,oindex) in realData"
                 :style="'top:'+(dayTitleHeight + oindex* cellHeight)+'px;height:'+(cellHeight - dayTitleHeight)+'px'" class="event_container">
                <div draggable="true" class="demo" v-for="(item, index) in realData[oindex]"
                     :style="item.style"
                     :class="parseClass(item.type)"
                     v-if="index < 5"
                >{{item.item.title}}
                </div>
                <div v-if="realData[oindex].length > 5" class="event_more" @click="loadMore()">
                    <!--超过5个-->
                    <i class="el-icon-caret-bottom" style=""></i>
                </div>
            </div>
            <!--<div draggable="true" class="demo" v-for="item in mockData" :style="item.style"-->
            <!--:class="parseClass(item.type)">{{item.item.title}}-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
    import util from '../../util/util';
    import mock_calendar from '../../mock/mock_calendar.json'
    export default {
        data: function () {
            return {
                dayTitleHeight: 30,
                eventItemHeight: 20,
                cellHeight: 150,
                eventItemDivide: 2,
                weekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                //数据最终会按照周数来拆分,其中如果一个日程的跨度超过一周就拆分两个对象分别放入每个周中
                mockData: [],
                realData: []
            }
        },
        methods: {
            createData: function (json) {
                /**
                 * 需要转化的属性:top , left , width, classList
                 * @type {Array}
                 */
                let result = [];
                let list = [];
                if (json instanceof Array) {
                    json.forEach(item => {
                        let startDate = util.newDate(item.start_time);
                        let endDate = util.newDate(item.end_time);
                        if (util.isOutofSingleLine(startDate, endDate)) {
                            list = list.concat(util.parseOutofRange(startDate, endDate, item, this.days[41]));
                        } else {
                            list.push(
                                {
                                    item: item,
                                    start: startDate,
                                    end: endDate
                                });
                        }
                    });
                    list.forEach(item => {
                        //todo 跨月的日程怎么获取和展示
                        let lineNumber = util.getLineNumber(item.start, this.days[0]);
                        if (!result[lineNumber]) {
                            result[lineNumber] = [];
                        }
                        //拆分成多个的部分可能已经超出了当前月的最大日期,也可能是开始日期小于的那个月的最小日期,故不添加到这里
                        if (item.start >= this.days[0] && item.start <= this.days[41]) {
                            item.style = {
                                top: this.getTop(item.start, result[lineNumber].length),
                                left: this.getLeft(item.start),
                                width: this.getWidth(item.start, item.end),
                                height: this.eventItemHeight + 'px'
                            };
                            result[lineNumber].push(item);
                        }
                    });


                }
                this.realData = result;
                result.forEach(item => {
                    if (item) {
                        this.mockData = this.mockData.concat(item);
                    }
                });
                console.log("mockData", JSON.stringify(this.mockData));
            },
            getLineNumber: function (startDate) {
                return util.getLineNumber(this.days[0], startDate);
            },
            getLeft: function (startDate) {
                return (100 / 7 * startDate.getDay()) + "%";
            },
            getWidth: function (startDate, endDate) {
                let weekEnd = new Date(startDate.getTime());
                weekEnd.setDate(weekEnd.getDate() + 6 - weekEnd.getDay());
                let range = Math.min(util.getDateRange(startDate, endDate), util.getDateRange(startDate, weekEnd));
                return (100 / 7 * range) + "%";
            },
            getTop: function (startDate, order) {
                console.log("getTop", startDate, order);
                return ( order * (this.eventItemHeight + this.eventItemDivide)) + "px";
            },
            parseClass: function (type) {
                let classList = [''];
                if (type === 1) {
                    classList = ['start-border']
                } else if (type === 2) {
                    classList = ['middle-border']
                } else if (type === 3) {
                    classList = ['end-border']
                } else {
                    classList = ['common-border']
                }
                return classList;
            },
            loadMore: function () {
                alert(123);
            }
        },
        computed: {
            days: function () {
                return util.monthOfDays(util.newDate())
            },
        },
        mounted: function () {
            this.createData(mock_calendar);
        }
    }
</script>
<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        .title {
            border: 1px solid #f3f3f3;
            text-align: center;
        }
        .week {
            border: 1px solid #f3f3f3;
            display: flex;
            flex-direction: row;
            div {
                flex-grow: 1;
                text-align: center;
            }
        }
        .month {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            background: gray;
            position: relative;
            box-sizing: border-box;
            .day {
                background: #fdfdfd;
                width: calc(100% / 7);
                text-align: center;
                border: 1px solid gray;
                box-sizing: border-box;
                .day-title {
                    text-align: center;
                    width: 100%;
                    background: black;
                    color: white;
                }
            }
            .demo {
                background: red;
                color: white;
                position: absolute;
                text-align: center;
            }
            .start-border {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }
            .end-border {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }
            .middle-border {
            
            }
            .common-border {
                border-radius: 10px;
            }
            .event_container {
                box-sizing: border-box;
                width: 100%;
                position: absolute;
                left: 0;
                cursor: pointer;
            }
            .event_more {
                text-align: center;
                bottom: 0;
                right: 50%;
                position: absolute;
                height: 20px;
            }
        }
        
    }
</style> 