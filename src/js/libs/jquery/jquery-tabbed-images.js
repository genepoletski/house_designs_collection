/**
 * Created by 123 on 14.06.2016.
 */

( function ( $ ) {
  "use strict";

  $.fn.tabbedImages = function ( options ) {


    // ------------------ BEGIN PLUGIN SCOPE VARIABLES ----------------------

    var
      $container = this,

      configMap = {
        plugin_id    : 'ep-plug-ti',
        class : {
          active      : 'ep-plug-ti-active',
          tab_control : 'ep-plug-ti-tab-control',
          tab_list    : 'ep-plug-ti-tab-list',
          tab_panel   : 'ep-plug-ti-tab-panel'
        },

        tag : {
          tab_control : 'li',
          tab_list    : 'ul',
          tab_panel   : 'div'
        },
        style : {
          active_tab_background_color : 'transparent',
          active_tab_border_color     : '#FFFFFF',
          font_size                   : '1.2em',
          tab_background_color        : '#f9f9f9',
          tab_border_color            : '#ddd',
          tab_border_width            : '2px',
          tab_list_bottom_color       : '#ddd',
          tab_text_color              : 'inherit'
        }
      },

      stateMap = {
        $container    : null,
        $active_tab   : null,
        $active_panel : null,
        img_list      : []
      },

      jqueryMap = {
        $tab_list     : null
      },

      setStyle, setJqueryMap, setStateMap, setEventHandlers, setPluginDOM,
      configPlugin, initPlugin;

    // -------------------- END PLUGIN SCOPE VARIABLES ----------------------


    // ------------------------- BEGIN DOM METHODS --------------------------

    // Begin DOM method /setPluginDOM/
    setPluginDOM = function () {
      var $tab_list, $tab, $link, $tab_panel, $img, $container;

      $container = $( '<div>' );

      $tab_list = $( '<' + configMap.tag.tab_list + '>' )
        .addClass( configMap.class.tab_list );

      $container.append( $tab_list );

      stateMap.img_list.forEach( function ( img_map, index ) {
        $tab = $( '<' + configMap.tag.tab_control + '>' );

        if ( index === 0) {
          $tab.addClass( configMap.class.active );
        }

        $link = $( '<a>' )
          .addClass( configMap.class.tab_control )
          .attr({ 'href' : '#' + configMap.plugin_id + '-' + index })
          .text( img_map.title );

        $tab.append( $link );
        $tab_list.append( $tab );

        $tab_panel = $( '<' + configMap.tag.tab_panel + '>' )
          .addClass( configMap.class.tab_panel )
          .addClass( configMap.plugin_id + '-' + index );

        if ( index === 0 ) {
          $tab_panel.addClass( configMap.class.active );
        }

        $img = $( '<img>' ).addClass( 'img-responsive' );
        $img.attr({
          'src' : img_map.main_img
        });

        $tab_panel.append( $img );
        $container.append( $tab_panel );

      } );

      $( stateMap.$container ).empty().append( $container.html() );
    };

    // Begin DOM method /setStyle/
    //
    // Example   : setStyle()
    // Purpose   : add plugin style to document
    // Arguments : none
    // Action    :
    //   *
    // Return    : none
    // Throws    : none
    //
    setStyle = function () {
      var
        style_html = '<style>',
        selector, rules_map, set_style_rules;

      set_style_rules = function ( selector, rules_map ) {
        var
          style_str = '',
          prop_name;

        style_str += selector;
        style_str += ' {';

        for (prop_name in  rules_map) {
          if (rules_map.hasOwnProperty( prop_name )) {
            style_str += prop_name;
            style_str += ':' + rules_map[ prop_name ];
            style_str += ';'
          }
        }

        style_str += '} ';

        return style_str;
      };

      // TAB LIST STYLE
      selector  = configMap.tag.tab_list + '.' + configMap.class.tab_list;
      rules_map = {
        'padding'       : '0',
        'border-bottom' :  configMap.style.tab_border_width
                           + ' solid '
                           + configMap.style.tab_list_bottom_color
      };
      style_html += set_style_rules( selector, rules_map );

      // TAB STYLE
      selector  = '.' + configMap.class.tab_list;
      selector += ' ' + configMap.tag.tab_control;
      rules_map = {
        'display'          : 'inline-block',
        'margin-bottom'    : '-' + configMap.style.tab_border_width,
        'border-radius'    : '0.5em 0.5em 0 0',
        'border'           : configMap.style.tab_border_width
                             + ' solid '
                             + configMap.style.tab_border_color,
        'background-color' : configMap.style.tab_background_color
      };
      style_html += set_style_rules( selector, rules_map );

      // TAB ANCHOR STYLE
      selector  = configMap.tag.tab_control;
      selector += ' .' + configMap.class.tab_control;
      rules_map = {
        'padding'         : '0 2em 0 2em',
        'text-decoration' : 'none',
        'font-size'       : configMap.style.font_size,
        'color'           : configMap.style.tab_text_color
      };
      style_html += set_style_rules( selector, rules_map );

      // ACTIVE TAB STYLE
      selector  = configMap.tag.tab_control + '.' + configMap.class.active;
      rules_map = {
        'border-bottom'    : configMap.style.tab_border_width
                             + ' solid '
                             + configMap.style.active_tab_border_color,
        'background-color' : configMap.style.active_tab_background_color
      };
      style_html += set_style_rules( selector, rules_map );

      // TAB PANEL STYLE
      selector  = '.' + configMap.class.tab_panel;
      rules_map = {
        display : 'none'
      };
      style_html += set_style_rules( selector, rules_map );

      // ACTIVE TAB PANEL STYLE
      selector  = '.' + configMap.class.tab_panel;
      selector += '.' + configMap.class.active;
      rules_map = {
        display : 'block'
      };
      style_html += set_style_rules( selector, rules_map );

      style_html += '</style>';

      $( 'head' ).append( $( style_html ) );
    };
    // End DOM method /setStyle/

    // -------------------------- END DOM METHODS ---------------------------


    // ----------------------- BEGIN EVENT HANDLERS -------------------------

    setEventHandlers = function () {
      jqueryMap.$tab_list
        .on( 'click', '.' + configMap.class.tab_control, function (event) {
          var $link, tab_id;

          event.preventDefault();

          $link = $( this );

          stateMap.$active_tab
            = jqueryMap.$tab_list.find( '.' + configMap.class.active );
          tab_id = this.hash;

          if ( tab_id
            && !( $link.parent().is( '.' + configMap.class.active ) ) ) {

            stateMap.$active_tab.removeClass( configMap.class.active );
            stateMap.$active_panel.removeClass( configMap.class.active );

            stateMap.$active_panel = $container
              .find( configMap.tag.tab_panel + '.' + tab_id.slice(1) )
              .addClass( configMap.class.active );
            stateMap.$active_tab = $link
              .parent( configMap.tag.tab_control )
              .addClass( configMap.class.active );
          }

      } )
    };

    // ------------------------ END EVENT HANDLERS --------------------------

    setJqueryMap = function () {
      jqueryMap.$container = stateMap.$container;
      jqueryMap.$tab_list
        = stateMap.$container.find( '.' + configMap.class.tab_list );
    };

    setStateMap = function () {
      stateMap.$container = $container;
      stateMap.$active_tab = jqueryMap.$tab_list
        .find( configMap.tag.tab_control + '.' + configMap.class.active);
      stateMap.$active_panel = $container
        .find( configMap.tag.tab_panel + '.' + configMap.class.active );
    };

    configPlugin = function ( options ) {
      if ( options.hasOwnProperty( 'img_list') ) {
        stateMap.img_list = options.img_list;
      }
    };

    initPlugin = function ( $container ) {
      if ( options ) {
        configPlugin( options )
      }
      stateMap.$container = $container;
      setStyle();
      setPluginDOM();
      setJqueryMap();
      setStateMap();
      setEventHandlers();
    };

    initPlugin( $container );

    return this;

  }

}( jQuery ));