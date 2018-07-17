<script>
    import diary_dbhelper from './diary_dbhelper'
    const title = '今日照片';
    export default {
        mixins:[diary_dbhelper],
        data: function () {
            return {
                title: title,
                type: 3,
                initLength: 1
            }
        }
    }
</script>