/**
 * Created by 123 on 25.05.2016.
 * projects_brief.collection.js
 * Collection of projects brief models
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
  'ep_mod_hp/collections/filters.collection',
  'ep_mod_hp/models/project_brief.model'
  ], function ( Backbone, FiltersCollection, ProjectBriefModel ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var ProjectsBriefCollection;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  ProjectsBriefCollection = Backbone.Collection.extend({
    classId : 'EP_MOD_HP_PROJECTS_BRIEF_COLLECTION',

    initialize : function ( models, init_data ) {
      var filters_state_map;

      filters_state_map = init_data.filters_state_map || null;

      this._full_collection = new Backbone.Collection();
      this.addProjects( init_data.projects_data.project_list );

      this.filtersCollection
        = new FiltersCollection( null, {
        filters_data      : init_data.filters_data,
        filters_state_map : filters_state_map
      } );

      this.listenTo( this.filtersCollection, 'requestFilteredEstimate',
        this.onRequestFilteredEstimate );

      this.listenTo( this.filtersCollection, 'applyFilters',
        this.applyFilters );
      
      this.listenTo( this.filtersCollection, 'resetFilters',
        this.resetCollection );
    },

    // Begin Collection method /addProjects/
    //
    // Example   : collection.addProjects( <JSON> )
    // Purpose   : populates collection with models created from JSON
    // Arguments :
    //   * project_list - array with projects data (JSON)
    // Action    :
    //   * iterate through the list of projects
    //     and add each of them to collection
    // Return    : none
    // Throws    : none
    //
    addProjects : function ( project_list ) {
      project_list.forEach( function( project_data ) {
        this.addProject( project_data );
      }, this );
    },
    // End Collection method /addProjects/

    // Begin Collection method /addProject/
    //
    // Example   : collection.addProjects( <JSON> )
    // Purpose   : instantiate and add project model to collection
    // Arguments :
    //   * project_data - project data (JSON)
    // Action    :
    //   * create ne model from JSON
    //   * add model to collection
    //   * add model to collection complete copy
    // Return    : none
    // Throws    : none
    //
    addProject : function( project_data ) {
      var projectBriefModel = new ProjectBriefModel( project_data );
      this.add( projectBriefModel );
      this._full_collection.add( projectBriefModel );
    },
    // End Collection method /addProject/

    // Begin Collection method /sortByKey/
    //
    // Example   : collection.sortByKey( 'key', 'asc' )
    // Purpose   : sort collection by key in asc/desc order
    // Arguments :
    //   * key   - model key
    //   * order - could be 'asc' or 'desc'
    // Action    :
    //   * set collection comparator
    //     ** get model_a and model_b key values
    //     ** set boolean is_asc true/false depending on requested order
    //     ** return -1 / 0 / 1 depending on key values and order
    //   * sort collection with revised comparator
    // Return    : none
    // Throws    : none
    //
    sortByKey : function ( key, order ) {

      this.comparator = function ( model_a, model_b ) {
        var val_a, val_b, is_asc;
        val_a = model_a.get( key );
        val_b = model_b.get( key );

        is_asc = ( order === 'asc' );

        if ( val_a > val_b ) {
          return  is_asc ? 1 : -1 ;
        }
        else if ( val_a < val_b ) {
          return is_asc ? -1 : 1 ;
        }
        else {
          return 0;
        }
      };

      this.sort();
    },
    // End Collection method /sortByKey/

    getFilteredModels : function() {
      var
        filtered_collection_models,
        original_collection
          = new Backbone.Collection( this._full_collection.models );

      filtered_collection_models =
        this.filterCollection( original_collection, this.filtersCollection );

      return filtered_collection_models;
    },

    onRequestFilteredEstimate : function () {
      this.filtersCollection.setFilteredEstimate( this.getFilteredModels() );
    },

    // Begin Collection method /applyFilters/
    //
    // Example   : collection.applyFilters()
    // Purpose   : filter this collection by this filters collection
    // Arguments : none
    // Action    :
    //   * make a copy of collection with all the models
    //   * filter copy with set filters
    //   * reset this collection with filtered models
    //   * trigger 'change event' (for ProjectsView listener)
    //   * return filtered collection models
    // Return    : filtered collection models
    // Throws    : none
    //
    applyFilters : function () {
      var
        original_collection
        = new Backbone.Collection( this._full_collection.models ),
        filtered_collection_models, state_str;

      filtered_collection_models =
        this.filterCollection( original_collection, this.filtersCollection );

      this.reset( filtered_collection_models );

      state_str = this.getStateStr();
      this.trigger('changeState', state_str);

      return filtered_collection_models;
    },
    // End Collection method /applyFilters/

    getStateStr : function () {
      var
        state_str = null,
        filters_state, last_index;

      filters_state = this.filtersCollection.getStateStr();

      if ( filters_state !== null ) {
        state_str = 'filter=';
        last_index = filters_state.length - 1;
        filters_state.forEach( function ( filter_str, index ) {
          state_str += filter_str;
          if ( index !== last_index) {
            state_str += '|';
          }
        } );
      }

      return state_str;
    },

    resetCollection : function () {
      this.reset( this._full_collection.models );
      this.trigger( 'changeState', 'reset' );
    },

    // Begin Collection method /filterCollection/
    //
    // Example   : collection.filterCollection( <collection>, <filters_collection> )
    // Purpose   : filter arbitrary collection by arbitrary filters collection
    // Arguments :
    //   * collection - Backbone collection to filter
    //   * filters_collection - Backbone collection of filters
    // Action    :
    //   * create temporary collection with all given models
    //   * for each filter model call this collection respective filtering method
    //   * return filtered collection models
    // Return    : filtered collection models
    // Throws    : none
    //
    filterCollection : function ( collection, filters_collection ) {
      filters_collection.each( function ( filter_model ) {

        switch ( filter_model.get( 'filter_type' ) ) {
          case 'simple'  :
            this.filterBySimple( collection, filter_model );
            break;

          case 'min_max' :
            this.filterByMinMax( collection, filter_model );
            break;

          default :
            break;
        }
      }, this );

      return collection.models;
    },
    // End Collection method /filterCollection/


    filterBySimple : function ( collection, filter_model ) {
      var
        temp_collection = new Backbone.Collection(),
        key = filter_model.get( 'key' ),
        set_values = filter_model.get( 'set_values' );

      if ( set_values.length === 0 ) {
        return;
      }

      set_values.forEach( function ( value ) {
        var attr = {};

        if ( +value + 0 ) {
         value = +value ;
        }

        attr[key] = value;

        temp_collection.add( collection.filter( function ( project_model ) {
          var model_value = project_model.get( key );

          if ( ! Array.isArray( model_value ) ) {
            return model_value === value;
          }
          else {
            return model_value.indexOf( value ) >= 0;
          }
        } ) );

      }, this );

      collection.reset( temp_collection.models );

      return collection.models;
    },

    filterByMinMax : function ( collection, filter_model ) {
      var
        temp_collection = new Backbone.Collection(),
        key = filter_model.get( 'key' ),
        set_values = filter_model.get( 'set_values' ),
        minVal, maxVal;

      if ( set_values.length === 0 ) {
        return;
      }

      minVal = set_values[0];
      maxVal = set_values[1];

      if ( +minVal + 0 ) {
        minVal = +minVal ;
      }

      if ( +maxVal + 0 ) {
        maxVal = +maxVal ;
      }

      collection.forEach( function ( project_model ) {
        var value = project_model.get( key );

        if ( +value + 0 ) {
          value = +value ;
        }

        if ( value >= minVal && value <= maxVal ) {
          temp_collection.add( project_model );
        }

      } );

      collection.reset( temp_collection.models );

      return collection.models;
    }

  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return collection constructor
  return ProjectsBriefCollection;

});
