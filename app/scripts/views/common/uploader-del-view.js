define(['_', '$', 'backbone', 'templates/common','$.simplemodal'
	],
	function(_, $, Backbone,jst,SimpleModalView) {
		return Backbone.View.extend({
		template: jst['common/uploader-del'],
		ui: {
			"fnDel":".btn_save_file",
			"fnCanc":".btn_canc_file,.ico_clse"
		},
		events: function() {
			var events = {};
			events["click "+this.ui.fnDel]="fnDel";
			events["click "+this.ui.fnCanc]="fnCanc";
			return events;
		},

		initialize: function() {
			this.delPopView = new SimpleModalView({
				position: [0]
			});

			
		},
		render: function(e) {
			this.currentEle = e;//把当前删除的node接收过来
			var dialogHtml = this.template(this.model.toJSON());
			this.delPopView.render(dialogHtml).appendTo(this.$el);
			return this.$el;
		},
		fnDel: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.trigger('fnDel',this.currentEle);
			this.delPopView.close();
		},
		fnCanc: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.delPopView.close();
		}
		
	});

});