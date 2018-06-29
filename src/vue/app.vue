<template>
    <div>
        
        <!--<h2 class="ui header">-->
        <!--<img src="/images/avatar2/large/patrick.png" class="ui circular image">-->
        <!--Patrick-->
        <!--</h2>-->
        <!--<div class="ui animated button" tabindex="0" @click="showModal">-->
        <!--<div class="visible content">Next</div>-->
        <!--<div class="hidden content">-->
        <!--<i class="right arrow icon"></i>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="ui labeled button" tabindex="0">-->
        <!--<div class="ui red button">-->
        <!--<i class="heart icon"></i> Like-->
        <!--</div>-->
        <!--<a class="ui basic red left pointing label">-->
        <!--1,048-->
        <!--</a>-->
        <!--</div>-->
        <!--<div class="ui labeled button" tabindex="0">-->
        <!--<div class="ui basic blue button">-->
        <!--<i class="fork icon"></i> Forks-->
        <!--</div>-->
        <!--<a class="ui basic left pointing blue label">-->
        <!--1,048-->
        <!--</a>-->
        <!--</div>-->
        <!--<div class="ui input">-->
        <!--<input type="text" placeholder="Search...">-->
        <!--</div>-->
        <!--<div class="ui modal">-->
        <!--<i class="close icon"></i>-->
        <!--<div class="header">-->
        <!--Profile Picture-->
        <!--</div>-->
        <!--<div class="image content">-->
        <!--<div class="ui medium image">-->
        <!--</div>-->
        <!--<div class="description">-->
        <!--<div class="ui header">We've auto-chosen a profile image for you.</div>-->
        <!--<p>We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>-->
        <!--<p>Is it okay to use this photo?</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="actions">-->
        <!--<div class="ui black deny button">-->
        <!--Nope-->
        <!--</div>-->
        <!--<div class="ui positive right labeled icon button">-->
        <!--Yep, that's me-->
        <!--<i class="checkmark icon"></i>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="ui compact menu">-->
        <!--<a class="item">-->
        <!--<i class="icon mail"></i> Messages-->
        <!--<div class="floating ui red label">22</div>-->
        <!--</a>-->
        <!--<a class="item">-->
        <!--<i class="icon users"></i> Friends-->
        <!--<div class="floating ui teal label">22</div>-->
        <!--</a>-->
        <!--</div>-->
        <div style="padding: 20px">
            <div class="ui dropdown">
                <div class="text">File</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item">New</div>
                    <div class="item">
                        <span class="description">ctrl + o</span>
                        Open...
                    </div>
                    <div class="item">
                        <span class="description">ctrl + s</span>
                        Save as...
                    </div>
                    <div class="item">
                        <span class="description">ctrl + r</span>
                        Rename
                    </div>
                    <div class="item">Make a copy</div>
                    <div class="item">
                        <i class="folder icon"></i>
                        Move to folder
                    </div>
                    <div class="item">
                        <i class="trash icon"></i>
                        Move to trash
                    </div>
                    <div class="divider"></div>
                    <div class="item">Download As...</div>
                    <div class="item">
                        <i class="dropdown icon"></i>
                        Publish To Web
                        <div class="menu">
                            <div class="item">Google Docs</div>
                            <div class="item">Google Drive</div>
                            <div class="item">Dropbox</div>
                            <div class="item">Adobe Creative Cloud</div>
                            <div class="item">Private FTP</div>
                            <div class="item">Another Service...</div>
                        </div>
                    </div>
                    <div class="item">E-mail Collaborators</div>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import s_input from './widget/semantic/s_input';

    export default {
        components: {
            s_input
        },
        methods: {
            showModal: function () {
                alert('123');
                $('.ui.modal').modal('show');
            }
        },
        mounted: function () {
            console.log("model", JSON.stringify($('.ui.modal')));

        }
    }
</script>
