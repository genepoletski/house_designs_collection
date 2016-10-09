/**
 * Created by 123 on 25.05.2016.
 * filter_min_max.model.js
 * Min_max filter model
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
  'ep_mod_hp/models/abstract.model'
], function ( AbstractModel ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var FilterMinMaxModel;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  FilterMinMaxModel = AbstractModel.extend({
    classId : 'EP_MOD_HP_FILTER_MIN_MAX_MODEL',
    
    initialize : function () {
      this.setFilterKeyName();
      this.setFilterValueNames();

      this.setFilter({
        min : this.get( 'values' )[0],
        max : this.get( 'values' )[1]
      });
    },

    // Begin Model method /setFilter/
    //
    // Example   : model.setFilter( <values_map> )
    // Purpose   : set filter model min and max values
    // Arguments :
    //   * value_map - min and max values
    // Action    :
    //   * make new 'set_values' {Array}
    //   * set min and max values to 'set_values'
    //   * update filter 'set_values'
    //   * trigger 'changeFilter' event on self
    // Return    : none
    // Throws    : none
    //
    setFilter : function ( values_map ) {
      var set_values = [], prop_min, prop_max;

      prop_min = values_map.min;
      prop_max = values_map.max;

      if ( +prop_min + 0 === +prop_min ) {
        prop_min = +prop_min;
      }

      if ( +prop_max + 0 === +prop_max ) {
        prop_max = +prop_max;
      }

      set_values[0] = prop_min;
      set_values[1] = prop_max;

      this.set( { set_values : set_values } );

      this.trigger( 'changeFilter' );
    },
    // End Model method /setFilter/

    // Begin Model method /resetFilter/
    //
    // Example   : model.resetFilter()
    // Purpose   : reset filter model current values to default values
    // Arguments : none
    // Action    :
    //   * set filter 'set_value' to default values
    //   * trigger 'resetFilter' event on self
    // Return    : none
    // Throws    : none
    //
    resetFilter : function () {
      this.set( { set_values : [
        this.get( 'values' )[0],
        this.get( 'values' )[1]
      ] } );
      
      this.trigger( 'resetFilter' );
    }
    // End Model method /resetFilter/
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return model constructor
  return FilterMinMaxModel;

});
