define(['talent'
	,'templates/home'
	,'CutPicView'
],function(Talent
	,jst
	,CutpicView
) {
	
	var MainView = Talent.Layout.extend({

		template: jst['home/index-page']
		,initialize: function() {
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
			if(this.cutpicView.model.toJSON().w==0){
				alert("请先画出要剪裁部分");
			}else{
				this.$el.find("a.crop_submit").after('x坐标:'+this.cutpicView.model.toJSON().x
					+'y坐标:'+this.cutpicView.model.toJSON().y
					+'宽:'+this.cutpicView.model.toJSON().w+'高:'+this.cutpicView.model.toJSON().h);
			}
		}
		,onRender: function() {
		}
		,onShow: function() {
			this.cutpicView = new CutpicView({model : new Talent.Model({x:303,y:73,w:190,h:190,originWidth:500,previewBox:true})});
			this.cutPic.show(this.cutpicView);
			this.listenTo(this.cutpicView.model,'change',function(){
				console.log(this.cutpicView.model.toJSON());
			});
		}
		,onClose:function(){
		}
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'home/register'
	});
});
