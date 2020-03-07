<template>
    <div class="login" :style="styleObj">
        <div class="login__box">
            <h1>您好，请先登录</h1>
            <el-form>
                <el-form-item label="账号">
                    <el-input v-model="name" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clickLogin">登录</el-button>
                </el-form-item>
            </el-form>
         </div>
    </div>
    
</template>
<script>
    import axios from "axios";
    export default {
        data(){
            return {
                name:"",
                password:"",
                banner:[]
            }
        },
        computed: {
             styleObj(){
                let banner = this.banner;
                let url = banner[Math.floor(Math.random()*banner.length)];
                return url ? {backgroundImage:`url(${url})`} : {};
            }
        },
        methods: {
          clickLogin(){//点击登录
            let name = this.name;
            let password = this.password;
            if(!name || !password){
                this.$message({
                    type: "error",
                    message: "账号或密码不能为空"
                });
                return;
            }
            axios.post("/login",{name,password}).then(res=>{
                if(res.data && res.data.result === 1){
                    this.$message({
                        type: "success",
                        message: "登录成功"
                    });
                    this.$router.push("/home");
                }else{
                     this.$message({
                        type: "error",
                        message: res.data.msg
                    });
                }
            })
          },
          autoLogin(){
              axios.post("/login").then(res=>{
                  if(res.data && res.data.result === 1){
                      this.$router.push("/home");
                  }
              })
          },
          getBanner(){//获取个人信息
                axios.post("/api/personal/find").then(res=>{
                    if(res.data && res.data.result === 1){
                        let list = res.data.list || [];
                        if(list.length !== 0){
                            let {banner} = list[0];
                            this.banner = banner;
                        }
                    }
                })
            }
        },
        mounted() {
            this.autoLogin();
            this.getBanner();
        }
    }
</script>
<style lang="scss">
    .login{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-image:url("../assets/images/banner.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        overflow: auto;
    }
    .login__box{
        width: 300px;
        position: absolute;
        transform: translate(-50%,-50%);
        left: 50%;
        top: 50%;
        border: 1px solid #E4E7ED;
        padding: 30px 50px;
        background: #fefefe;
        border-radius: 15px;
        box-shadow: 5px 5px 20px #eee;
        h1{
            font-size: 20px;
            color:#409EFF;
            text-align: center;
            margin-bottom: 10px;
        }
    }
</style>