const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const router = new Router();
//数据库链接
const url = "mongodb://localhost:27017/";
router
//处理文件上传
.post('/api/upload/',async ctx =>{
    let file = ctx.request.files.file || {};
	console.log(file);
    let res = {
        result:1,
        msg:"success",
        name:file.name
    }
    ctx.body = res;
})
//处理上传删除
.post('/api/delete/',async ctx=>{
  let body = ctx.request.body || {};
  let name = body.name;
  let deletePath = path.join(__dirname,"../static/upload/",name);
  if(fs.existsSync(deletePath)){
    let res = await new Promise((resolve,reject)=>{
      fs.unlink(deletePath,err=>{
        if(err){
          reject(err);
        }
        resolve({
          result:1,
          msg:"success"
        })
      })
    }).catch(e=>{
      ctx.body = {
        result:-1,
        msg:new Error(e).message
      }
    })
    ctx.body = res;
  }else{
    ctx.body = {
      result:-2,
      msg:`${name} is not exist`
    }
  } 
})
//处理后台登录
.post('/api/login/',async ctx=>{
  let {name,password} = ctx.request.body;
  //设置白名单账户
  let defaultUser = {
      gqli:"ooo.000"
  };
  if(!ctx.session.loged){//session管理
    ctx.session.loged = false;
    if(!name || !password){
      ctx.body = {
        result:-1,
        msg:"用户名或密码不能为空"
      }
    }
    if(Object.keys(defaultUser).includes(name)){//用户名在白名单账户中
        if(defaultUser[name] === password){
          //登录成功
          ctx.session.loged = true;
          ctx.body = {
            result:1,
            msg:"登录成功"
          }
        }else{
          //密码不正确
          ctx.body = {
            result:-2,
            msg:"密码不正确"
          }
        }
    }else{//查数据库
      let res = await new Promise((resolve,reject)=>{
        MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
          var blogDb = db.db("blog");
          blogDb.collection("user").find({name}).toArray(function(err, result){ // 返回集合中所有数据
            if (err) reject(err);
            db.close();
            resolve(result)
          })
        }).catch(err=>{
          reject(err)
        });
      }).catch(error=>{
          ctx.body = {
            result:-3,
            msg:new Error(error).message
          };
      })
      if(res.length === 0){//没找到用户
        ctx.body = {
          result:-4,
          msg:"用户不存在"
        };
      }else{
        let trueUser = res[0];
        if(trueUser.password === password){//数据查询结果正确
          ctx.session.loged = true;
          ctx.body = {
            result:1,
            msg:"登录成功"
          }
        }else{
          ctx.body = {
            result:-2,
            msg:"密码不正确"
          }
        }
      }
    }
  }else{
    ctx.body = {
      result:1,
      msg:"登录成功"
    }
  }
})
//新增文章
.post('/api/article/add',async ctx=>{
  let article = ctx.request.body;
  let date = new Date();
  article.cTime =  date.toLocaleDateString();
  article.mTime =  date.toLocaleString();
  article.timestamp = date.getTime();//文章唯一时间戳
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").insertOne(article).then(res=>{
        db.close();
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//查找文章
.post('/api/article/find',async ctx=>{
  let query = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success",
      list:res
    }
  }
})
//更新文章
.post('/api/article/update',async ctx=>{
  let {article,timestamp} = ctx.request.body;
  if(!timestamp){
    ctx.body = {
      result:-2,
      msg:"漏传文章时间戳，找不到文章。"
    };
    return;
  }
  let date = new Date();
  article.mTime =  date.toLocaleString();
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").updateOne({timestamp:+timestamp},{$set:article}).then(res=>{
        db.close();
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//删除文章
.post('/api/article/delete',async ctx=>{
  let {timestamp} = ctx.request.body;
  if(!timestamp){
    ctx.body = {
      result:-2,
      msg:"漏传文章时间戳，找不到文章。"
    };
    return;
  }
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").deleteOne({timestamp:+timestamp}).then(res=>{
        db.close();
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//查找标签对应的文章
.post('/api/article/tag',async ctx=>{
  let {tag} = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find({}).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    let list = res.filter(val=>{
      let {tags} = val;
      return tags.includes(tag);
    }).map(val=>{
      let { title,desc,timestamp,cTime} = val;
      return {title,desc,timestamp,cTime};
    })
    ctx.body = {
      result:1,
      msg:"success",
      list
    }
  }
})
//查找所有文章列表
.post('/api/article/list',async ctx=>{
  let query = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    let list = res.map(val=>{
      let { title,desc,timestamp,cTime,coverImg,tags,isTop} = val;
      return { title,desc,timestamp,cTime,coverImg,tags,isTop};
    })
    ctx.body = {
      result:1,
      msg:"success",
      list
    }
  }
})
//查找最新的10篇文章
.post('/api/article/latest',async ctx=>{
  let query = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    let list = res.sort((a,b)=>a.cTime > b.cTime ? -1 : 1).map(val=>{
      let {title,timestamp} = val;
      return {title,timestamp};
    }).slice(0,10);
    ctx.body = {
      result:1,
      msg:"success",
      list
    }
  }
})
//查找文章内容
.post('/api/article/detail',async ctx=>{
  let query = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    let list = res.map(val=>{
      let { title,cTime,tags,text} = val;
      return { title,cTime,tags,text};
    })
    ctx.body = {
      result:1,
      msg:"success",
      list
    }
  }
})
//新增或更新后台用户
.post('/api/user/add',async ctx=>{
  let user = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      let blogDb = db.db("blog");
      let collection = blogDb.collection("user");
      let {name} = user;
      collection.find({name}).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        if(result.length === 0){//没找到，新增用户
          collection.insertOne(user).then(res=>{
            db.close();
            resolve(res);
          }).catch(err=>{
            reject(err);
          })
        }else{//找到了
          reject(new Error("该用户已存在"));
        }
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//更新用户
.post('/api/user/update',async ctx=>{
  let {name,password} = ctx.request.body;
  if(!name){
    ctx.body = {
      result:-2,
      msg:"漏传用户名，找不到用户。"
    };
    return;
  }
  if(!password){
    ctx.body = {
      result:-2,
      msg:"漏传密码，修改密码失败"
    };
    return;
  }
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("user").updateOne({name},{$set:{password}}).then(res=>{
        db.close();
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//查找用户
.post('/api/user/find',async ctx=>{
  let query = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("user").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success",
      list:res
    }
  }
})
//删除用户
.post('/api/user/delete',async ctx=>{
  let {name} = ctx.request.body;
  if(!name){
    ctx.body = {
      result:-2,
      msg:"漏传用户名，找不到用户。"
    };
    return;
  }
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("user").deleteOne({name}).then(res=>{
        db.close();
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})

//更新个人信息
.post('/api/personal/update',async ctx=>{
  let {introduce,quote,photo,banner} = ctx.request.body;
  let data = {introduce,quote,photo,banner,findKey:"personal"};
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      var blogDb = db.db("blog");
      let collection = blogDb.collection("personal");
      collection.find({findKey:"personal"}).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        if(result.length === 0){//没找到
          collection.insertOne(data).then(res=>{
            db.close();
            resolve(res);
          }).catch(err=>{
            reject(err);
          })
        }else{
          collection.updateOne({findKey:"personal"},{$set:data}).then(res=>{
            db.close();
            resolve(res);
          }).catch(err=>{
            reject(err);
          })
        }
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success"
    }
  }
})
//查找个人信息
.post('/api/personal/find',async ctx=>{
  let query = {findKey:"personal"};
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("personal").find(query).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {
      result:1,
      msg:"success",
      list:res
    }
  }
})
//查找所有标签
.post('/api/tags/list',async ctx=>{
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }).then(db=>{
      var blogDb = db.db("blog");
      blogDb.collection("articles").find({}).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        db.close();
        resolve(result)
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-1,
        msg:new Error(error).message
      };
  })
  if(res){
    let list = res.reduce((acc,val)=>{
      let {tags} = val;
      return acc.concat(tags);
    },[])
    ctx.body = {
      result:1,
      msg:"success",
      list:[...new Set(list)]
    }
  }
})
//pv统计
.post('/api/statistics',async ctx=>{
  let {timestamp} = ctx.request.body;
  let res = await new Promise((resolve,reject)=>{
    MongoClient.connect(url, { useUnifiedTopology: true}).then(db=>{
      let blogDb = db.db("blog");
      let collection = blogDb.collection("articles");
      collection.find({timestamp:+timestamp}).toArray(function(err, result){ // 返回集合中所有数据
        if (err) reject(err);
        if(result.length !== 0){
          let article = result[0];
          if(!article.read){
            article.read = 0;
          }
          //已读加一
          article.read ++;
          collection.updateOne({timestamp:+timestamp},{$set:article}).then(data=>{
            db.close();
            resolve(article.read);
          }).catch(err=>{
            reject(err);
          })
        }
      })
    }).catch(err=>{
      reject(err)
    });
  }).catch(error=>{
      ctx.body = {
        result:-2,
        msg:new Error(error).message
      };
  })
  if(res){
    ctx.body = {result:1,read:res};
  }
})



module.exports = router;
