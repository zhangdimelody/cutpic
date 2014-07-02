define(['talent'
	,'templates/home'
	,'views/home/cutpic-view'
],function(Talent
	,jst
	,CutpicView
) {
	var MainView = Talent.Layout.extend({

		template: jst['home/index-page']
		,initialize: function() {
			this.cutpicView = new CutpicView();
		}
		,regions:{
			"cutPic" : ".cut_pic_wrap"
		}
		,ui:{
		}
		,events:function(){
			var events = {};
			// events['click ' + this.ui.jcropSubmit] = 'cropSubmit';
			return events;
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
