/**
 * Created by yanyi on 2018/6/13.
 */
let util = require('./src/util/util');
util.parseOutofRange(new Date("2018-6-1"), new Date("2018-6-10"));
// util.monthOfDays(new Date());
// function test() {
//     let array = [1,2,3,4,5,6,7,8];
//     let index = 0;
//     array.forEach(item =>{
//         if(item > 4){
//             array.push(5);
//         }else{
//             array.splice(array.indexOf(item),1);
//         }
//         console.log("index", index);
//         index  = index +1;
//     });
//     console.log("test", array);
// }
// test();