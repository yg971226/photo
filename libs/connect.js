/*
 定义加载数据库连接
 安装数据库 
*/

//加载mongodb 数据库
let mongo = require("mongoose");

//连接数据库服务 mongodb://localhost:27017/my_blog 默认端口27017  
//my_blog  数据库名字 
//{ useNewUrlParser: true } :消除警告
mongo.connect("mongodb://localhost:27017/my_blog",{ useNewUrlParser: true });