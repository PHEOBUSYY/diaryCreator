<template>
    <div class="container">
        <div class="title">
            <div slot="start">
                <el-button size="mini" type="button" class="picker-btn" @click="today">今天</el-button>
            </div>
            <div>
                <!--<el-button size="mini" type="button" class="picker-btn" @click="previewYear"><<</el-button>-->
                <el-button size="mini" type="button" class="picker-btn" @click="previewMonth"><</el-button>
                <span class="pickTitle" v-if="!pickMode" @click="changePickMode" style="margin:0 5px">{{dateFormat}}</span>
                <el-date-picker
                        @blur="togglePickMode"
                        v-if="pickMode"
                        class="picker"
                        size="mini"
                        v-model="pickDate"
                        align="center"
                        type="month"
                        placeholder="选择月">
                </el-date-picker>
                <el-button size="mini" type="button" class="picker-btn" @click="nextMonth">></el-button>
                <!--<el-button size="mini" type="button" class="picker-btn" @click="nextYear">>></el-button>-->
            </div>
            <div slot="end">
                <el-button plain size="mini">安排任务</el-button>
                <el-button plain size="mini">添加计划</el-button>
            </div>
        </div>
        <div class="week">
            <div v-for="item in weekDays">
                {{item}}
            </div>
        </div>
        <div class="month"
             :class="{ [animationClass]: animated }"
             @animationend="removeAnimation"
        >
            <div v-for="day in days" class="day" :style="'height:'+cellHeight + 'px'">
                <div class="day-title"
                     :style="'height:'+dayTitleHeight+'px;line-height:'+dayTitleHeight+'px;'">
                    {{day.getDate()}}
                </div>
            </div>
            <div v-for="(list,oindex) in realData"
                 :style="'top:'+(dayTitleHeight + oindex* cellHeight)+'px;height:'+(cellHeight - dayTitleHeight)+'px'"
                 class="event_container">
                <div draggable="true" class="event" v-for="(item, index) in list"
                     :style="item.style"
                     :class="parseClass(item.type)"
                     @click="eventClick(item)"
                     v-if="index < 5"
                >
                    <el-icon class="el-icon-date" style="color:white;margin-right: 5px"></el-icon>
                    {{item.item.title}}
                </div>
                <div v-if="realData[oindex] && realData[oindex].length > 5" class="event_more"
                     @click="loadMore()">
                    <!--超过5个-->
                    <i class="el-icon-caret-bottom"></i>
                </div>
            </div>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
        >
            <div v-if="curEvent">
                <span v-html="curEvent.item.title"></span>
                <div>
                    开始日期:{{curEvent.item.start_time}}
                </div>
                <div>
                    结束日期:{{curEvent.item.end_time}}
                </div>
                <div>
                    创建日期:{{curEvent.item.create_time}}
                </div>
            </div>
            
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    
    </div>
