const koa = require("koa");
const session = require('koa-session');
const koaBody = require('koa-body');
const path = require("path");
const app = new koa();
//session配置，处理登录状态
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 1*60*60*1000,//一个小时
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));


//路由
const router = require("./router");


//bodyparser
app.use(koaBody({
    multipart:true, // 支持文件上传
    // encoding:'gzip',
    formidable:{
      uploadDir:path.join(__dirname,'./static/upload'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
      onFileBegin:(name,file) => { // 文件上传前的设置
        //改写上传的文件名
        let rPath = file.path.replace(/upload_[a-z0-9]+\.\w+/,file.name);
        file.path = rPath;
      }
    }
}));
//配置路由
app
  .use(router.routes())
  .use(router.allowedMethods());
//404
app.use(async ctx=>{
    ctx.status = 404;
    ctx.type = "text/html;charset=utf-8";
    ctx.body = "404 Not Found";
})

app.listen(3000);
console.log("server has on 80");