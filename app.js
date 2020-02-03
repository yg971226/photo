/*
 主入口文件(单入口)

*/

//加载框架
let express = require("express");
let app = express();

//加载libs  数据库连接服务
let model = require("./libs/connect");


//加载模块fs
let fs = require("fs");

//加载path模块
let path = require("path");

//指定模板引擎
app.set("view engine","ejs");

//加载静态资源文件  path.resolve()  绝对路径 
//   assets/fonts/fontawesome/font-awesome.min.css
//  /assets/vendors/magnific-popup/jquery.magnific-popup.min.js
//app.use("/assets",express.static(__dirname+"/assets"));
app.use("/assets",express.static(path.resolve("./assets")));

//加载图片文件
//app.use("/upload",express.static(path.resolve("./upload")));
let pathurl = __dirname+"/upload";
console.log(pathurl);
app.use(express.static(pathurl));

//加载视图文件
app.set("views",__dirname+"/view");

//不必将html改成ejs 还继续使用ejs模板引擎
app.engine("html",require("ejs").__express)


//加载body-parser  获取表单提交的内容
let bodyParser = require("body-parser");
//使用中间件 所有访问的路由 都可以使用body-parser
app.use(bodyParser.urlencoded({extended:false}))


//加载session 安装之后引入session 
let   cookieSession = require("cookie-session");

//配置session 的值
//使用中间件 path   
////修改客户端的session_key 标识符 sessionId 属性值  唯一标识id
app.use(cookieSession({
    name: 'sessionId',
    //keys  给session 给定一个秘钥内容
    keys: ['sssssssss', 'kedfdfdfdfdfdfy2']
  }))






/*
app.get("/",(req,res)=>{
    //上面给了指定的后缀名为html  下面加载必须加后缀名.html
    res.render("index-index.html");

})*/

//规划路由
/*
 前台首页模块
 127.0.0.1:3000  默认访问前台首页
*/
let inderouter = require("./controller/indexController");

app.use(inderouter);


/*
 用户模块
 127.0.0.1:3000/user/reg
*/
//加载controller 层  user模块的路由
let userrouter = require("./controller/userController");
console.log(userrouter);
app.use("/user",userrouter); //加载user二级路由  127.0.0.1:3000/user/reg


//404 错误提示 
/*app.use((req,res)=>{
    res.render("wait.html",{
        wait:"2",
        content:"你输入非法的内容",
        href:"/"
    })
})*/




app.listen(3000);



