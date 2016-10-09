/**
 * Created by 123 on 08.06.2016.
 */

( function ( $ ) {
  "use strict";

  $.fn.imageViewer = function ( options ) {


    // ------------------ BEGIN PLUGIN SCOPE VARIABLES ----------------------

    var
      configPlugin, initPlugin, startPlugin, setPluginDOM, setEventHandlers,
      onClickThumb, crossFade, setStyles, setStyle,

      $container = this,

      configMap = {

        class : {
          active     : 'ep-plug-iv-active',
          is_loading : 'ep-plug-iv-is-loading',
          frame      : 'ep-plug-iv-main',
          thumbs     : 'ep-plug-iv-thumbs',
          thumb_link : 'ep-plug-iv-thumb'
        },

        tag : {
          frame      : '<div>',
          thumbs     : '<div>',
          thumb_link : '<a>',
          thumb_img  : '<img>'
        },

        main_img_height          : 300,
        main_img_loading_content : 'url(js/libs/jquery/loading.gif)',
        main_img_max_width       : '100%',
        main_img_max_height      : '100%',

        thumb_img_height         : 100,
        thumb_img_width          : 'auto',
        thumb_img_opacity        : 0.3
      },

      stateMap = {
        $container : null,
        img_paths  : null,
        cache      : {}
      },

      jqueryMap = {
        $container        : null,
        $frame            : null,
        $thumbs_container : null,
        $thumbs           : null
      };

    // -------------------- END PLUGIN SCOPE VARIABLES ----------------------


    // ---------------------- BEGIN UTILITY METHODS -------------------------

    // ----------------------- END UTILITY METHODS --------------------------


    // ------------------------- BEGIN DOM METHODS --------------------------

    // Begin DOM method /crossFade/
    //
    crossFade = function ( $img ) {
      if ( stateMap.$current ) {
        stateMap.$current.stop().fadeOut( 'slow' );
      }

      $img.css({
        marginLeft : -$img.width() / 2,
        marginTop  : -$img.height() / 2
      });

      $img.stop().fadeTo( 'slow', 1 );

      stateMap.$current = $img;
    };
    // End DOM method /crossFade/

    // Begin DOM method /setPluginDOM/
    //
    setPluginDOM = function( $container ) {
      var $frame, $thumbs_container, $thumb_link, $thumb_img;

      $frame = $( configMap.tag.frame ).addClass( configMap.class.frame );
      jqueryMap.$frame = $frame;

      $thumbs_container
        = $( configMap.tag.thumbs ).addClass( configMap.class.thumbs );
      jqueryMap.$thumbs_container = $thumbs_container;

      stateMap.img_paths.forEach( function ( path_map, index ) {
        var
          main_img_path   = path_map.main_img,
          thumb_img_path = path_map.thumb_img;

        $thumb_link = $( configMap.tag.thumb_link )
          .addClass( configMap.class.thumb_link )
          .attr( 'href', main_img_path );

        if ( index === 0 ) {
          $thumb_link.addClass( configMap.class.active );
        }

        $thumb_img = $( configMap.tag.thumb_img )
          .attr({ src : thumb_img_path });

        $thumb_link.append( $thumb_img );
        $thumbs_container.append( $thumb_link );
      });

      jqueryMap.$thumbs = $thumbs_container.children();

      $container.empty().append( $frame ).append( $thumbs_container );
      
      return $container;
    };
    // End DOM method /setPluginDOM/

    // Begin DOM method /setStyle/
    setStyles = function () {
      var
        style_html = '<style>',
        selector, rules_map;

      selector = '.' + configMap.class.frame;
      rules_map = {
        position : 'relative',
        height   : configMap.main_img_height + 'px',
        overflow : 'hidden',
        'margin-bottom' : '1em'
      };

      style_html += setStyle( selector, rules_map );

      selector  = '.' + configMap.class.frame;
      selector += '.' + configMap.class.is_loading;

      rules_map = {
        background : 'rgba(255, 255, 255, 0.5)',
        'opacity'  : 0.7
      };

      style_html += setStyle( selector, rules_map );

      selector  = '.' + configMap.class.frame;
      selector += '.' + configMap.class.is_loading;
      selector += ':after';

      rules_map = {
        content  : configMap.main_img_loading_content,
        position : 'absolute',
        top      : ( configMap.main_img_height / 2 - 32 )+ 'px',
        left     : '47%'
      };

      style_html += setStyle( selector, rules_map );

      selector  = '.' + configMap.class.frame + ' img';
      rules_map = {
        'position'   : 'absolute',
        'max-height' : configMap.main_img_max_height,
        'max-width'  : configMap.main_img_max_width,
        'height'     : '100%',
        'width'      : 'auto',
        'top'        : '50%',
        'left'       : '50%'
      };

      style_html += setStyle( selector, rules_map );

      selector  = '.' + configMap.class.thumbs + ' a';
      rules_map = {
        display : 'inline-block',
        height  : configMap.thumb_img_height + 'px',
        width   : configMap.thumb_img_width + 'px'
      };

      style_html += setStyle( selector, rules_map );

      selector  = '.' + configMap.class.thumbs + ' img';
      rules_map = {
        height      : '100%',
        width       : 'auto',
        overflow    : 'hidden'
      };

      style_html += setStyle( selector, rules_map );

      selector = 'a.' + configMap.class.active;
      rules_map = {
        opacity : configMap.thumb_img_opacity
      };

      style_html += setStyle( selector, rules_map );

      style_html += '</style>';

      $( 'head' ).append( $( style_html ) );
    };
    // End DOM method /setStyle/

    setStyle = function ( selector, rules_map ) {
      var
        style_str = '',
        prop_name;

      style_str += selector;
      style_str += ' {';

      for ( prop_name in  rules_map ) {
        if ( rules_map.hasOwnProperty( prop_name ) ) {
          style_str += prop_name;
          style_str += ':' + rules_map[ prop_name ];
          style_str += ';'
        }
      }

      style_str += '} ';

      return style_str;
    };
        
    // -------------------------- END DOM METHODS ---------------------------


    // ----------------------- BEGIN EVENT HANDLERS -------------------------
    setEventHandlers = function () {
      jqueryMap.$thumbs.on( 'click', onClickThumb );
    };

    onClickThumb = function ( event ) {
      var
        src     = this.href,
        request = src,
        $img;

      event.preventDefault();

      jqueryMap.$thumbs.removeClass( configMap.class.active );
      $( this ).addClass( configMap.class.active );

      if ( stateMap.cache.hasOwnProperty( src ) ) {
        if ( stateMap.cache[ src ].is_loading === false ) {
          crossFade( stateMap.cache[ src ].$img );
        }
      }
      else {
        $img = $('<img/>');
        stateMap.cache[ src ] = {
          $img       : $img,
          is_loading : true
        };

        $img.on( 'load', function () {
          $img.hide();
          jqueryMap.$frame.removeClass( configMap.class.is_loading ).append( $img );
          stateMap.cache[ src ].is_loading = false;
          if ( request === src ) {
            crossFade( $img );
          }
        });

        jqueryMap.$frame.addClass( configMap.class.is_loading );

        $img.attr({
          'src' : src,
          'alt' : this.title || ''
        });
      }
    };

    // ------------------------ END EVENT HANDLERS --------------------------

    configPlugin = function () {
      switch ( typeof options ) {
        case 'object':
          stateMap.img_paths = options.img_paths;

          if ( options.hasOwnProperty( 'main_img_height' ) ) {
            configMap.main_img_height = options.main_img_height;
          }

          if ( options.hasOwnProperty( 'loading_img_path' ) ) {
            configMap.loading_img_path = options.loading_img_path;
          }

          break;
      }
    };

    initPlugin = function ( $container ) {
      stateMap.$container = $container;
      setPluginDOM( stateMap.$container );
      setEventHandlers();
      setStyles();
      jqueryMap.$thumbs.eq( 0 ).click();
    };

    startPlugin = function ( $container ) {
      if ( options ) {
        configPlugin( options );
      }
      initPlugin( $container );
    };

    startPlugin( $container );

    // Return original jQuery object
    return this;

  }

}( jQuery ));
