/**
 * Created by 123 on 02.06.2016.
 * router.js
 * Module router
 */

/*jslint
 browser : true,   continue : true,    devel : true,     indent   : 2,
 maxerr  : 50,     newcap   : true,    nomen : true,     plusplus : true,
 regexp  : true,   sloppy   : true,    vars : false,     white    : true
 */

/*global
 define
 */

define([
  'backbone'
], function ( Backbone ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var Router;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN ROUTER CONSTRUCTOR ----------------------

  Router = Backbone.Router.extend({

    initialize : function () {
    },

    // Begin routes hash
    routes : {
      '(:data)'          : 'onRequestProjects',
      'project/:project' : 'onRequestProject'
    },
    // End routes hash

    // Begin Router method /onRequestProjects/
    //
    // Example   : router.onRequestProjects()
    // Purpose   : handle route
    // Arguments : none
    // Action    :
    //   * trigger respective event on self
    // Return    : none
    // Throws    : none
    //
    onRequestProjects : function ( data ) {
      this.trigger( 'requestProjects', data );
    },
    // End Router method /onRequestProjects/

    // Begin Router method /onRequestProject/
    //
    // Example   : router.onRequestProject()
    // Purpose   : handle route
    // Arguments : none
    // Action    :
    //   * trigger respective event on self
    // Return    : none
    // Throws    : none
    //
    onRequestProject : function ( data ) {
      this.trigger( 'requestProject', data );
    }
    // End Router method /onRequestProject/
  });

  // ------------------------ END ROUTER CONSTRUCTOR ----------------------


 // Return Router constructor
  return Router;

} );
