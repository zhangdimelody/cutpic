 
	var jst = (function(){
	
		this["JST"] = this["JST"] || {};
	
		this["JST"]["home/cutpic-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="jcrop_wrap">\r\n    <div class="zxx_main_con">\r\n        <div class="zxx_test_list">\r\n            <div class="rel mb20">\r\n                <img class="xuwanting" src="/images/zd.jpg"  style="" />\r\n                <span class="preview_box crop_preview">\r\n                    <img class="img_crop_preview" src="/images/zd.jpg" />\r\n                </span>\r\n            </div>  \r\n            <form class="crop_form">\r\n                <input type="hidden" class="x" name="x" />\r\n                <input type="hidden" class="y" name="y" />\r\n                <input type="hidden" class="w" name="w" />\r\n                <input type="hidden" class="h" name="h" />\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>';}return __p};

		return this["JST"];
	})();
	
	var itemView = Talent.ItemView.extend({

		template: jst['home/cutpic-page']
		,initialize: function() {
			this.userDesign = this.model.toJSON().originWidth;
			
		}
		,ui:{
		}
		,events:function(){
			var events = {};
			return events;
		}
		,raito:function(){
			var self = this;
			
			this.raitoNo = 1;
			var realwidth = parseInt(this.$el.find(".jcrop-holder img").css("width"));
			var realheight = parseInt(this.$el.find(".jcrop-holder img").css("height"));
			var cutwidth,cutheight;
			if(realwidth > this.userDesign){
				// 比率 this.raitoNo
				self.raitoNo = realwidth/this.userDesign;
			}

			// 超过500缩小
         //    if(realwidth>this.userDesign)
         //    {
         //    	// boxWidth
         //        this.cutwidth=this.userDesign;   
         //        this.cutheight=(realheight*this.userDesign)/realwidth;   
         //    }else{
         //    	this.cutwidth = realwidth;
         //    	this.cutheight = realheight;
         //    }

	        // this.$el.find(".xuwanting, .jcrop-holder, .jcrop-tracker, .jcrop-holder img")
	        // .css({ "width" : this.cutwidth, "height" : this.cutheight });
			
		}
		,inputChange:function(){
			var x = parseInt(this.$el.find(".jcrop_wrap .x").val());
			var y = parseInt(this.$el.find(".jcrop_wrap .y").val());
			var w = parseInt(this.$el.find(".jcrop_wrap .w").val());
			var h = parseInt(this.$el.find(".jcrop_wrap .h").val());
			this.model.set({
				'x':x, 'y':y, 'w':w, 'h':h
			})
		}
		,onRender: function() {
		}
		,onShow: function() {
			var self = this;
			var jcrop_api;
			
			$('body').on('jcrop:load', function(){
				self.raito();
			});
			//剪切头像
			this.$el.find(".xuwanting").Jcrop({
				aspectRatio:1,
				boxWidth: self.userDesign,
				setSelect: [this.model.toJSON().x,this.model.toJSON().y,this.model.toJSON().w,this.model.toJSON().h],
				onChange:showCoords,
				onSelect:showCoords
			},function(){
				// jcrop_api=this;
				// jcrop_api.animateTo([100,100,400,300]);
			});	

			//简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
			function showCoords(obj){
				 
				self.$el.find(".x").val(obj.x);
				self.$el.find(".y").val(obj.y);
				self.$el.find(".w").val(obj.w);
				self.$el.find(".h").val(obj.h);

				self.inputChange();
				if(parseInt(obj.w) > 0){
					//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
					var rx = self.$el.find(".preview_box").width() / obj.w; 
					var ry = self.$el.find(".preview_box").height() / obj.h;
					//通过比例值控制图片的样式与显示
					self.$el.find(".img_crop_preview").css({
						width:Math.round(rx * self.$el.find(".xuwanting").width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
						height:Math.round(rx * self.$el.find(".xuwanting").height()) + "px",	//预览图片高度为计算比例值与原图片高度的乘积
						marginLeft:"-" + Math.round(rx * obj.x) + "px",
						marginTop:"-" + Math.round(ry * obj.y) + "px"
					});
				}
			}

			if(!(this.model.toJSON().previewBox)){
				this.$el.find('.jcrop_wrap .crop_preview').hide();
			}
		}
		,onClose:function(){
		}
	});
 
