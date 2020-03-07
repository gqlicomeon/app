<template>
    <ul class="upload-img-list" >
        <li v-for="(item,index) in list" :key="item">
            <el-image 
                ref="elImg"
                style="width: 100%; height: 100%"
                fit="cover"
                @error="loadImgError(index)"
                :preview-src-list="list"
                :src="item">
            </el-image>
            <div class="operate">
            <i class="el-icon-zoom-in" @click.prevent="previewImg(index)"></i>
            <i class="el-icon-delete" @click.prevent="deleteImg(item,index)"></i>
            </div>
        </li>
        <li>
            <el-upload
                action="/upload"
                list-type="picture-card"
                accept="image/*"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
        </li>
    </ul>
</template>
<script>
import axios from "axios";
export default {
    name:"img-upload",
    data(){
        return{}
    },
    props:["list"],
    methods:{
        uploadSuccess(response){//图片上传成功回调
            let url = `http://${window.location.host}/upload/${response.name}`;
            if(!this.list.includes(url)){
                this.list.push(url);
            }
            this.$emit("success");
        },
        loadImgError(index){//图片加载失败
            this.list.splice(index,1);
        },
        previewImg(i){
            //预览图片
            this.$refs.elImg[i].showViewer = true;
        },
        deleteImg(url,index) {
            //删除图片
            let name = url.match(/.+\/([^\/]+\.\w+)$/)[1];
            if(!name){
                this.$message({
                    type: "error",
                    message: "正则匹配错误文件名，删除失败"
                });
                return;
            }
            axios.post("/delete",{name}).then(res=>{
                let data = res.data || {};
                if(data.result == 1){
                    this.list.splice(index,1);
                    this.$message({
                        type: 'success',
                        message: "删除图片成功"
                    });
                    this.$emit("delete");
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                }
            })
        }
    }
}
</script>
<style lang="scss">
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