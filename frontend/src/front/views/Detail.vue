<template>
    <div class="detail">
        <div class="title">
            <h1>{{article.title}}</h1>
            <p>
                <span><i class="el-icon-edit-outline"></i>{{article.cTime}}</span>
                <span><i class="el-icon-collection-tag"></i>{{article.tags.join("、")}}</span>
                <span><i class="el-icon-view"></i>{{read}}</span>
            </p>
        </div>
        <div class="page-content">
           <Viewer
            :value="article.text"
            /> 
        </div>
    </div>
</template>
<script>
import 'tui-editor/dist/tui-editor-contents.css';
import 'highlight.js/styles/github.css';
import { Viewer } from '@toast-ui/vue-editor';
import axios from "axios";
// import api from "../assets/js/api";
export default {
    data(){
        return{
            read:0,
            article:{
                title:"文章标题",
                read:0,
                cTime:"文章创建时间",
                tags:["文章标签"],
                text: "文章内容"
            }
           
        }
    },
    computed: {
        timestamp(){
            return this.$route.params.timestamp;
        }
    },
    watch: {
        timestamp(val){
            this.getDetail();
            this.pageView();
        }
    },
    components:{
        Viewer
    },
    methods: {
        getDetail(){
           let timestamp = this.timestamp;
           //获取文章详情
            axios.post("/api/article/detail",{
                timestamp:+timestamp
            }).then(res=>{
                if(res.data && res.data.result===1){
                    let article = res.data.list[0];
                    if(article){
                         this.article = article;
                    }else{
                        this.$message({
                            type: 'error',
                            message: "找不到文章"
                        });
                    }
                   
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        //埋点
        pageView(){
            let timestamp = this.timestamp;
            axios.post("/api/statistics",{
                timestamp:+timestamp
            }).then(res=>{
                if(res.data && res.data.result === 1){
                    this.read = res.data.read;
                }
            })
        }
    },
    mounted() {
        //pv统计
        this.pageView();
        this.getDetail();
    }
}
</script>
<style lang="scss" scoped>
    .detail{
        width: 800px;
        margin: 0 auto;
        padding: 20px 25px;
        background: rgba(255,255,255,0.8);
        border-radius: 5px;
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .page-content{
        box-shadow: 0 1px 6px rgba(0,0,0,.3) inset;
        padding: 10px 20px;
        box-sizing: border-box;
        flex: 1;
    }
    .title{
        margin-bottom: 20px;
        h1{
            font-size: 32px;
            margin-bottom: 10px;
        }
        p{
            span{
                margin-right: 10px;
                color: #909399;
            }
            i{
                margin-right: 5px;
            }
        }
    }
</style>