define(['talent'
	,'templates/home'
	,'views/home/cutpic-view'
],function(Talent
	,jst
	,CutpicView
) {
	var jst = (function(){
	
		this["JST"] = this["JST"] || {};
	
		this["JST"]["home/cutpic-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '\r\n<div class="zxx_main_con">\r\n    <div class="zxx_test_list">\r\n        <div class="rel mb20">\r\n            <img class="xuwanting" src="http://test.com/images/zd.jpg"  style="" />\r\n            <span class="preview_box crop_preview">\r\n                <img class="img_crop_preview" src="http://test.com/images/zd.jpg" />\r\n            </span>\r\n        </div>  \r\n        <form class="crop_form">\r\n            <input type="hidden" class="x" name="x" />\r\n            <input type="hidden" class="y" name="y" />\r\n            <input type="hidden" class="w" name="w" />\r\n            <input type="hidden" class="h" name="h" />\r\n            <a class="crop_submit save_btn"><span>确认剪裁</span></a>\r\n        </form>\r\n    </div>\r\n    <p>X坐标：<span class="jcrop_x"></span></p>\r\n    <p>Y坐标：<span class="jcrop_y"></span></p>\r\n    <p>宽：<span class="jcrop_w"></span></p>\r\n    <p>高：<span class="jcrop_h"></span></p>\r\n</div>\r\n';}return __p};

  		this["JST"]["home/index-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="cut_pic_wrap"></div>';}return __p};

		return this["JST"];
	})();
	
	var MainView = Talent.Layout.extend({

		template: jst['home/index-page']
		,initialize: function() {
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
			this.cutpicView = new CutpicView();
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
