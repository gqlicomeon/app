<template>
    <router-view></router-view>
</template>
<script> 
  export default {
    name:"app",
    data(){
      return{
       
      }
    },
    methods: {
      
    },
    mounted() {
       
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
    html,body{
      width: 100%;
      height: 100%;
    }
    body{
      font-family: "STKaiti","STSong","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      font-size: 14px;
      color: #303133;
      min-width: 1200px;
      overflow-x: auto;
    }
</style>
