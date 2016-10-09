/**
 * Created by 123 on 27.05.2016.
 * abstract.model.js
 * Abstract model class
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
  'json!ep_mod_hp/config/language.json',
  'json!ep_mod_hp/config/lang-ru.json'
], function ( Backbone, lang, langRu ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var
    configMap = {
      allowed_key_list : [
        'area', 'floors', 'type', 'tech'
      ],
      changeable_key_list : [
        'type', 'tech'
      ]
    },

    stateMap = {
      lang : 'ru'
    },

    AbstractModel;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  AbstractModel = Backbone.Model.extend({
    classId : 'EP_MOD_HP_ABSTRACT_MODEL',

    initialize : function () {
      throw new Error( '(' + this.classId + ') Could not initialize abstract class' );
    },

    // Begin Abstract Model method /setFilterKeyName/
    //
    // Example   : model.setFilterKeyName()
    // Purpose   : set filter model key names in accordance with chosen language
    // Arguments : none
    // Action    :
    //   * get key name from model
    //   * get appropriate name from language.json file
    // Return    : none
    // Throws    : none
    //
    setFilterKeyName : function () {
      var key = this.get( 'key' );
      this.set({ key_name : lang[ stateMap.lang ].key_name[ key ] });
    },
    // End Abstract Model method /setFilterKeyName/

    // Begin Model method /setValueNames/
    //
    // Purpose : make filter model values readable for user
    setFilterValueNames : function () {
      var key_name, changeable_key_list, prev_value_list, rev_value_list;

      changeable_key_list = configMap.changeable_key_list;
      key_name = this.get( 'key' );

      if ( changeable_key_list.indexOf( key_name ) < 0 ) {
        this.set({ value_names : this.get( 'values' ) });
        return;
      }

      prev_value_list = this.get( 'values' );
      rev_value_list = [];

      prev_value_list.forEach( function ( prev_value ) {
        var rev_value = lang[ stateMap.lang ].value_name[ prev_value ];
        rev_value_list.push( rev_value );
      }, this );

      this.set({ value_names : rev_value_list });
    },

    // Begin Model method /setValueNames/
    //
    // Purpose : make model values readable for user
    setValueNames : function () {
      var value_name = lang[ stateMap.lang ].value_name;
      this.set({ value_name : value_name });
    },

    // Begin Model method /toJSON/
    //
    // Purpose : translates values to different languages
    toJSON : function () {
      var
        result = { _lang : {} },
        attributes = this.attributes,
        dictionary = langRu.dictionary,
        attribute;

      for ( attribute in attributes ) {
        result[ attribute ] = attributes[ attribute ];
        result._lang[ attribute ] = dictionary[ attributes[ attribute ] ];
      }

      return result;
    },

    // Begin Model method /n2f/
    //
    // Purpose : separate number into spaced groups by 3
    n2s : function( number, separator ) {
      var
        str = '',
        len;

      number = number.toString().split('');
      len = number.length;

      number.forEach( function( number, index ) {
        if ( len > 3
          && ( index === ( len - 3 )
            || index === ( len - 6 ) ) ) {
          str += ' ';
        }
        str += number;
      }, ' ' );

      return str;
    }
    // Enf Model method /n2s/
    
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return model constructor
  return AbstractModel;

});
