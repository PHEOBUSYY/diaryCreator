<script>
    import diary_dbhelper from './diary_dbhelper'
    const title = '今日感悟';
    export default {
        mixins:[diary_dbhelper],
        data: function () {
            return {
                dataList: [],
                title: title,
                type: 2,
            }
        }
    }
</script>