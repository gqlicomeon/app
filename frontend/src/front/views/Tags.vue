<template>
    <div class="tag">
        <h1><span class="el-icon-price-tag"></span>{{tag}}</h1>
        <ul class="tag-list">
            <li v-for="item in curList" :key="item.timestamp">
                <router-link :to="`/detail/${item.timestamp}`">
                    <h2>{{item.title}}</h2>
                    <p>{{item.desc}}</p>
                    <p><span class="el-icon-date"></span>Published on {{item.cTime}}</p>
                </router-link>
            </li>
        </ul>
        <el-pagination
            background
            layout="prev, pager, next"
            :hide-on-single-page="true"
            :total="totalSize"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="currentChange">
        </el-pagination>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return{
            articleList:[],
            currentPage:1,//当前页
            totalSize:0,//文章总数
            pageSize:5,//每页显示文章数
        }
    },
    computed: {
        tag(){
            return this.$route.params.tag;
        },
        curList(){
            return this.articleList.slice(this.pageSize*(this.currentPage-1),this.pageSize*this.currentPage);
        }
    },
    watch: {
        tag(val){
            this.getArticleByTag();//路由变化时更新文章
        }
    },
    methods: {
        getArticleByTag(){
            let tag = this.tag;
            axios.post("/api/article/tag",{tag}).then(res=>{
                if(res.data && res.data.result === 1){
                    let list = res.data.list;
                    this.articleList = list;
                    this.totalSize = list.length;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        currentChange(cur){
            this.currentPage =cur;
        }
    },
    mounted() {
        this.getArticleByTag();
    }
}
</script>
<style lang="scss" scoped>
    .tag{
        width: 800px;
        padding: 20px;
        box-shadow: 0 1px 6px rgba(0,0,0,.3) inset;
        box-sizing: border-box;
        min-height: 100%;
        margin: 0 auto;
        >h1{
            font-size: 28px;
            color: #fff;
            font-weight: bolder;
            margin-bottom: 25px;
            span{
                color: #06e2fd;
                margin-right: 10px;
                vertical-align: bottom;
            }
        }
    }
    .tag-content{
        margin-bottom: 40px;
    }
    .tag-list{
        li{
            padding: 20px;
            border-bottom: 1px solid #DCDFE6;
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
            margin-bottom:  25px;
            &:hover{
                box-shadow: 0 0 10px #06e2fd;
            }
            a{
                display: block;
                width: 100%;
            }
            h2{
                color: #048fa0;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px; 
            }
            p{
                color: #909399;
                &:first-of-type{
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                &:last-of-type{
                    font-size: 14px;
                    color: #048fa0;
                    span{
                        margin-right: 5px;
                    }
                }
            }
        }
    }
</style>
