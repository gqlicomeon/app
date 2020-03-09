<template>
    <div class="article">  
        <router-link :to="{ name: 'edit'}">
             <el-button type="primary" icon="el-icon-edit" size="small">创建文章</el-button>
        </router-link>
        <el-table
            :data="filterTableData"
            :default-sort="{prop:'cTime',order:'descending'}"
            style="width: 100%">
             <el-table-column
                prop="cTime"
                sortable
                label="创建日期"
                width="120">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                  prop="desc"
                  label="描述">
              </el-table-column>
             <el-table-column
                prop="tags"
                label="标签"
                :filters="allTags"
                :filter-method="filterTag">
                 <template slot-scope="scope">
                   <el-tag v-for="item in scope.row.tags" :key="item"  size="mini"
                   :type="['success','info','warning','danger',''][Math.floor(Math.random()*5)]">
                     {{item}}
                   </el-tag>
                </template>
            </el-table-column>
             <el-table-column
                prop="mTime"
                sortable
                label="修改时间">
            </el-table-column>
             <el-table-column
                align="right">
                 <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.row.timestamp)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row.timestamp)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    data(){
        return {
          search:"",
          currentPage:1,//当前页
          totalSize:0,//文章总数
          pageSize:10,//每页显示文章数
          tableData: []
        }
    },
    computed: {
      allTags(){//所有标签
        let cache = [];
        return this.tableData.reduce((acc,val)=>{
            val.tags.forEach(v => {
              if(!cache.includes(v)){
                cache.push(v);
                acc.push({text:v,value:v})
              }
            });
            return acc;
        },[])
      },
      filterTableData(){
        let filterData = this.tableData.filter(data=> 
        !this.search || data.title.indexOf(this.search) !== -1 || data.desc.indexOf(this.search) !== -1 || data.tags.includes(this.search));
        //设置文章总数
        this.totalSize = filterData.length;
        return filterData.slice(this.pageSize*(this.currentPage-1),this.pageSize*this.currentPage);
      }
    },
    watch:{
      search(val){
        //搜索变化时改变时重置单曲页
        this.currentPage = 1;
      }
    },
    methods: {
      filterTag(value, row) {
        return row.tags.includes(value);
      },
      currentChange(cur){
        this.currentPage =cur;
      },
      getArticles(){
         axios.post("/api/article/find").then(res=>{
            if(res.data && res.data.result == 1){
              this.tableData = res.data.list;
              if(this.tableData.length === 0){
                  this.$message({
                    type: 'success',
                    message: "您还没文章哦！快去创建文章吧~"
                  });
              }else{
                 this.$message({
                    type: 'success',
                    message: "获取文章列表成功"
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
      handleEdit(timestamp){
        this.$router.push(`/home/edit?timestamp=${timestamp}`);
      },
      handleDelete(timestamp){
         this.$confirm('此操作将永久删除该文章, 是否继续?', '温馨', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post("/api/article/delete",{timestamp}).then(res=>{
            if(res.data && res.data.result == 1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getArticles();
            }else{
               this.$message({
                  type: 'error',
                  message: res.data.msg
                });  
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    mounted() {
      //获取文章列表
      this.getArticles();
    },
}
</script>
<style lang="scss">
    .el-tag{
      margin: 0 5px;
    }
    .el-pagination{
      margin-top: 20px; 
    }

</style>