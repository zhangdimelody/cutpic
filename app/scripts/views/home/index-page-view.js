define(['talent'
	,'templates/home'
	,'Jcrop'
],function(Talent
	,jst
	,Jcrop
) {
	var MainView = Talent.Layout.extend({

		template: jst['home/index-page']
		,initialize: function() {

		}
		,ui:{
			 "jcropSubmit" : ".jcrop_submit"
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.jcropSubmit] = 'cropSubmit';
			return events;
		}
		,onRender: function() {
		}
		,onShow: function() {
			// var self = this;
			var jcrop_api;
			if(this.picObj!=undefined){
				$("#xuwanting").attr("src",this.picObj.DownloadUrl);
				$("#crop_preview").attr("src",this.picObj.DownloadUrl);
			}
			//剪切头像
			$("#xuwanting").Jcrop({
				aspectRatio:1,
				onChange:showCoords,
				onSelect:showCoords
			},function(){
				// jcrop_api=this;
				// jcrop_api.animateTo([100,100,400,300]);
			});	

			
			//简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
			function showCoords(obj){
				 
				$("#x").val(obj.x);
				$("#y").val(obj.y);
				$("#w").val(obj.w);
				$("#h").val(obj.h);
				if(parseInt(obj.w) > 0){
					//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
					var rx = $("#preview_box").width() / obj.w; 
					var ry = $("#preview_box").height() / obj.h;
					//通过比例值控制图片的样式与显示
					$("#crop_preview").css({
						width:Math.round(rx * $("#xuwanting").width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
						height:Math.round(rx * $("#xuwanting").height()) + "px",	//预览图片高度为计算比例值与原图片高度的乘积
						marginLeft:"-" + Math.round(rx * obj.x) + "px",
						marginTop:"-" + Math.round(ry * obj.y) + "px"
					});
				}
			}
			
		}
		,onClose:function(){
		}
		,cropSubmit:function(){
			if(parseInt($("#x").val())){
				// $("#crop_form").submit();	
				this.$el.find(".jcrop_x").html(parseInt($("#x").val()));
				this.$el.find(".jcrop_y").html(parseInt($("#y").val()));
				this.$el.find(".jcrop_w").html(parseInt($("#w").val()));
				this.$el.find(".jcrop_h").html(parseInt($("#h").val()));
			}else{
				alert("要先在图片上划一个选区再单击确认剪裁的按钮哦！");	
			}
		}
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'home/register'
	});
});
