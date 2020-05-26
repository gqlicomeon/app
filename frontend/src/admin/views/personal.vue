<template>
    <div class="personal">
        <el-form ref="form"  :model="form" size="small" label-position="top">
            <el-form-item label="个人简介">
                 <el-input v-model="form.introduce" placeholder="请输入您的个人简介"></el-input>
            </el-form-item>
            <el-form-item label="个人格言">
                 <el-input v-model="form.quote" placeholder="请输入您的个人格言"></el-input>
            </el-form-item>
            <div class="el-form-item">
                <span class="title">个人头像上传</span>
                <img-upload :list="form.photo"></img-upload>
            </div>
             <div class="el-form-item">
                <span class="title">大屏图像上传</span>
                <img-upload :list="form.banner"></img-upload>
            </div>
            <el-form-item label="新增后台登录账户">
                 <el-form :inline="true" :model="newUser" size="mini">
                    <el-form-item label="账号">
                        <el-input v-model="newUser.name" placeholder="请输入您的账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="newUser.password" placeholder="请输入您的密码" size="mini" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="confirmCreate">确定创建</el-button>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="已有登录账户">
                <el-table
                    :data="userList"
                    style="width: 100%">
                    <el-table-column
                        label="账号">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" size="mini" :disabled="!scope.row.configurable"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="密码">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.password" size="mini" show-password :disabled="!scope.row.configurable"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        v-if="!scope.row.configurable"
                        @click="scope.row.configurable = true">编辑</el-button>
                        <el-button
                        size="mini"
                        v-if="scope.row.configurable"
                        @click="changeUser(scope.row)">更改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="deleteUser(scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button  @click="$router.back()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import axios from "axios";
import imgUpload from "../components/img-upload";
export default {
    name:"personal",
    data(){
        return{
            form:{
                introduce:"",
                quote:"",
                photo:[],
                banner:[],
            },
            newUser:{
                name:"",
                password:""
            },
            userList:[]
        }
    },
    components:{
        imgUpload
    },
    methods: {
        confirmCreate(){
            let {name,password} = this.newUser;
            if(!name || !password){
                this.$message({
                    type: 'error',
                    message: "新创建账号或密码不能为空"
                });
                return;
            }
            axios.post("/api/user/add",{name,password}).then(res=>{
                if(res.data && res.data.result === 1){
                    this.$message({
                        type: 'success',
                        message: "创建新用户成功"
                    });
                    this.newUser.name = "";
                    this.newUser.password = "";
                    this.getUserList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        getUserList(){//获取用户列表
             axios.post("/api/user/find").then(res=>{
                if(res.data && res.data.result === 1){
                    let list = res.data.list;
                    if(list.length !==0){
                        list = list.map(val=>{
                            val.configurable = false;
                            return val;
                        })
                    }
                    this.userList = list;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        changeUser(user){//修改密码
            let {name,password} = user;
            if(!name || !password){
                 this.$message({
                        type: 'error',
                        message: "账号和密码不能为空"
                    });
            }
            axios.post("/api/user/update",{name,password}).then(res=>{
                if(res.data && res.data.result ===1){
                    this.$message({
                        type: 'success',
                        message: "修改密码成功"
                    });
                    this.getUserList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        deleteUser(user){//删除用户
            let {name} = user;
             axios.post("/api/user/delete",{name}).then(res=>{
                if(res.data && res.data.result ===1){
                    this.$message({
                        type: 'success',
                        message: "删除用户成功"
                    });
                     this.getUserList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        },
        getPersonal(){//获取个人信息
            axios.post("/api/personal/find").then(res=>{
                if(res.data && res.data.result === 1){
                    if(res.data.list && res.data.list.length !== 0){
                        let {introduce,quote,photo,banner} = res.data.list[0];
                        this.form = {introduce,quote,photo,banner};
                        this.$message({
                            type: 'success',
                            message: "获取个人信息成功"
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
        save(){
            let form = this.form;
            let {introduce,quote,photo,banner} = form;
            if(!introduce || !quote || photo.length ===0 || banner.length === 0){
                this.$message({
                    type: 'error',
                    message: "以上配置信息均不能留空"
                });
                return;
            }
            axios.post("/api/personal/update",form).then(res=>{
                if(res.data && res.data.result === 1){
                    this.$message({
                        type: 'success',
                        message: "保存个人信息成功"
                    });
                    this.getPersonal();
                }else{
                     this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                }
            })
        }
    },
    mounted() {
        this.getUserList();
        this.getPersonal();
    }
}
</script>
<style lang="scss" scoped>
    .el-form-item{
        .title{
            display: inline-block;
            margin-bottom: 10px;
        }
    }
</style>
