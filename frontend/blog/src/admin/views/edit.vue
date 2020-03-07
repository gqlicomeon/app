<template>
    <div class="edit">
      <el-form ref="form" :model="form" size="small" label-position="top">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" placeholder="请输入您要创建的文章的标题"></el-input>
        </el-form-item>
        <el-form-item label="文章描述">
          <el-input v-model="form.desc" placeholder="请输入您要创建的文章的简要描述"></el-input>
        </el-form-item>
        <el-form-item label="文章置顶">
          <el-switch
            v-model="form.isTop"
            active-text="置顶">
          </el-switch>
        </el-form-item>
        <div class="edit-content">
          <span class="edit-label">文章缩略图</span>
          <img-upload :list="form.coverImg"></img-upload>
        </div>
        <el-form-item label="文章标签">
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <div class="edit-content">
          <span class="edit-label">文章内容</span>
          <editor v-model="form.text"  height="600px" previewStyle="vertical"/>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-if="!$route.query.timestamp">立即创建</el-button>
          <el-button type="primary" @click="onUpdate" v-if="$route.query.timestamp">立即更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script> 
  import 'tui-editor/dist/tui-editor.css';
  import 'tui-editor/dist/tui-editor-contents.css';
  import 'codemirror/lib/codemirror.css';
  import Editor from '@toast-ui/vue-editor/src/Editor.vue';
  import imgUpload from '../components/img-upload';
  import axios from 'axios';
  export default {
    name:"app",
    data(){
      return{
        inputVisible: false,
        inputValue: '',
        form: {
          title:'',
          desc:'',
          text:'',
          coverImg:[],
          tags:[],
          isTop:false
        }
      }
    },
    components:{
      imgUpload,
      Editor
    },
    methods: {
      onSubmit() {
        let self = this;
        let {title,desc,text,coverImg,tags} = this.form;
          if(!(title && desc && text && coverImg.length !== 0 && tags.length !== 0)){
              this.$message({
                type: 'warning',
                message: "以上配置信息均不能留空"
              });
              return;
          }
          axios.post("/api/article/add",this.form).then(res=>{
            if(res.data && res.data.result == 1){
              this.$message({
                type: 'success',
                message: "创建文章成功",
                onClose(){
                  self.$router.push('article');
                }
              });
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
      },
      onUpdate(){//更新文章
        let self = this;
        let timestamp = +this.$route.query.timestamp;
        let {title,desc,text,coverImg,tags} = this.form;
          if(!(title && desc && text && coverImg.length !== 0 && tags.length !== 0)){
              this.$message({
                type: 'warning',
                message: "以上配置信息均不能留空"
              });
              return;
          }
          axios.post("/api/article/update",{article:self.form,timestamp}).then(res=>{
            if(res.data && res.data.result == 1){
              this.$message({
                type: 'success',
                message: "更新文章成功",
                onClose(){
                  self.$router.push('article');
                }
              });
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
      },
      handleClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      getArticleById(){
        let self = this;
        let timestamp = +this.$route.query.timestamp;
        if(!timestamp){
          return;
        }
        axios.post("/api/article/find",{timestamp}).then(res=>{
          if(res.data && res.data.result == 1){
            let list = res.data.list[0];
            if(!list){
               this.$message({
                type: 'error',
                message: "找不到文章时间戳对应的文章",
                onClose(){
                  self.$router.push('article');
                }
              });
            }else{
              let {title,desc,text,coverImg,tags,isTop} = list;
              let form = this.form;
              [form.title,form.desc,form.text,form.coverImg,form.tags,form.isTop] = [title,desc,text,coverImg,tags,isTop];
            }
          }
        })
      }
    },
    created() {
      this.getArticleById();
    }
  }
</script> 
<style lang="scss">
  .edit{
    .edit-content{
      margin-bottom: 18px;
    }
    .edit-label{
      font-size: 14px;
      color: #606266;
      margin-bottom: 10px;
      display: inline-block;
      line-height: 32px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  .upload-img-list{
    li{
      display: inline-block;
      width: 150px;
      height: 150px;
      box-sizing: border-box;
      vertical-align: middle;
      background-color: #fbfdff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      margin-right: 10px;
      position: relative;
      overflow: hidden;
      &:hover{
        .operate{
          opacity: 1;
        }
      }
      &:last-child{
        border: none;
      }
    }
  }
  .operate{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.6);
    font-size: 20px;
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    transition: opacity  0.4s linear;
    i{
      margin: 0 5px;
    }
  }
</style>