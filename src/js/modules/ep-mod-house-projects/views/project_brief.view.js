/**
 * Created by 123 on 25.05.2016.
 * project_brief.view.js
 * Project brief view
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
  'text!ep_mod_hp/templates/project_brief.template.html'
], function ( Backbone, projectBriefTemplate ) {

  "use strict";


  // ---------------------- BEGIN MODULE SCOPE VARIABLES --------------------

  var ProjectBriefView;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  ProjectBriefView = Backbone.View.extend({
    classId : 'EP_MOD_HP_PROJECT_BRIEF_VIEW',

    tagName   : 'div',
    className : 'ep-mod-hp-project-brief pull-left col-xs-12 col-sm-6 col-md-4',

    template : _.template( projectBriefTemplate ),

    initialize : function () {
      this.render();
    },

    render : function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }
  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return view constructor
  return ProjectBriefView;

});
