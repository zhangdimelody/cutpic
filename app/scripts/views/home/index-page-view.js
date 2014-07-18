define(['talent'
	,'templates/home'
	,'CutPicView'
],function(Talent
	,jst
	,CutpicView
) {
	
	var MainView = Talent.Layout.extend({

		template: jst['home/index-page']
		,tipTemplate: _.template('x坐标:<%=x%>;y坐标:<%=y%>;宽度:<%=w%>;高度:<%=h%>;')
		,initialize: function() {
			
			this.cutpicView = new CutpicView({
				model : new Talent.Model({
					imgUrl : "/images/zd.jpg"
					,x:0
					,y:0
					,w:200
					,h:200
					,originWidth:500
					,previewBox:true
				})
			});

			this.listenTo(this.cutpicView.model,'change',function(){
				console.log(this.cutpicView.model.toJSON());
			});

			this.listenTo(this.cutpicView,'imageAlready',function(){
				console.log("图片已加载完");
			});

		}
		,regions:{
			"cutPic" : ".cut_pic_wrap"
		}
		,ui:{
			"jcropSubmit" : "a.crop_submit"
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.jcropSubmit] = 'cropSubmit';
			return events;
		}
		,cropSubmit:function(){
			var modelData = this.cutpicView.model.toJSON();
			if(modelData.w==0){
				alert("请先画出要剪裁部分");
			}else{
				this.showTip(modelData);
			}
		}
		,showTip: function(modelData) {
			this.$el.find(".tip").html(this.tipTemplate(modelData));
		}
		,onRender: function() {
		}
		,onShow: function() {
			this.cutPic.show(this.cutpicView);
		}
		,onClose:function(){
		}
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'home/register'
	});
});
