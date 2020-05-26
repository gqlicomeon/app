<template>
  <div class="about">
    <h1>一个怀揣着梦想的少年，爱好游戏、音乐、吉他，懒~</h1>
    <div class="contact">
      <h2>Contact Me</h2>
      <ul>
        <li><i class="el-icon-location-information"></i>广东广州</li>
        <li><i class="el-icon-message"></i>1244341574@qq.com</li>
        <li><i></i><a href="https://github.com/gqlicomeon" target="_blank">My Github</a></li>
      </ul>
    </div>
    <div class="my-blog">
      <h2>About Blog</h2>
      <ul>
        <li>一个记录学习工作点滴的空间</li>
        <li>实现：前端Vue+后端NodeJs</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {}
  }
}
</script>
<style lang="scss" scoped>
    .about{
        width: 800px;
        padding: 20px;
        box-shadow: 0 1px 6px rgba(0,0,0,.3) inset;
        box-sizing: border-box;
        min-height: 100%;
        margin: 0 auto;
        background: rgba(255,255,255,0.8);
        h1{
          background: rgba(195,247,253,0.3);
          color: #333;
          border-left: 10px solid #048fa0;
          padding-left: 20px;
          font-size: 18px;
          height: 70px;
          line-height: 70px;
          margin: 50px 0 80px;
        }
    }
    .contact{
      color: #333;
      margin-bottom: 80px;
      h2{
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 20px;
      }
      ul{
        padding-left: 20px;
      }
      li{
        margin: 15px 0;
        font-size: 18px;
        i{
          margin-right: 10px;
        }
        &:last-child{
          i{
            width: 18px;
            height: 18px;
            background: url(../assets/images/github.png) no-repeat;
            background-size: 100% 100%; 
            display: inline-block;
            vertical-align: middle;
          }
        }
        a{
          color: #048fa0;
          vertical-align: middle;
          &:hover{
             text-decoration: underline;
          }
        }
      }
    }
    .my-blog{
      color: #333;
      h2{
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 20px;
      }
      ul{
        padding-left: 20px;
      }
      li{
        margin: 15px 0;
        font-size: 18px;
      }
    }
</style>
