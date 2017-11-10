## crm-html5-pc

CRM PC版

##打包步骤
1、获取项目代码后运行命令：npm install，安装项目依赖。
   npm install webpack -g
   npm install webpack-dev-server -g
    
2、检查项目根目录下是否存在build文件夹。若不存在则创建，若存在则删除目录下的所有文件。

3、运行命令：webpack --config ddl.config.js（或npm run clib），生成manifest.json文件。

4、运行命令：webpack (或npm run webpack)，打包项目。

5、运行命令：webpack-dev-server --port 8002 --host 0.0.0.0 -w (或npm start)，启动开发环境。

6、开发测试，在浏览器地址栏输入：http://localhost:8002

##PS:
1、开发测试时需要将webpack.config.js文件中的publicPath字段屏蔽掉
2、使用webstorm开发时，若修改文件后没有自动打包，需要关闭webstorm的'save write'模式

##部署说明
1、项目打包之后将assets、build文件夹和index.html文件拷贝到服务器即可。
2、运行webpack命令前需要确保webpack.config.js文件中的publicPath字段赋值正确

##新增服务器步骤
1、修改src/core/config.js文件。
在serviceList数组中新增服务器路径，
修改APIS.crm_pc和APIS.crm_mxm变量

2、若要打包不同的版本，请修改exclude变量
   