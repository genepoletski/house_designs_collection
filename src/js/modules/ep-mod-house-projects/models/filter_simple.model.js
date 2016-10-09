/**
 * Created by 123 on 25.05.2016.
 * filter_simple.model.js
 * Simple filter model
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

  var FilterSimpleModel;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  FilterSimpleModel = AbstractModel.extend({
    classId : 'EP_MOD_HP_FILTER_SIMPLE_MODEL',

    initialize : function () {
      this.setFilterKeyName();
      this.setFilterValueNames();
      this.set({ _model : this });
      this.set({ set_values : [] });
    },

    isSet : function ( value ) {
      return ! (this.get( 'set_values' ).indexOf( value ) < 0 );
    },

    // Begin Model method /setFilter/
    //
    // Example   : model.setFilter( <value_map> )
    // Purpose   : set filter model current values
    // Arguments :
    //   * value_map - value properties
    // Action    :
    //   * get value props
    //   * if value to be set, add or update it, then trigger 'changeFilter'
    //   * if value is not to be set, unset it and trigger 'changeFilter'
    // Return    :
    //   * true - if filter was set or unset successfully
    //   * false - other cases
    // Throws    : none
    //
    setFilter : function ( value_map ) {
      var
        value_pos,
        value        = value_map.value,
        value_is_set = value_map.is_set,
        set_values   = this.get( 'set_values' );

      if ( +value + 0 === +value) {
        value = +value;
      }

      if ( value_is_set ) {
        if ( set_values.indexOf( value ) < 0 ) {
          set_values.push( value );
          this.set( { set_values : set_values } );
          this.trigger( 'changeFilter' );
          return true;
        }
        return false;
      }

      value_pos = set_values.indexOf( value );

      if ( value_pos >= 0) {
        set_values.splice( value_pos, 1 );
        this.set( { set_values : set_values } );
        this.trigger( 'changeFilter' );
        return true;
      }
      return false;

    },
    // End Model method /setFilter/

    // Begin Model method /resetFilter/
    //
    // Example   : model.resetFilter()
    // Purpose   : reset filter model current values to none
    // Arguments : none
    // Action    :
    //   * set filter 'set_value' to none
    // Return    : none
    // Throws    : none
    //
    resetFilter : function () {
      this.set( { set_values : [] } );
    }
    // End Model method /resetFilter/
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return model constructor
  return FilterSimpleModel;

});
