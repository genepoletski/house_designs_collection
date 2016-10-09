/**
 * Created by 123 on 25.05.2016.
 * filter_simple.view.js
 * Simple filter view
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
  'text!ep_mod_hp/templates/filter_simple.template.html'
], function ( $, _, Backbone, filterSimpleTemplate ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var FilterSimpleView;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  FilterSimpleView = Backbone.View.extend({
    classId : 'EP_MOD_HP_PROJECT_BRIEF_VIEW',

    tagName : 'fieldset',
    className : 'ep-mod-hp-filter ep-mod-hp-filter-simple',

    template : _.template( filterSimpleTemplate ),

    events : {
      'change' : 'setFilter'
    },

    initialize : function () {
      this.render();
      this.listenTo( this.model, 'change', this.render );
    },

    render : function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },

    // Begin View method /setFilter/
    //
    // Example   : view.setFilter()
    // Purpose   : set model`s 'set_values' when user selects / deselects
    //             checkboxes
    // Arguments : event object
    // Action    :
    //   * cache elem, input value, selected flag
    //   * set model value state
    // Return    : none
    // Throws    : none
    //
    setFilter : function ( event ) {
      var elem, value, is_selected;

      elem  = event.target;
      value = elem.value;
      is_selected = $( elem ).prop( 'checked' );

      this.model.setFilter({
          value  : value,
          is_set : is_selected
        });
    }
    // End View method /setFilter/
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return view constructor
  return FilterSimpleView;

});
