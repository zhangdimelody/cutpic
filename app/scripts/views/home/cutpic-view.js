define(['talent'
	,'templates/home'
	,'Jcrop'
],function(Talent
	,jst
	,Jcrop
) {
	return Talent.ItemView.extend({

		template: jst['home/cutpic-page']
		,initialize: function() {

		}
		,ui:{
			 "jcropSubmit" : ".jcrop_wrap a.crop_submit"
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.jcropSubmit] = 'cropSubmit';
			return events;
		}
		,raito:function(){
			var self = this;
			
			this.raitoNo = 1;
			var realwidth = parseInt(this.$el.find(".jcrop-holder img").css("width"));
			var realheight = parseInt(this.$el.find(".jcrop-holder img").css("height"));
			var cutwidth,cutheight;
			if(realwidth > 500){
				self.raitoNo = realwidth/500;
			}

			// 超过500缩小
            if(realwidth>500)   
            {   
                cutwidth=500;   
                cutheight=(realheight*500)/realwidth;   
            }else{
            	cutwidth = realwidth;
            	cutheight = realheight;
            }		

	        this.$el.find(".xuwanting").css({ "width" : cutwidth, "height" : cutheight });
	        this.$el.find(".jcrop-holder").css({ "width" : cutwidth, "height" : cutheight });
	        this.$el.find(".jcrop-tracker").css({ "width" : cutwidth, "height" : cutheight });
	        this.$el.find(".jcrop-holder img").css({ "width" : cutwidth, "height" : cutheight });
			
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
			
		}
		,onClose:function(){
		}
		,cropSubmit:function(){
			if(parseInt(this.$el.find(".x").val())){
				
				console.log("X坐标："+ parseInt(this.$el.find(".x").val()));
				console.log("Y坐标："+ parseInt(this.$el.find(".y").val()));
				console.log("宽："+ parseInt(this.$el.find(".w").val()));
				console.log("高："+ parseInt(this.$el.find(".h").val()));
			}else{
				alert("要先在图片上划一个选区再单击确认剪裁的按钮哦！");	
			}
		}
	});
 
});
