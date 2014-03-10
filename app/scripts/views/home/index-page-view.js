define(['talent'
	,'templates/home'
],function(Talent
	,jst
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = Talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['home/index-page']
		,className: 'home-page-container'
		,initialize: function() {
			
		}
		,regions: {
			content: '.page-content'
		}
		,ui:{
			start: '.btn-start'
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.start] = 'start';
			return events;
		}
		,start: function(e) {
			this.ui.start.html('button clicked!');
		}
		,onRender: function() {
		}
		,onShow: function() {
		}
		,onClose:function(){
		}
	});


	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'Home'
	});
});
