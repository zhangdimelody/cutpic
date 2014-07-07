require.config({
	paths: {
		"backbone": "vendor/components/backbone/index"
		,"$": "vendor/components/jquery/index"
		,"json": "vendor/components/json/index"
		,"marionette": "vendor/components/marionette/index"
		,"_": "vendor/components/lodash/index"
		,"requirejs": "vendor/components/requirejs/index"
		,"talent" : 'vendor/components/talent/index'
    	,'$.simplemodal' : 'vendor/legacy/jquery.simplemodal'
		,'$.migrate' : 'vendor/legacy/jquery-migrate-1.2.1'
		,"CutPicView" : 'vendor/components/cutpic/index'
	},
	shim: {
		'$': {
			exports: '$'
		}
		,'_': {
			exports: '_'
		}
		,'backbone': {
			deps: ['json', '_', '$'],
			exports: 'Backbone'
		}
		,'marionette': {
			deps: ['backbone'],
			exports: 'Marionette'
		}
		,'talent': {
			deps: ['marionette'],
			exports: 'Talent'
		}
        ,'$.simplemodal':['$']
        ,'$.migrate':['$']
        ,'CutPicView': {
            deps: ['$','$.migrate']
        }
	}
});