/**
 * Created by yanyi on 2018/6/13.
 */
let util = require('./src/util/util');
// test('adds 1 + 2 to equal 3', () => {
//     expect(util.sum(1, 2)).toBe(3);
// });
// test('isOutofSingleLine ',() => {
//    expect(util.isOutofSingleLine(util.newDate('2018-06-01'),util.newDate('2018-06-05'))).toBeTruthy();
// });
// test('test',()=>{
// })
test('the prevMonth of month 1',()=>{
    let date = new Date();
    date.setMonth(0);
    expect(util.prevMonth(date).getFullYear()).toBe(2017);
    expect(util.prevMonth(date).getMonth()).toBe(11);
});
test('prevMonth',()=>{
    let date = new Date();
    expect(util.prevMonth(date).getMonth()).toBe(4);
});
test('prevYear',()=>{
    let date = new Date();
    expect(util.prevYear(date).getFullYear()).toBe(2017);
});
test('nextYear',()=>{
    let date = new Date();
    expect(util.nextYear(date).getFullYear()).toBe(2019);
});
test('nextMonth',()=>{
    let date = new Date();
    expect(util.nextMonth(date).getMonth()).toBe(6);
});


