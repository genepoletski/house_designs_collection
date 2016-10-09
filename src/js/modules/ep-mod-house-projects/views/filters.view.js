/**
 * Created by 123 on 25.05.2016.
 * filters.view.js
 * Projects collection filter view
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
  'underscore',
  'backbone',
  'ep_mod_hp/views/filter_simple.view',
  'ep_mod_hp/views/filter_min_max.view',
  'text!ep_mod_hp/templates/filters.template.html'
  ], function ( _, Backbone,
                FilterSimpleView, FilterMinMaxView,
                filtersTemplate ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var
    configMap = {
      container : {
        filters : '#ep-mod-hp-filters-container'
      }
    },

    FiltersView;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  FiltersView = Backbone.View.extend({
    classId : 'EP_MOD_HP_FILTERS_VIEW',

    template : _.template( filtersTemplate ),

    events : {
      'click .ep-mod-hp-filters-submit' : 'onFilterSubmit',
      'click .ep-mod-hp-filters-reset'  : 'onFilterReset'
    },

    initialize : function () {

      this.$el.addClass( 'ep-mod-hp-filters' );

      this.render();

      this.listenTo( this.collection, 'changeFilteredEstimate',
        this.onChangeFilteredEstimate );
    },

    render : function () {
      this.$el.html( this.template );

      this.renderFilters();

      return this;
    },

    getState : function () {
      var state_map = {};
      return state_map;
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
    renderFilters : function () {
      this.collection.each( function( filter_model ) {
        this.renderFilter( filter_model );
      }, this );
    },
    // End View method /renderFilters/

    // Begin View method /renderFilter/
    //
    // Example   : view.renderFilter( <filter_model> )
    // Purpose   : render filter view
    // Arguments :
    //   * filter_model - Backbone filter model
    // Action    :
    //   * create new filter view with given model
    //   * append view to respective container
    // Return    : none
    // Throws    : none
    //
    renderFilter : function ( filter_model ) {
      var filterView, filter_type;

      filter_type = filter_model.get( 'filter_type' );

      switch ( filter_type ) {
        case "simple"  :
          filterView = new FilterSimpleView({
            model : filter_model
          });
          break;

        case "min_max" :
          filterView = new FilterMinMaxView({
            model : filter_model
          });
          break;
      }

      this.$( configMap.container.filters )
        .append( filterView.render().el );
    },
    // End View method /renderProject/

    // Begin View method /onChangeFilteredEstimate/
    //
    // Example   : view.onChangeFilteredEstimate()
    // Purpose   : show the number of estimate filtered projects
    // Arguments : data - number of filtered projects
    // Action    :
    //   * update submit button text with a number of estimate filtered projects
    // Return    : none
    // Throws    : none
    //
    onChangeFilteredEstimate : function ( data ) {
      this.$( '.ep-mod-hp-filters-submit' )
        .text('Показать (' + data + ')')
        .addClass( 'btn-success' )
        .removeClass( 'btn-info' );
    },
    // End View method /onChangeFilteredEstimate/

    // Begin View method /onFilterSubmit/
    //
    // Example   : view.onFilterSubmit()
    // Purpose   : command filters collection to apply its filter
    // Arguments : event object
    // Action    :
    //   * prevent default submit action
    //   * call filters collection method 'applyFilters'
    //   * remove number of filtered projects from submit button text
    // Return    : none
    // Throws    : none
    //
    onFilterSubmit : function ( event ) {
      event.preventDefault();
      this.collection.applyFilters();
      this.$('.ep-mod-hp-filters-submit' )
        .text('Показать')
        .addClass( 'btn-info' )
        .removeClass( 'btn-success' );
    },
    // End View method /onFilterSubmit/

    // Begin View method /onFilterReset/
    //
    // Example   : view.onFilterReset()
    // Purpose   : command filters collection to reset its filter
    // Arguments : event object
    // Action    :
    //   * prevent default reset action
    //   * call filters collection method 'resetFilters'
    //   * remove number of filtered projects from submit button text
    // Return    : none
    // Throws    : none
    //
    onFilterReset : function ( event ) {
      event.preventDefault();
      this.collection.resetFilters();
      this.$('.ep-mod-hp-filters-submit' )
        .text('Показать' )
        .addClass( 'btn-info' )
        .removeClass( 'btn-success' );
    }
    // End View method /onFilterReset/

  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return view constructor
  return FiltersView;

});
