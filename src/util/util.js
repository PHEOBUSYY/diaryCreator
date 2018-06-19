/**
 * Created by yanyi on 2018/6/13.
 */
module.exports = {
    logDate: function (tag, date) {
        // console.log(tag, date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ':' + date.getDay());
    },
    newDate: function (dateStr) {
        let date = dateStr ? new Date(dateStr) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());

    },
    firstDayOfMonth: function (date) {
        let first = new Date(date.getTime());
        first.setDate(1);
        this.logDate('firstDayOfMonth', first);
        return first;
    },
    lastDayOfMonth: function (date) {
        let last = new Date(date.getTime());
        last.setMonth(last.getMonth() + 1);
        last.setDate(0);
        this.logDate('lastDayOfMonth', last);
        return last;
    },
    firstDayOfWeek: function (date) {
        let first = new Date(date.getTime());
        let day = first.getDay();
        //默认周日是第一天
        first.setDate(first.getDate() - day);
        this.logDate('firstDayOfWeek', first);
        return first;
    },
    lastDayOfWeek: function (date) {
        let last = this.firstDayOfWeek(date);
        last.setDate(last.getDate() + 6);
        this.logDate('lastDayOfWeek', last);
        return last;
    },
    beginOfCalendar: function (date) {
        let firstDay = this.firstDayOfMonth(date);
        let day = firstDay.getDay();
        //需要上个月的最后一天减去day
        let preMonth = new Date(date.getTime());
        //这里可能有问题,如果是当年的一月的话,需要验证一下
        preMonth.setMonth(date.getMonth() - 1);
        let lastDayOfPreMonth = this.lastDayOfMonth(preMonth);
        lastDayOfPreMonth.setDate(lastDayOfPreMonth.getDate() - day);
        return lastDayOfPreMonth;
    },
    getLineNumber: function (beginDate, startDate) {
        //获取一个日程属于哪一行也就是哪个周
        return parseInt(this.getDateRange(beginDate, startDate) / 7);
    },
    monthOfDays: function (date) {
        let result = [];
        let lastDayOfPreMonth = this.beginOfCalendar(date);
        for (let i = 0; i < 42; i++) {
            let temp = new Date(lastDayOfPreMonth.getTime());
            temp.setDate(temp.getDate() + i + 1);
            // this.logDate('monthOfDays', temp);
            result.push(temp);
        }
        return result;
    },
    getDateRange: function (start, end) {
        // console.log("getDaterange", start, end);
        let result = (Math.abs(end.getTime() - start.getTime())) / 1000 / 60 / 60 / 24;
        // console.log("getDateRange", result);
        return parseInt(result) + 1;
    },
    isOutofSingleLine: function (start, end) {
        return this.getWeekEnd(start) < end;
    },
    getWeekEnd: function (start) {
        let weekEnd = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
        return weekEnd;
    },
    format: function (date,hasDate) {
        if(hasDate){
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        return date.getFullYear() + "-" + (date.getMonth() + 1);
    },
    plusDate: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
    },
    parseOutofRange: function (startDate, endDate, item, maxDate) {
        //type 0,1,2,3分别对应: 单行显示,分段头部,分段中部,分段尾部
        // console.log("parseoutofrange", startDate.toDateString(), endDate.toDateString());
        let result = [];
        //拆分日程
        // if(endDate > maxDate){
        //     endDate = maxDate;
        // }
        while (startDate <= endDate) {
            let obj = {
                item: item,
                start: startDate,
                end: this.getWeekEnd(startDate) > endDate ? endDate : this.getWeekEnd(startDate),
                type: 2
            };
            result.push(obj);
            console.log("while", obj.start.toDateString(),obj.end.toDateString());
            startDate = this.plusDate(this.getWeekEnd(startDate));
        }
        result[0].type = 1;
        result[result.length -1].type = 3;
        console.log("parseOutofRange result", result);
        return result;
    },
    isSameDay: function(date1, date2){
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    },
    nextMonth: function (date) {
        let result = new Date(date.getTime());
        result.setMonth(result.getMonth() + 1);
        return result;
    },
    prevMonth: function (date) {
        let result = new Date(date.getTime());
        result.setMonth(result.getMonth() - 1);
        return result;
    },
    nextYear: function (date) {
        let result = new Date(date.getTime());
        result.setFullYear(result.getFullYear() + 1);
        return result;

    },
    prevYear: function (date) {
        let result = new Date(date.getTime());
        result.setFullYear(result.getFullYear() - 1);
        return result;

    }



};
