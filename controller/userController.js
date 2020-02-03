/*
 定义二级路由规划
*/

//引入框架
let express = require("express");

//加载一个二级方法  Router()
let router = express.Router();

//引入  formidable  获取上传文件域内容 
let formidable = require("formidable");

let fs = require("fs");

let path = require("path");

//密码加密:(框架自带的包)
var crypto = require("crypto");
//设置加密的内容
const secret = 'dsadfdsfdkjfskdfkjafdddd';

//生成图片名字 用uuid 
let uuid = require("uuid/v1");


//加载model层
let usermodel = require("../mondel/usermodel");
//加载model blog
let blogmodel = require("../mondel/blogmodel");

console.log(usermodel);


/*
 定义和规范二级路由
 只要请求页面 ,一定会执行到这
 定义的user 模块访问
*/
router.use((req,res,next)=>{
     //req.url
    console.log(req.url);  //   /reg
    //规范路由
    //127.0.0.1:3000/user/reg   127.0.0.1:3000/user/login
    if(req.url == "/reg" || req.url=="/login")
    {
        console.log("22222222");
        return next();
    }
    //判断是否有用户登录  req.session.username
    else if(req.session.username == null)
    {
        res.render("wait.html",{
            wait:"2",
            content:"你没有登录,请登录",
            href:"/user/login"
        })

    }


    else
    {
        next();
    }
})

/*
用户登录 展示页面
*/
router.get("/login",(req,res)=>{
  res.render("user-login.html");

})

//用户登录的post数据处理
router.post("/login",(req,res)=>{
   //密码处理
   /*
    let username = req.body.username;
   */
   let post = req.body;
   let {password,username} = post;

   password = crypto.createHmac('sha256', secret).update(password).digest('hex');
  //做数据库查询
  usermodel.find({username},{},{},function(err,result){

   console.log(result);
   //40363b7fd2205044e0778975e1bb2c18bcc9ccd11b12fccb077afc286168e0b3
   //console.log(result[0].password);
   if(!result.length)
   {
     return res.render("wait.html",{
         wait:"2",
         content:"你没有该用户,请注册",
         href:"/user/reg"
     })
   }

    //有用户  密码做判断
     if(password != result[0].password)
     {
      return res.render("wait.html",{
           wait:"2",
           content:"你输入的密码错误",
           href:"/user/login"
       })
     }

     //匹配成功进行登录
     else{
      //记住你的登录的用户名  用session 记住用户名username
      //req.session.标签名 = 存储的值
      //req.session.id = 数据的id 
      //存储用户名
        req.session.username = username; //sesssion  用户名
        console.log(req.session.username);// lisi
        req.session.id = result[0].id; //存储一个session  id

        return res.render("wait.html",{
            wait:"2",
            content:"登录成功",
            href:"/"
        })
     }

     
     

  })

})


//用户中心页
router.get("/center",(req,res)=>{
    //{username:req.session.username}
   res.render("user-index.html",{username:req.session.username})
})



//定义加载文件路由 注册页面的加载 显示注册页面
router.get("/reg",(req,res)=>{
   
   res.render("user-reg.html");
})


//注册以post方式
router.post("/doreg",(req,res)=>{
    /*
      注册:
      第一个:
      注册判断用户名是否存在,如果存在,则登录,不创建.如果不存在则创建.跳转到登录页面.
      第二:
      密码:加密
    */
    //操作数据库  封装数据库  查询功能  修改功能  添加功能
    /*
     获取表单提交的数据 文本框输入的值
     文本框输入的值   安装body-parser包 
    */
   let username = req.body.username;
   //console.log(username);
   let sex = req.body.sex;
   console.log(sex); //sex: "2"

   //加密 注册
   req.body.password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
   
   //4e483d48cba4cc2568a50eecc9a0e4b79e79c15b1c670dc4110864ed3514eca7
   //console.log(req.body.password);
   /*
    判断用户是否已经注册,如果注册了不允许注册.没有注册,可以注册 .  
   */
    
  usermodel.find({username},{},{},function(err,dosc){
   //console.log(dosc);
     if(dosc.length)
     {
        return res.render("wait.html",{
          wait:"2",
          content:"你已经注册过该用户,请从新注册",
          href:"/user/reg", 
       })
     }

  })



   /*
    添加到数据库中
   */
  console.log(req.body);
  usermodel.create(req.body,function(err,result){
       if(err)
       {
         return res.render("wait.html",{
             wait:"2",
             content:"注册失败,请从新注册",
             href:"/user/reg"
         })   

       }
       else{
        return res.render("wait.html",{
            wait:"2",
            content:"恭喜你注册成功",
            href:"/"
        })
  

       }

  })

})


//首页图片上传
/*
 1:图片上传到本地文件夹里面
 2:把文件夹的图片路径存储到数据库中
 3:在首页进行查询,循环输出到页面中
*/
//加载用户模块下的展示  图片
router.get("/publish",(req,res)=>{

   res.render("user-publish.html");

})

//用户模块  下上传图片功能

router.post("/publish",(req,res)=>{
    //安装包
    //fromidable 上传图片或者文件  (文件域) 获取上传文件的信息
    //npm install formidable --save-dev 
   
    let form = new formidable.IncomingForm();
    //C:\Users\ADMINI~1\AppData\Local\Temp  //图片系统默认上传目录里面 
    //console.log(form.uploadDir);
    //c:\Users\Administrator\Desktop\0708\day8\poto\tmpdir
    form.uploadDir = path.normalize(__dirname+"/../tmpdir");
    form.parse(req,(err,fields,files)=>{

       // console.log(files.url);   //undefined
        //files['file']
       //console.log(files['file']);
       //获取上传文件信息
       let uploadfile = files['file'];

       //获取图片后缀名
       let extname = path.extname(uploadfile.name); //.jpg
       //console.log(extname);
       //随机生成 图片名字
       //833965e0-e03b-11e9-b6f9-b7dd1b7d3304.jpg
       let filename = uuid()+extname;
       console.log(filename);

       //获取源文件路径
       let oldpath = uploadfile.path;

       //规定一个新文件路径
       /*
       c:\Users\Administrator\Desktop\0708\newblog\upload\ec584190-e03b-11e9-8acf-d1ebdefeb7b4.jpg*/
       let newpath = path.join(__dirname,"..","upload",filename);
       console.log(newpath);

       fs.rename(oldpath,newpath,function(err){
         if(err)
         {
           return res.render("wait.html",{
               wait:"2",
               content:"你上传文件失败",
               href:"/user/publish"
           })
         }
       
         //上传成功  保存到数据库中  blog 图片地址存入到集合里面
         fields.url = filename; //4c036ab0-e03d-11e9-adcb-d90cdc24ff28.jpg
         //console.log(fields.url);
         console.log(fields); /*Object {title: "asd", desc: "asda", content: "asdas", url: "5959c3c0-e03e-11e9-b956-53eda9dc02ea.jpg"}*/
         console.log(files);
         blogmodel.create(fields,function(err,result){

            console.log(result);
            if(err)
            {
                return  res.render("wait.html",{
                wait:"2",
                content:"文章发布失败",
                href:"/user/publish"
               })
            }
            else
            {
                    return  res.render("wait.html",{
                    wait:"2",
                    content:"文章发布成功",
                    href:"/"
                    })
            }

         })


       })

    })
})



//暴露路由
module.exports = router;
