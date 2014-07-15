# 搜人控件

## 1. 版本
`~0.1.1` 

## 2. 用途
图片剪裁
依赖 ： {
		"jquery.Jcrop" : ""
	   }

## 3. 使用
* 初始化

````
this.cutpicView = new CutpicView({
				model : new Talent.Model({
					imgUrl : "/images/zzd.jpg" //图片路径
					,x:0    //剪裁区左上角的x坐标
					,y:0    //剪裁区右上角的y坐标
					,w:220    //剪裁区的宽度
					,h:220    //剪裁区的高度
					,originWidth:500    //初始图片显示的最大宽度
					,previewBox:true    //预览区是否显示
				})
			});
````

* 监听图片剪裁视图model的change方法


````                    
this.listenTo(this.cutpicView.model,'change',function(){
				console.log(this.cutpicView.model.toJSON());
			});
````



## 4.参考资源
[Jcrop的参数说明和Demo](http://code.ciaoca.com/jquery/jcrop/)
