define(['_', '$', 'backbone', 'templates/common', 'helpers/context'
	// ,'views/common/uploader-del-view'
	],
    /**
     * Uploader view class
     * @author kongchangzhu
     * @extends {Backbone.View} 
     * @class UploaderView
     */
	function(_, $, Backbone, jst, Context
		// ,DelPopView
		) {

		var UploaderFileModel = Backbone.Model.extend({
			idAttribute: 'Id'
		})
		var UploaderFileCollection = Backbone.Collection.extend({
			model: UploaderFileModel
		})

	return Backbone.View.extend(
		/** @lends UploaderView.prototype */
	{
		className: 'upload_wrapper',
		template: jst['common/uploader'],
		listTemplate: jst['common/uploader-file-list'],
		ui:{
			"form":"form.upload_form",
			"fileList":"ul",
			"file":".upload_file",
			"del":".upload_del",
			"loading":".upload_loading",
			"error":".upload_error"
		},
		events: function() {
			var events = {};
			if((!this.options.silent)||(this.options.silent==undefined)){
				events["change " + this.ui.file] = "upload";	
			}else{
				events["change " + this.ui.file] = "change";	
			}
			events["click " + this.ui.del] = "deleteFile";
			return events;
		},
		defaults: {
			text : "上传附件",
			limit : 5,
			limitTip : "无法上传，文件不能多于<%=limit%>个。",
			showPreview: false,
			data: [],
			url: 'Common/Tools/Upload',
			type: 'resume',
			callbackName: '_callback_',
			jobId :  "696",
			eLinkId :  "0F7CE9A0-0CAF-45AB-A69A-0000D043A3A6",
			bizType: 9,
			delPopTitle: '移除附件',
			delPopCount: '确实要移除该附件吗？',
			personId: ""
		},
		initialize: function(options) {
			var self = this;
			this.options = options;
			this.defaults.callbackName += parseInt(Math.random()*10000);

			this.model = new Backbone.Model(_.extend(this.defaults, this.options));

			var url = Context.getWebUrl(this.model.get('url'));
			this.model.set('url', url);

			this.collection = new UploaderFileCollection();

			this.listenTo(this.collection, 'remove reset add', function() {
				self.renderFileList();
			});
			//是否删除的弹层
			// this.delPopView=new DelPopView({
			// 	model:this.model
			// });
			// this.listenTo(this.delPopView, 'fnDel', function(node) {
			// 	//var node = $(e.currentTarget);
			// 	var modelId = node.parent()[0].getAttribute('data-id');
			// 	var model = self.collection.get(modelId);
			// 	self.collection.remove(model);
			// 	self.hideError();
			// });
			
			// callbackName will be passed to backend, invoked from iframe.
			window[this.defaults.callbackName] = function (resp){
				/*
					{
						"code": 200,
						"data": {
							"Id": 1,
							"Type": "txt",
							"Name": "test.html",
							"Dfs": "dfs://test/123",
							"PreviewUrl": "http://someurl",
							"DownloadUrl": "http://someurl",
							"Size": 1024,
							"IsArchive": false,
							"ContainsFiles": null
						}
					}
				 */
				if(resp.code == 200){
					if(resp.data.length > 0){
						self.trigger('done', resp.data);
					}else{
						self.trigger('fail', resp.message);
					}
				}else{
					if(resp.message){
						self.trigger('fail', resp.message);
					}else{
						self.trigger('fail', resp);
					}
				}
				self.trigger('end', resp);
			}

			this.on('start', function() {
				this.showLoading();
				this.hideError();
			}, this);
			this.on('end', function() {
				this.hideLoading();
				this.updateFileNode();
			}, this);
			this.on('done',function(file) {
				// this.$el.append('<pre>' + JSON.stringify(file) + '</pre>');
				var fileModel = new UploaderFileModel(file[0]);
				if(this.model.get('limit') == 1){
					this.collection.reset(fileModel);
				}else{
					this.collection.add(fileModel);
				}

			}, this);
			this.on('fail', function(msg) {
				if(typeof(msg) == 'string'){
					this.showError(msg);
				}
			}, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			if(this.options.accept){
				this.$el.find(this.ui.file).attr('accept', this.options.accept);
			}

			this.$el.append('<iframe style="display:none;" name="upload_target">');
			this.collection.reset(this.model.get('data'));
			// this.delPopView.$el.appendTo("body");
			return this.$el;
		},
		renderFileList: function() {
			var data = this.model.toJSON();

			var self = this;
			data.list = this.collection.map(function(model) {
				var json = model.toJSON();
				json.ShortName = self.shortStr(json.Name, 80);
				return json;
			});

			var html = this.listTemplate(data);
			this.$el.find('ul').empty().html(html);
		},
		change: function(e) {
			this.trigger('change', e);
		},
		upload: function(e) {
			var limit = this.model.get('limit');

			// show limitation error
			if(limit >= 1 && this.collection.length == limit){
				var msg = _.template(this.model.get('limitTip'), {limit:limit});

				this.showError(msg);

				this.updateFileNode();
				e.preventDefault();
				return false;
			}
			this.trigger('start');
			var formNode = this.$el.find(this.ui.form);
			formNode[0].submit();
		},
		deleteFile: function(e) {
			var node = $(e.currentTarget);
			// this.delPopView.render(node);
			// if(!confirm("确实要移除该文件吗？")){
			// 	return true;
			// }
			
			// var modelId = node.parent()[0].getAttribute('data-id');
			// var model = this.collection.get(modelId);
			// this.collection.remove(model);

			// this.hideError();
		},
		getFileList: function() {
			return this.collection.toJSON();
		},
		showLoading: function() {
			var node = this.$el.find(this.ui.loading);
			this.timer = setTimeout(function(){
				node.show();
			}, 300);
		},
		hideLoading: function() {
			var node = this.$el.find(this.ui.loading);
			clearTimeout(this.timer);
			node.hide();
		},
		updateFileNode: function() {
			var node = this.$el.find(this.ui.file);
			var newNode = node.clone();
			node.replaceWith(newNode);
		},
		showError: function(msg) {
			var errorNode = this.$el.find(this.ui.error);
			
			clearTimeout(this.errorMsgTimer);
			errorNode.html(msg).show();
			this.errorMsgTimer = setTimeout(function() {
				errorNode.hide('fast');
			}, 3000)
		},
		hideError: function() {
			this.$el.find(this.ui.error).hide();
		},
		shortStr: function(str,len) {
			if( ! str || ! len) return '';
			var a = 0,i = 0,temp = '';
			for (i = 0; i < str.length; i ++ ){
				if (str.charCodeAt(i) > 255){
					a += 2;
				}else{
					a ++ ;
				}
				if(a > len) return temp+'...';
				temp += str.charAt(i);
			}
			return str;
		}
	});
});