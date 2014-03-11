<<<<<<< HEAD
# myTest

## Getting Started

### Project description
=======
# TMS招聘前端构架简介

## 项目结构与说明

### 文件夹结构
```
app/
    ├── index.html
    ├── images
    ├── styles
    ├── scripts
    │   ├── main.js
    │   ├── collections
    │   ├── helpers
    │   ├── models
    │   ├── network
    │   ├── routers
    │   ├── templates
    │   ├── vendor
    │   └── views
    └── templates
        ├── common
        ├── home
        ├── jobs
        ├── applicants
        ├── interviews
        ├── plans
        ├── pools
        ├── reports
        └── settings
```

### index.html
- BSGlobal是全局变量，记录了后端输出给前端的数据；
- index.html中引用requirejs，通过data-main配置主脚本文件scripts/main.js；

### scripts/main.js
- 该文件，通过require.config记录了各模块的物理地址；
- 通过require，加载根路由器，并初始化各个助手类(helpers)；
- 调用Backbone.history.start，开始监听路由事件；
- 截获所有地址以#开头的链接，由框架的router统一管理；

### scripts/routers/base-router.js
- 路由器的基类，所有路由器派生于该类；
- 其中的loadRouter可用于加载下级路由器，loadPaveView用于加载页面视图类；

### scripts/routers/index-router.js
- 项目的根路由器，在构造函数中，初始化所有的一级路由器（对应于导航中的各个频道）；

### scripts/routers/jobs/index-router.js
- jobs频道的路由类，截获所有以jobs开头的路由请求；
- 其目录结构与URL中的fragments一一对应；

### scripts/views/common
- 该目录中存放共用视图类，如header, footer；
- 每个频道都可以创建自己的common目录，用于存放各频道内部共用视图类；

### scripts/views/common/base-page-view.js
- 所有页面视图类的基类，页面视图类不同于普通视图类，与页面一一对应，一个页面视图类中可能包含多个视图类；
- 页面视图类中包含一个MastePageView的实例;

### scripts/views/common/master-page-view.js
- 该类负责布局整个页面的整体结构；
- 目前，仅有一个MastePageView；

### scripts/views/jobs/index-page-view.js
- 页面视图类，继承于BasePageView，包含一个MastePageView的实例；
- 包含一个内部类MainView，负责管理页面主区域部分的显示；

### scripts/views/common/header-view.js
- 普通视图类，继承于Backbone.View或自定义的普通视图类；

### templates
- 该目录存放所有的模板文件， 文件以.html结尾；
- 该目录的结构与views一一对应；

### scripts/templates
- 该目录存放编译后的模板文件， 文件以.js结尾；
- 目前，每个一级频道的模板编译成一个文件， 如:jobs.js；


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
1. [Backbone帮助11](http://backbonejs.org)
2. [Backbone源码分析](http://www.cnblogs.com/nuysoft/archive/2012/03/19/2404274.html)
3. [Backbone设计模式](http://ricostacruz.com/backbone-patterns/)
4. [Backbone.js Fundamentals](http://addyosmani.github.com/backbone-fundamentals/)

## 工具
[Windows下显示Markdown代码](http://markdownpad.com/)


>>>>>>> b2967840399b0a0cc2ca018a1a4e27a249a5eafd
