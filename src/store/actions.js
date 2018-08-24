export default {
    increment (context) {
        setTimeout(function () {
            context.commit('increment');
        },3000);
    }
}