/**
 * 公共方法
 */
const fs = require("fs");
const path = require("path");

const util =  {
    /**
     * 
     * @param {String} src source path
     * @param {String} encode encode type
     * @returns {Object Array} thenable filesObj
     */
    async read(src,encoding="utf8"){
        let stats;
        try{
             stats = await new Promise((resolve,reject)=>{
                fs.stat(src,(err,stats)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(stats);
                })
            })
        }catch(err){
            return err;
        }
        if(stats.isFile()){
            return new Promise((resolve,reject)=>{
                fs.readFile(src, {encoding},(err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({time:stats.birthtime,data});
                });
            })
        }else{
            let files = await new Promise((resolve,reject)=>{
                fs.readdir(src,(err,files)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(files);
                })
            })
            if(files){
                let list = [];
                for(let v of files){
                    let data = await util.read(path.join(src,v));
                    list.push(data);
                }
                return list;
            }
        }
       
    }
}

module.exports = util;