</template>
<script>
    import util from '../../util/util';
    import mock_calendar from '../../mock/mock_calendar.json'

    export default {
        data: function () {
            return {
                dayTitleHeight: 25,
                eventItemHeight: 18,
                cellHeight: 140,
                eventItemDivide: 2,
                weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                //数据最终会按照周数来拆分,其中如果一个日程的跨度超过一周就拆分两个对象分别放入每个周中
                realData: [],
                curDate: this.date,
                animated: false,
                direction: 'Left',
                curEvent: null,
                dialogVisible: false,
                pickMode: false,
                pickDate: ''
            }
        },
        props: {
            date: {
                type: Date,
                default: function () {
                    return new Date();
                }
            }
        },
        watch: {
            curDate(val, old) {
                if (old) {
                    if (val < old) {
                        this.direction = 'Right'
                    }
                    if (val > old) {
                        this.direction = 'Left'
                    }
                }

                if (val !== old) {
                    this.animated = true;
                    this.createData();
                }
            }
        },
        methods: {
            createData: function () {
                let json = mock_calendar;
                let list = this.filterAndFormatEvent(json);
                this.realData = this.renderEvent(list);
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
                // console.log("getTop", startDate, order);
                return (order * (this.eventItemHeight + this.eventItemDivide)) + "px";
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
                alert('加载更多');
            },
            previewYear: function () {
                this.curDate = util.prevYear(this.curDate);
            },
            previewMonth: function () {
                this.curDate = util.prevMonth(this.curDate);
            },
            nextYear: function () {
                this.curDate = util.nextYear(this.curDate);
            },
            nextMonth: function () {
                this.curDate = util.nextMonth(this.curDate);
            },
            today: function () {
                this.curDate = new Date();
            },
            removeAnimation: function () {
                this.animated = false;
            },
            filterAndFormatEvent: function (json) {
                //根据服务器返回的数据列表来过滤event数据
                let list = [];
                if (json instanceof Array) {
                    json.forEach(item => {
                        let startDate = util.newDate(item.start_time);
                        let endDate = util.newDate(item.end_time);
                        if (util.isOutofSingleLine(startDate, endDate)) {
                            //超出范围的数据需要格式化
                            list = list.concat(util.parseOutofRange(startDate, endDate, item));
                        } else {
                            list.push(
                                {
                                    item: item,
                                    start: startDate,
                                    end: endDate
                                });
                        }
                    });
                }
                return list;
            },
            renderEvent: function (list) {
                //渲染事件
                let result = [];
                list.forEach(item => {
                    //拆分成多个的部分可能已经超出了当前月的最大日期,也可能是开始日期小于的那个月的最小日期,故不添加到这里
                    // console.warn("curDate range", util.format(this.days[0], true), util.format(this.days[41], true));
                    // console.warn("item range",item.item.title, util.format(item.start, true),util.format(item.end, true));
                    // console.warn('item 是否匹配', (item.start >= this.days[0] && item.end <= this.days[41]) ? '匹配' : '不匹配');
                    if (item.start >= this.days[0] && item.end <= this.days[41]) {
                        let lineNumber = util.getLineNumber(item.start, this.days[0]);
                        if (!result[lineNumber]) {
                            result[lineNumber] = [];
                        }
                        //这里有一层过滤
                        item.style = {
                            top: this.getTop(item.start, result[lineNumber].length),
                            left: this.getLeft(item.start),
                            width: this.getWidth(item.start, item.end),
                            height: this.eventItemHeight + 'px'
                        };
                        result[lineNumber].push(item);
                    }
                });
                return result;
            },
            eventClick: function (item) {
                this.dialogVisible = true;
                this.curEvent = item;
                console.log("click event", item);
            },
            changePickMode: function () {
                this.pickMode = true;
                this.pickDate = this.dateFormat;
            },
            togglePickMode: function () {
                this.pickMode = !this.pickMode;
                //回写一下日期
                this.curDate = new Date(this.pickDate);
            }


        },
        computed: {
            days: function () {
                return util.monthOfDays(this.curDate)
            },
            dateFormat: function () {
                return util.format(this.curDate);
            },
            animationClass: function () {
                return 'sc-moveTo' + this.direction;
            }
        },
        mounted: function () {
            this.createData();
        }
    }
</script>
<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        padding: 16px;
        background: #ffffff;
        .picker-btn {
            border: 0;
            outline: 0;
            cursor: pointer;
            background: transparent;
            color: #afafaf;
        }
        .pickTitle{
            padding: 5px;
            cursor: pointer;
        }
        .pickTitle:hover{
            background: #8ccbff;
            border-radius: 5px;
        }
        .picker-btn:hover {
            background: #8ccbff;
        }
        .picker{
            width: 110px;
            text-align: center;
            border: 0;
        }
        .title {
            padding: 5px;
            border: 1px solid #f3f3f3;
            color: #afafaf;
            font-size: 13px;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        .week {
            color: #afafaf;
            border: 1px solid #f3f3f3;
            font-size: 12px;
            padding: 10px;
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
                border: 1px solid #f3f3f3;
                box-sizing: border-box;
                .day-title {
                    text-align: right;
                    width: 100%;
                    font-size: 10px;
                    color: #6f6f6f;
                }
            }
            .event {
                background: #8ccbff;
                color: #000;
                position: absolute;
                cursor: pointer;
                font-size: 10px;
                text-align: left;
                padding-left: 10px;
                box-sizing: border-box;
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
            }
            .event_more {
                text-align: center;
                bottom: 0;
                right: 50%;
                position: absolute;
                height: 20px;
                cursor: pointer;
            }
        }
        
    }
    
    .sc-moveToLeft {
        animation: scMoveToLeft .3s both;
    }
    
    .sc-moveToRight {
        animation: scMoveToRight .3s both;
    }
    
    @keyframes scMoveToLeft {
        from {
            transform: translate3d(50%, 0, 0);
            visibility: visible;
        }
        
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes scMoveToRight {
        from {
            transform: translate3d(-50%, 0, 0);
            visibility: visible;
        }
        
        to {
            transform: translate3d(0, 0, 0);
        }
    }
</style> 