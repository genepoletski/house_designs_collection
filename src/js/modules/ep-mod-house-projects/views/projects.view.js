/**
 * Created by 123 on 25.05.2016.
 * projects.view.js
 * Projects collection view
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
  'jquery',
  'underscore',
  'backbone',
  'ep_mod_hp/views/filters.view',
  'ep_mod_hp/views/project_brief.view',
  'ep_mod_hp/collections/projects_brief.collection',
  'json!ep_mod_hp/data/projects.json',
  'json!ep_mod_hp/data/filters.json',
  'text!ep_mod_hp/templates/projects.template.html'
  ], function ( $, _, Backbone,
                FiltersView, ProjectBriefView,
                ProjectsBriefCollection,
                projectsData, filtersData,
                projectsTemplate ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var
    configMap = {
      container : {
        filtersView     : '#ep-mod-hp-filters',
        projectsGallery : '#ep-mod-hp-collection-gallery'
      }
    },

    ProjectsView;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  ProjectsView = Backbone.View.extend({
    classId : 'EP_MOD_HP_PROJECTS_VIEW',

    className : 'col-md-9',

    template : _.template( projectsTemplate ),

    events : {
      'click #ep-mod-hp-collection-sort a'    : 'onClickSort',
      'click #ep-mod-hp-collection-gallery a' : 'onClickProject'
    },

    initialize : function ( init_data ) {
      var
        state_map = null,
        filters_state_map = null;

      if ( init_data.data ) {
        if ( init_data.data.state_map ) {
          state_map         = init_data.data.state_map;
          filters_state_map = state_map.filter;
        }

      }

      this.collection = new ProjectsBriefCollection( null, {
        projects_data     : projectsData,
        filters_data      : filtersData,
        filters_state_map : filters_state_map
      } );

      this.render();

      this.listenTo( this.collection, 'change, reset', this.renderProjects );
      this.listenTo( this.collection, 'changeState', this.onChangeState );
    },

    onChangeState : function ( state_str ) {
      this.trigger( 'changeState', state_str );
    },

    // Begin View method /render/
    //
    // Example   : view.renderProjects()
    // Purpose   : render projects view
    // Arguments : none
    // Action    :
    //   * apply this view template
    //   * initialize new filtersView with el and collection
    //   * render projects views
    //   * return this view
    // Return    : this view
    // Throws    : none
    //
    render : function () {

      this.$el.html( this.template );

      this.filtersView = new FiltersView({
        el         : configMap.container.filtersView,
        collection : this.collection.filtersCollection
      });

      this.renderProjects();

      return this;
    },
    // End View method /render/

    // Begin View method /renderProjects/
    //
    // Example   : view.renderProjects()
    // Purpose   : render all projects
    // Arguments : none
    // Action    : render each model of this view collection
    // Return    : none
    // Throws    : none
    //
    renderProjects : function () {
      this.$( configMap.container.projectsGallery ).empty();

      this.collection.each( function( project_model ) {
        this.renderProject( project_model );
      }, this );
    },
    // End View method /renderProjects/

    // Begin View method /renderProject/
    //
    // Example   : view.renderProject( <project_model> )
    // Purpose   : render project view
    // Arguments :
    //   * project_model - Backbone project model
    // Action    :
    //   * create new project brief view with given model
    //   * append view to proper container
    // Return    : none
    // Throws    : none
    // 
    renderProject : function ( project_model ) {
      var projectBriefView = new ProjectBriefView({
        model : project_model
      });
      this.$( configMap.container.projectsGallery )
        .append( projectBriefView.render().el );
    },
    // End View method /renderProject/

    // Begin View method /onClickSort/
    //
    // Example   : view.onClickSort()
    // Purpose   : handle sort click
    // Arguments : event object
    // Action    :
    //   * prevent default action
    //   * cache elems and sort key
    //   * toggle sort order or sort by another key
    //   * sort projects collection
    //   * render projects
    // Return    : none
    // Throws    : none
    //
    onClickSort : function ( event ) {
      var elem, $parent, sort_key, sort_order;

      event.preventDefault();

      elem = event.target;
      $parent = $( elem ).parents( 'li' );
      sort_key = elem.hash.slice(1);

      if ( $parent.hasClass( 'ep-mod-hp-collection-sort-active' ) ) {
        sort_order = this.toggleSort( event );
      }
      else {
        sort_order = this.newSort( event );
      }

      this.collection.sortByKey( sort_key, sort_order );
      this.renderProjects();
    },
    // End View method /onClickSort/

    // Begin View method /toggleSort/
    //
    // Example   : view.toggleSort()
    // Purpose   : toggle elem classes
    // Arguments :
    //   * event - event object
    // Action    :
    //   * get target elem and make the jQuery object
    //   * toggle DOM classes representing ascending and descending order
    //   * return order value
    // Return    :
    //   * order - value 'asc' or 'desc'
    // Throws    : none
    //
    toggleSort : function ( event ) {
      var elem, $elem, sort_order, ascClassName, descClassName;

      elem          = event.target;
      $elem         = $( elem );

      ascClassName  = 'ep-mod-hp-collection-sort-order-asc';
      descClassName = 'ep-mod-hp-collection-sort-order-desc';

      $elem.toggleClass( function () {
        if ( $( this ).hasClass( ascClassName ) ) {
          $( this ).removeClass( ascClassName );
          sort_order = 'desc';
          return descClassName;
        }
        else {
          $( this ).removeClass( descClassName );
          sort_order = 'asc';
          return ascClassName;
        }
      } );

      return sort_order;
    },
    // End View method /toggleSort/

    // Begin View method /newSort/
    //
    // Example   : view.newSort()
    // Purpose   : set new active sort elem (change its class)
    // Arguments :
    //   * event - event object
    // Action    :
    //   * remove proper class from previously active elem
    //   * add proper class to event target elem
    //   * return order value
    // Return    :
    //   * order value - 'asc' or 'desc'
    // Throws    : none
    //
    newSort : function ( event ) {
      var elem, $elem, $parent, $list, $active,
        containerClassName, activeClassName, ascClassName;

      elem    = event.target;
      $elem   = $( elem );
      $parent = $elem.parent();

      containerClassName = 'ep-mod-hp-collection-sort';
      activeClassName = 'ep-mod-hp-collection-sort-active';
      ascClassName = 'ep-mod-hp-collection-sort-order-asc';

      $list   = $elem.parents( '.' + containerClassName );
      $active = $list.find( '.' + activeClassName );

      $active.removeClass( activeClassName );
      $parent.addClass( activeClassName );

      if ( $elem.hasClass( ascClassName ) ) {
        return 'asc';
      }
      return 'desc';
    },
    // End View method /newSort/

    // Begin View method /onClickProject/
    //
    // Example   : view.onClickProject()
    // Purpose   : handle project click
    // Arguments : event object
    // Action    :
    //   * prevent default action
    //   * get fired element
    //   * find element parent anchor elem
    //   * get project id (anchor href attribute without '#' )
    //   * trigger 'requestDetailedProject' event with project id data
    // Return    : none
    // Throws    : none
    //
    onClickProject : function ( event ) {
      var elem, $anchor_elem, project_id;
      event.preventDefault();
      elem = event.target;
      $anchor_elem = $( elem ).parents( 'a' );
      project_id = $anchor_elem.attr( 'href' ).slice(1);
      this.trigger( 'requestDetailedProject', project_id );
    }
    // End View method /onClickProject/
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return view constructor
  return ProjectsView;

});
