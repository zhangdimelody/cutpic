 
	var jst = (function(){
	
		this["JST"] = this["JST"] || {};
	
		this["JST"]["home/cutpic-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="jcrop_wrap">\r\n    <div class="zxx_main_con">\r\n        <div class="zxx_test_list">\r\n            <div class="rel mb20">\r\n                <img class="originimage" src="' +((__t = (imgUrl)) == null ? '' : __t) +'"  style="" />\r\n                <span class="preview_box crop_preview">\r\n                    <img class="img_crop_preview" src="' +((__t = (imgUrl)) == null ? '' : __t) +'" />\r\n                </span>\r\n            </div>  \r\n            <form class="crop_form">\r\n                <input type="hidden" class="x" name="x" />\r\n                <input type="hidden" class="y" name="y" />\r\n                <input type="hidden" class="w" name="w" />\r\n                <input type="hidden" class="h" name="h" />\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>';}return __p};

		return this["JST"];
	})();
	
	var itemView = Talent.ItemView.extend({

		template: jst['home/cutpic-page']
		,initialize: function() {
			var data = _.defaults(this.model.toJSON(),{x:0,y:0,w:200,h:200,originWidth:500,previewBox:true})
			this.model = new Talent.Model(data);

			this.listenTo(this.model,'change',this.adjustPreview);
		}
		,ui:{

		}
		,events:function(){
			var events = {};
			return events;
		}
		,onRender: function() {
			
		}
		,onShow: function() {
			this.jcropFun();	

			if(!(this.model.toJSON().previewBox)){
				this.$el.find('.jcrop_wrap .crop_preview').hide();
			}
		}
		,jcropFun:function(){
			var self = this;
			var modelData = this.model.toJSON();
			//剪切头像
			this.$el.find(".originimage").Jcrop({
				aspectRatio:1,
				boxWidth: this.model.get('originWidth'),
				setSelect: [modelData.x, modelData.y, modelData.w, modelData.h],
				onChange:callback,
				onSelect:callback
			}, function() {
				self.trigger('imageReady');
			});	

			//简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
			function callback(obj){
				self.setModelData(obj);				
			}
		}
		,setModelData:function(obj){
			this.model.set(obj);
		}
		,adjustPreview:function(){
			var obj = this.model.toJSON();
			if(parseInt(obj.w) > 0){
				//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
				var rx = this.$el.find(".preview_box").width() / obj.w; 
				var ry = this.$el.find(".preview_box").height() / obj.h;
				//通过比例值控制图片的样式与显示
				this.$el.find(".img_crop_preview").css({
					width:Math.round(rx * this.$el.find(".originimage").width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
					height:Math.round(rx * this.$el.find(".originimage").height()) + "px",	//预览图片高度为计算比例值与原图片高度的乘积
					marginLeft:"-" + Math.round(rx * obj.x) + "px",
					marginTop:"-" + Math.round(ry * obj.y) + "px"
				});
			}
		}
		,onClose:function(){
		}
	});
 
