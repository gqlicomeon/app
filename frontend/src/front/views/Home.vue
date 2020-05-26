<template>
  <div class="home">
      <ul class="article-list">
        <li v-for="(item,index) in curList" :key= "index">
          <span class="el-icon-collection-tag is-top" v-if="item.isTop"></span>
          <h1><router-link :to="`/detail/${item.timestamp}`">{{item.title}}</router-link></h1>
          <p><span><i class="el-icon-time"></i>{{item.cTime}}</span><span><i class="el-icon-collection-tag"></i>{{item.tags.join("、")}}</span></p>
          <h2><router-link :to="`/detail/${item.timestamp}`">{{item.desc}}</router-link></h2>
          <div class="img-box">
            <router-link :to="`/detail/${item.timestamp}`"><img :src="item.coverImg[Math.floor(Math.random()*item.coverImg.length)]" ></router-link>
          </div>
          <span class="more"><i class="el-icon-view"></i><router-link :to="`/detail/${item.timestamp}`">more</router-link></span>
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
    name: 'home',
    data(){
      return {
        introduce:"",
        quote:"",
        photo:[],
        allArticles:[],
        tagType:["","success","info","warning","danger"],
        tagList:[],
        currentPage:1,//当前页
        totalSize:0,//文章总数
        pageSize:5,//每页显示文章数
      }
    },
    computed: {
      curList(){
        return this.allArticles.slice(this.pageSize*(this.currentPage-1),this.pageSize*this.currentPage);
      }
    },
    methods: {
      getAllArticles(){
        axios.post("/api/article/list").then(res=>{
          if(res.data && res.data.result === 1){
            let list = res.data.list;
            let sort = list.sort((a,b)=>a.cTime > b.cTime ? -1 : 1);
            this.totalSize = list.length;
            this.allArticles = sort.reduce((acc,val)=>{
              if(val.isTop){
                acc.unshift(val);
              }else{
                acc.push(val);
              }
              return acc;
            },[])
          }
        })
      },
      currentChange(cur){
        this.currentPage =cur;
      }
    },
    mounted() {
     this.getAllArticles(); 
    }
  }
</script>
<style lang="scss" scoped>
  .home{
    padding-bottom: 20px;
  }
  .article-list{
    width: 850px;
    margin: 0 auto 20px;
    li{
      padding: 20px 40px 30px;
      background: rgba(255,255,255,0.8);
      margin-bottom: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      position: relative;
      &:last-child{
        margin-bottom: 0;
      }
      &:hover{
        box-shadow: 0 0 10px #06e2fd;
      }
      .is-top{
        color: #06e2fd;
        position: absolute;
        left: 2px;
        top: -2px;
        z-index: 10;
        font-size: 26px;
      }
      h1{
        font-size: 32px;
        color: #048fa0;
        margin-bottom: 10px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      p{
        margin-bottom: 15px;
        >span{
          margin-right: 10px;
        }
        i{
          margin-right: 3px;
        }
      }
      h2{
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .img-box{
        width: 100%;
        height: 200px;
        overflow: hidden;
        position: relative;
        margin-bottom: 10px;
        border-radius: 5px;
        a{
	 display:inline-block;
         width:100%;
         height:100%;
         position:relative;
	}
        img{
          width: 100%;
          height: auto;
          position: absolute;
          top: 0;
          left: 0;
          transform:translateY(-50%);
        }
      }
      
      .more{
        position: absolute;
        right: 20px;
        bottom: 10px;
        color: #303133;
        i{
          margin-right: 3px;
        }
      }
    }
  }
  .el-pagination{
    padding:0 20px;
    text-align: center;
  }
</style>
