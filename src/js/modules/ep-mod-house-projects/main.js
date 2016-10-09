/**
 * Created by 123 on 25.05.2016.
 * main.js
 * Main module script
 */

/*jslint
 browser : true,   continue : true,    devel : true,     indent   : 2,
 maxerr  : 50,     newcap   : true,    nomen : true,     plusplus : true,
 regexp  : true,   sloppy   : true,    vars : false,     white    : true
 */

/*global
 require
 */



require.config({
  baseUrl : 'js',
  paths   : {
    jquery        : 'libs/jquery/jquery-1.12.3.min',
    jquery_ui     : 'libs/jquery/jquery-ui.min',
    plugins       : 'plugins',
    bootstrap     : 'libs/bootstrap/bootstrap.min',
    underscore    : 'libs/underscore/underscore-min',
    backbone      : 'libs/backbone/backbone-min',
    text          : 'libs/require/text',
    json          : 'libs/require/json',
    ep_mod_hp     : 'modules/ep-mod-house-projects',
    image_viewer  : 'libs/jquery/jquery-image-viewer',
    tabbed_images : 'libs/jquery/jquery-tabbed-images'
  },
  shim    : {
    'backbone'     : {
      deps    : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    'underscore'   : {
      exports : '_'
    },
    'bootstrap'    : {
      deps    : ['jquery'],
      exports : 'bootstrap'
    },
    'json'         : {
      deps : ['text']
    },
    'image_viewer' : {
      deps : ['jquery']
    },
    'tabbed_images' : {
      deps : ['jquery']
    }
  }
});

require([
  'bootstrap',
  'image_viewer',
  'tabbed_images',
  'ep_mod_hp/views/main.view'
], function ( bootstrap, jqueryImageViewer, jqueryTabbedImages, MainView ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var configMap = {
    el : '#ep-mod-hp'
  };

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  new MainView({ el : configMap.el });

});