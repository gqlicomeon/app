<template>
    <div class="blog" :style="styleObj">
       <header>
          <nav>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/archives">Archives</router-link></li>
              <li><a href="https://github.com/gqlicomeon" target="_blank">Github</a></li>
              <li><router-link to="/about">About</router-link></li>
            </ul>
          </nav>
        </header>
        <main>
            <h1>阅读有风险 参考需谨慎</h1>
            <section>
                <div class="content">
                  <router-view></router-view>
                </div>
                <aside>
                  <div class="myself">
                      <div class="head-photo">
                        <img :src="photo[Math.floor(Math.random()*photo.length)]">
                      </div>
                      <h3>{{introduce}}</h3>
                      <p>{{quote}}</p>
                  </div>
                  <div class="sec tag-content">
                      <h1>Tags</h1>
                      <el-tag size="small" v-for="item in tagList" :key="item" :type="tagType[Math.floor(Math.random()*tagType.length)]">
                        <router-link :to="`/tags/${item}`">{{item}}</router-link>
                      </el-tag>
                  </div>
                  <div class="sec latest">
                    <h1>latest</h1>
                    <ul>
                      <li v-for="item in latestTen" :key="item.timestamp">
                         <router-link :to="`/detail/${item.timestamp}`">{{item.title}}</router-link>
                      </li>
                    </ul>
                  </div>
                </aside>
            </section>
        </main>
        <footer>
           <p><a target="_blank"  href="http://www.beian.miit.gov.cn/">粤ICP备20018992号-1</a></p>
        </footer>
    </div>
</template>
<script> 
  import axios from 'axios';
  export default {
    name:"app",
    data(){
      return{
        banner:[],
        introduce:"",
        quote:"",
        photo:[],
        tagType:["","success","info","warning","danger"],
        tagList:[],
        latestTen:[]
      }
    },
    computed: {
      styleObj(){
        let banner = this.banner;
        let url = banner[0];
        return url ? {backgroundImage:`url(${url})`} : {};
      }
    },
    methods: {
      getPersonal(){//获取个人信息
        axios.post("/api/personal/find").then(res=>{
          if(res.data && res.data.result === 1){
            let list = res.data.list || [];
            if(list.length !== 0){
              let {introduce,quote,photo,banner} = list[0];
              this.introduce = introduce;
              this.quote = quote;
              this.photo = photo;
              this.banner = banner;
            }
          }
        })
      },
      getAllTags(){
        axios.post("/api/tags/list").then(res=>{
          if(res.data && res.data.result === 1){
            let list = res.data.list || [];
            this.tagList = list;
          }
        })
      },
      getLatestTen(){
        axios.post("/api/article/latest").then(res=>{
          if(res.data && res.data.result === 1){
            let list = res.data.list;
            this.latestTen = list;
          }
        })
      }
    },
    mounted() {
      this.getPersonal();
      this.getAllTags();
      this.getLatestTen();
    }
  }
</script>  
<style lang="scss">
    @charset "utf-8";
    *{
      padding: 0;
      margin: 0;
    }
    img{
      border: none;
    }
    a{
      text-decoration: none;
      color: inherit;
    }
    input,button,select,textarea{
      border: none;
      outline: none;
    }
    tr,
    th,
    td {
      font-size: 12px;
    }
    ol,
    ul {
      list-style: none;
    }
    li {
      list-style-type: none;
    }
    h1, h2, h3, h4, h5,
    h6 {
      font-size: inherit;
      font-weight: normal;
    }
    @keyframes bounce {
      0%{
        transform: scale(1);
      }
      60%{
        transform: scale(1.35,0.8);
      }
      70%{
        transform: scale(0.85,1.15);
      }
      85%{
        transform: scale(1.1,0.9);
      }
      95%{
        transform: scale(0.95,1.08);
      }
      100%{
        transform: scale(1);
      }
    }
    html{
      width: 100%;
      height: 100%;
    }
    body{
      width: 100%;
      height: 100%;
      font-family: "STKaiti","STSong","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      font-size: 14px;
      color: #048fa0;
      min-width: 1200px;
      overflow-x: auto;
    }
    .blog{
      width: 100%;
      height: 100%;
      background-image:url("./assets/images/banner.jpg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      overflow: auto;
    }
    header{
      width: 100%;
      height: 50px;
      background: transparent;
      box-shadow: 0 1px 6px rgba(0,0,0,.3);
      font-size: 18px;
      z-index: 99;
    }
    nav{
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #fff;
      font-weight: bolder;
      li{
        display: inline-block;
        margin: 0 10px;
      }
      a{
        &:hover{
          color: #048fa0;;
        }
      }
    }
    main{
      width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      >h1{
        font-size: 16px;
        color: #909399;
        text-align: center;
        padding: 10px 0;
      }
      >section{
        width: 100%;
        display: flex;
      }
    }
    .content{
      flex: 1;
      padding-bottom: 25px;
    }
    aside{
      width: 300px;
      .myself{
          box-sizing: border-box;
          padding: 25px 40px 40px 140px;
          width: 300px;
          height: 254px;
          background: url(./assets/images/border.png) no-repeat;
          background-size:100% 100%; 
          position: relative;
          margin-bottom: 20px;
          &::after{
            content: "";
            width: 53px;
            height: 53px;
            background: url(./assets/images/penceil.png) no-repeat;
            background-size: 100% 100%;
            right: 0;
            bottom: 40px;
            position: absolute;
          }
          h3,p{
            writing-mode: vertical-lr;
            display: inline-block;
            height: 100%;
            color: #fff;
          }
          h3{
            text-align: center;
            font-weight: bolder;
            margin-right: 25px;
            font-size: 24px;
          }
      }
      .head-photo{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        left: 25px;
        top: 50%;
        margin-top: -60px;
        &:hover{
          animation: bounce 600ms linear;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .sec{
          padding: 15px 30px;
          box-shadow: 0 1px 6px rgba(0,0,0,.3) inset;
          min-height: 200px;
          border-radius: 5px;
          background: rgba(0,0,0,0.1);
          margin-bottom: 25px;
          h1{
            font-size: 24px;
            color: #fff;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,.8);
            padding: 10px 0;
          }
      }
      .tag-content{
        .el-tag{
          margin-right: 5px;
          margin-bottom: 10px;
        }
      }
      .latest{
        ul{
          list-style-type: disc;
        }
        li{
          list-style: disc;
          margin-bottom: 10px;
        }
        a{
          display: inline-block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
   footer{	
     box-shadow: 0 1px 6px rgba(0,0,0,.3);
     padding:25px 0;
     p{
       text-align:center;
     }
     a{
        color:#fff;
        &:hover{
          color: #048fa0;;
        }
     }
   }
</style>
