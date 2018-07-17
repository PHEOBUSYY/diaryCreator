<script>
    import diary_dbhelper from './diary_dbhelper'
    const title = '今日成就';
    export default {
        mixins:[diary_dbhelper],
        data: function () {
            return {
                dataList: [],
                title: title,
                type: 1,
            }
        }
    }

</script>
