/**
 * Created by 123 on 25.05.2016.
 * main.view.js
 * Main module view
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
  'backbone',
  'ep_mod_hp/routers/router',
  'ep_mod_hp/views/projects.view',
  'ep_mod_hp/views/project_detailed.view',
  'json!ep_mod_hp/config/config.json',
  'text!ep_mod_hp/templates/main.template.html'
  ], function ( Backbone, Router, ProjectsView, ProjectDetailedView,
                config, mainTemplate ) {
  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var
    configMap = {
      container : {
        projectsView        : '#ep-mod-hp-projects',
        projectDetailedView : '#ep-mod-hp-project-detailed'
      }
    },

    MainView;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  MainView = Backbone.View.extend({

    classId : 'EP_MOD_HP_MAIN_VIEW',

    template : _.template( mainTemplate ),

    initialize : function() {
      this.$el.addClass( 'container' );

      this.render();

      this.router = new Router();

      this.listenTo( this.router, 'requestProjects', this.onRequestRouteProjects );
      this.listenTo( this.router, 'requestProject', this.onRequestRouteProject );

      Backbone.history.start();

      this.$el.removeClass( 'mod-is-loading' );

    },

    render : function () {
      this.$el.html( this.template );
    },

    // Begin View method /renderProjects/
    //
    // Example   : view.renderFilters()
    // Purpose   : render all filters
    // Arguments : none
    // Action    : render each filter model of this view collection
    // Return    : none
    // Throws    : none
    //
    initProjectsView : function ( data ) {
      this.projectsView = new ProjectsView({
        el   : this.$( configMap.container.projectsView ),
        data : data
      });

      this.listenTo( this.projectsView, 'requestDetailedProject',
        this.onRequestProject );

      this.listenTo( this.projectsView, 'changeState',
        this.onChangeState );
    },

    initProjectDetailedView : function ( project_id ) {
      this.projectDetailedView = new ProjectDetailedView({
        el           : this.$( configMap.container.projectDetailedView ),
        project_data : { project_id : project_id }
      });
    },

    onChangeState : function ( state_str ) {
      if ( ! state_str ) {
        return;
      }

      if ( state_str === 'reset' ) {
        this.router.navigate( 'projects' );
        return;
      }

      state_str = 'projects&&' + state_str;
      
      this.router.navigate( state_str );
    },

    onRequestProject : function ( data ) {
      var base_route, route;

      base_route = config.routes.base_route;

      if ( base_route !== '' ) {
        route = base_route + '/project/' + data;
      }
      else {
        route = 'project/' + data;
      }

      this.router.navigate( route, { trigger : true } );
  },

    onRequestRouteProjects : function ( data ) {
      var state_map = null;

      if ( data !== this.prev_projects_view_data ) {
        this.prev_projects_view_data = data;
        state_map = this.stateDataToJSON( data );
        this.initProjectsView( { state_map : state_map } );
      }

      if ( this.projectDetailedView ) {
        this.projectDetailedView.$el.hide();
      }

      if ( state_map ) {
        this.$( '.ep-mod-hp-filters-submit' ).click();
      }

      this.projectsView.$el.show();
    },

    onRequestRouteProject : function ( data ) {
      this.initProjectDetailedView( data );

      if ( this.projectsView ) {
        this.projectsView.$el.hide();
      }

      this.projectDetailedView.$el.show();
    },

    stateDataToJSON : function ( state_data ) {
      var filters_regex, filters, sorts_regex, sorts, pages_regex, pages;

      state_data = decodeURIComponent( state_data );

      filters_regex = /filter=(.[^&&]*)/;
      filters       = state_data.match( filters_regex );
      if ( filters ) {
        filters = filters[1];
        filters = filters.split('|');
      }

      sorts_regex = /sort=(.[^&&]*)/;
      sorts       = state_data.match( sorts_regex );
      if ( sorts ) {
        sorts = sorts[1];
        sorts = sorts.split('|');
      }

      pages_regex = /page=(.[^&&]*)/;
      pages       = state_data.match( pages_regex );
      if ( pages ) {
        pages = pages[1];
        pages = pages.split('|');
      }

      return {
        filter : filters,
        sort   : sorts,
        page   : pages
      };
    }

  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------

  // Return view constructor
  return MainView;

});