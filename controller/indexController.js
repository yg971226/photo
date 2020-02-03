/*
 定义路由  暴露路由 

*/
let express = require("express");
let router = express.Router();

let blogmodel = require("../mondel/blogmodel");


// limit 9  控制显示的内容
    router.get("/",(req,res)=>{
      // 查询的条件  limit:9  
      blogmodel.find({},{},{limit:9},function(err,result){
        if(!err)
        {
          console.log(result);
          res.render("index-index.html",{result:result});
        }

      })   
      
      
         

    })


   




//暴露路由
module.exports = router;