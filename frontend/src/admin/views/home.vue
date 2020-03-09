<template>
    <div class="home">
        <aside>
            <div class="icon-outer">
                <div class="icon-inner">
                    <img :src="personalImg[Math.floor(Math.random()*personalImg.length)]" alt="">
                </div>
                <span class="el-icon-caret-top"></span>
            </div>
            <section>
                <h1>blog Admin</h1>
                <nav>
                    <ul>
                        <li><router-link to="/home/personal"><span><i class="el-icon-user"></i>个人中心</span><i class="arrow el-icon-arrow-right"></i></router-link></li>
                        <li><router-link to="/home/article"><span><i class="el-icon-s-unfold"></i>文章列表</span><i class="arrow el-icon-arrow-right"></i></router-link></li>
                    </ul>
                </nav>
            </section>
        </aside>
        <section>
            <div class="breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>home</el-breadcrumb-item>
                    <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <router-view></router-view>
        </section>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return {
            personalImg:[]
        }
    },
    methods: {
        getImg(){
            axios.post("/api/personal/find").then(res=>{
                if(res.data && res.data.result === 1){
                    let personal = res.data.list[0] || {};
                    let imgList = personal.photo || [];
                    this.personalImg = imgList;
                }
            })
        },
        checkIfLogin(){
            axios.post("/api/login").then(res=>{
                if(!res.data || res.data.result !== 1){
                    this.$router.push("/login");
                }
            })
        }
    },
    mounted() {
        this.getImg();
        this.checkIfLogin();
    }
}
</script>
<style lang="scss">
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
    .home{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        overflow: hidden;
        >section{
            flex: 1;
            max-width: 1000px;
            margin:  0 auto;
            height: 100%;
            overflow: auto;
        }
    }
    aside{
        padding: 20px;
        color: #303133;
        // width: 200px;
        height: 100%;
        border-right: 1px solid #DCDFE6;
        h1{
            font-size: 20px;
            font-weight: bold;
            margin: 10px 0 25px;
            text-align: center
        }
        .icon-outer{
            width: 120px;
            height: 120px;
            padding: 10px;
            border-radius: 50% 50% 5px 50%;
            background-color:rgba(3, 169, 244, 0.6);
            position: relative;
            transition: all 0.3s linear;
            // margin: 0 auto;
            &:hover{
                background-color:rgba(3, 169, 244, 0.3);
            }
            span{
            font-size: 24px;
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: #fff;
            }
            .el-icon-caret-top{
            transform: rotateZ(-45deg);
            }
        }
        .icon-inner{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            &:hover{
            animation: bounce 600ms linear;
            }
            img{
            width: 100%;    
            height: 100%;
            }
        }
    }
    nav{
        ul{
            font-size: 16px;
        }
        li{
            padding: 15px 0;
            border-bottom: 1px solid #F2F6FC;
            span{
                margin-right: 10px;
            }
            a{
                color: #606266;
                position: relative;
                display: inline-block;
                width: 100%;
            }
            .arrow{
                position: absolute;
                right: 0;
                top: 0
            }
            &:hover{
                a{
                    color: #000000;
                }
            }
        }
    }
    .breadcrumb{
        padding: 20px 0;
        font-size: 18px;
        .el-breadcrumb{
            font-size: 18px;
        }
    }
</style>