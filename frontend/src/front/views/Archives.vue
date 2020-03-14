<template>
    <div class="archives-list">
        <el-collapse accordion v-model="activeName">
            <el-collapse-item v-for="(year,index) in yearList" :key="year" :name="`${index}`">
                <template slot="title">
                     <h1><span class="el-icon-date"></span>{{year}}</h1>
                </template>
                <div class="archives">
                     <el-timeline :reverse="reverse">
                        <el-timeline-item 
                        v-for="item in archivesList[year].slice(pageSize*(currentPage-1),pageSize*currentPage)" 
                        :key="item.timestamp"
                        :timestamp="item.date"  
                        icon="el-icon-time"
                        color="#06e2fd"
                        type="success"
                        size="large"
                        placement="top">
                            <el-card
                            :body-style="cardStyle"
                            shadow="always">
                                <div class="article">
                                    <h2>{{item.title}}</h2>
                                    <h3><i class="el-icon-collection-tag"></i><span>{{item.tags.join("、")}}</span></h3>
                                    <p>{{item.desc}}</p>
                                    <router-link :to="`/detail/${item.timestamp}`">
                                        阅读更多 <span class="el-icon-arrow-right"></span>
                                    </router-link>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :hide-on-single-page="true"
                        :total="archivesList[year].length"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @current-change="currentChange">
                    </el-pagination>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return{
            reverse:true,//正序
            activeName:"0",
            cardStyle:{
                padding:"0"
            },
            articleList:[],
            currentPage:1,//当前页
            pageSize:5,//每页显示文章数
        }
    },
    computed: {
        archivesList(){
            return this.articleList.reduce((acc,val)=>{
                let date = new Date(val.timestamp);
		let year = date.getFullYear();
                let month = date.getMonth();
                let day = date.getDate();
                if(!acc[year]){
                    acc[year] = [];
                }
                val.date = `${month}-${day}`;
                acc[year].push(val);
                return acc;
            },{});
        },
        yearList(){
            return Object.keys(this.archivesList).sort((a,b)=>b-a);
        }
    },
    methods: {
        getArticleList(){
            axios.post("/api/article/list").then(res=>{
                if(res.data && res.data.result === 1){
                    this.articleList = res.data.list.sort((a,b)=> b.cTime - a.cTime);
                }
            })
        },
        currentChange(val){
            this.currentPage = val;
        }
    },
    watch: {
        activeName(val){//年份变化
            this.currentPage = 1;//重置当前页
        }
    },
    mounted() {
        this.getArticleList();
    }
}
</script>
<style lang="scss" scoped>
    .archives-list{
        width: 800px;
        padding: 20px;
        box-shadow: 0 1px 6px rgba(0,0,0,.3) inset;
        box-sizing: border-box;
        min-height: 100%;
        margin: 0 auto;
    }
    .archives{
        padding: 10px 50px;
    }
    h1{
        color: #048fa0;
        font-size: 24px;
        font-weight: bolder;
        padding: 10px 20px;
        span{
            margin-right: 5px;
        }
    }
    .el-card{
        border: none;
        background: rgba(255,255,255,0.8);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        &:hover{
            box-shadow: 0 0 10px #06e2fd;
        }
    }
    .article{
        padding: 20px 20px 50px 20px;
        position: relative;
        h2{
        font-size: 24px;
        color: #048fa0;
        margin-bottom: 5px;
        }
        h3{
            font-size: 12px;
            color: #909399;
            margin-bottom: 10px;
            span{
                padding: 0 2px;
            }
        }
        p{
            color: #909399;
            font-size: 16px;
        }
        a{
            padding: 5px;
            border: 1px solid #909399;
            color: #909399;
            border-radius: 8px;
            position: absolute;
            right: 20px;
            bottom: 15px;
            font-size: 12px;
            line-height: 1.2em;
            &:hover{
                 color: #048fa0;
                 border-color: #048fa0;
            }
        }
    }
</style>
