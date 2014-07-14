<<<<<<< HEAD
# myTest

## Getting Started

### Project description
=======

### index.html
- BSGlobal是全局变量，记录了后端输出给前端的数据；
- index.html中引用requirejs，通过data-main配置主脚本文件scripts/main.js；

### scripts/main.js
- 该文件，通过require.config记录了各模块的物理地址；
- 通过require，加载根路由器，并初始化各个助手类(helpers)；
- 调用Backbone.history.start，开始监听路由事件；
- 截获所有地址以#开头的链接，由框架的router统一管理；

## 编码规范
- 文件命名: 小写，中划线分隔；
- 文件格式：utf-8无BOM；
- 代码缩进：tab, 4个空格的大小；
- 变量：驼峰式写法，如: userName；
- 类名：头字母大写，如：UserModel；
- MVC所涉及的类，需要增加类型后缀，如：DetailView, JobsPageView, UserCollection；
- 页面视图类的文件名全部为index-page-view.js；
- 普通视图类的文件名全部为“-view.js”结尾；
- 对于this的别名，请使用：var self = this；


## 参考资源
[Jcrop的参数说明和Demo](http://code.ciaoca.com/jquery/jcrop/)


>>>>>>> b2967840399b0a0cc2ca018a1a4e27a249a5eafd