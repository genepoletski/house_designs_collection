/**
 * Created by 123 on 01.06.2016.
 * projects_detailed.model.js
 * Project model with a lot of data
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

  var ProjectsDetailedModel;

  // ----------------------- END MODULES SCOPE VARIABLES --------------------


  // ------------------------ BEGIN MODULE CONSTRUCTORS ---------------------

  ProjectsDetailedModel = AbstractModel.extend({
    classId    : 'EP_MOD_HP_PROJECT_DETAILED_MODEL',

    initialize : function () {
      this.setValueNames();
      this.set({ _model : this });
    },

    // Begin Model method /getFloorArea/
    //
    // Example   : model.getFloorArea( 'floor_01' )
    // Purpose   : get floor total area
    // Arguments :
    //   * floor_key - floor id
    // Action    :
    //   * get respective floor rooms
    //   * sum up rooms area
    //   * return sum
    // Return    : sun of floor rooms area
    // Throws    : none
    //
    getFloorArea : function ( floor_key ) {
      var floor_rooms = this.get( 'floors' )[ floor_key ];
      return floor_rooms.reduce( function ( sum, room ) {
        return sum + room.area;
      }, 0 );
    },
    // End Model method /getFloorArea/

    // Begin Model method /getFloorsArea/
    //
    // Example   : model.getFloorsArea()
    // Purpose   : get all floors total area
    // Arguments : none
    // Action    :
    //   * get all floors
    //   * for each floor sum up its rooms area and add to total
    //   * return total
    // Return    : total area of all the floors
    // Throws    : none
    //
    getFloorsArea : function () {
      var
        floors = this.get( 'floors' ),
        total_area = 0,
        floor;

      for ( floor in floors ) {
        if ( floors.hasOwnProperty( floor ) ) {
          total_area += this.getFloorArea( floor );
        }
      }

      return total_area;
    },
    // End Model method /getFloorsArea/

    // Begin Model method /getDesignTotalCost/
    //
    // Example   : model.getDesignTotalCost()
    // Purpose   : calculate design total cost
    // Arguments : none
    // Action    :
    //   * store sections maps
    //   * sum up sections cost
    // Return    : design total cost
    // Throws    : none
    //
    getDesignTotalCost : function () {
      var
        sections = this.get( 'design' ),
        total_cost = 0,
        section;

      for (section in sections) {
        if ( sections.hasOwnProperty( section ) ) {
          total_cost += this.getSectionCost( section );
        }
      }

      return total_cost;
    },
    // End Model method /getDesignTotalCost/

    // Begin Model method /getRoomArea/
    //
    // Example   : model.getRoomArea()
    // Purpose   : get room area
    // Arguments :
    //   * floor_id  - floor to which a room belongs
    //   * room_type - type of room to find
    // Action    :
    //   * get list of all the rooms from the floor
    //   * find respective room area
    //   * return requested area
    // Return    : room area
    // Throws    : none
    //
    getRoomArea : function ( floor_id, room_type ) {
      var
        room_list = this.get( 'floors' )[ floor_id ],
        room_area;

      room_list.forEach( function ( room_map ) {
        if ( room_map.type === room_type ) {
          room_area = room_map.area;
        }
      } );

      return room_area;
    },
    // End Model method /getRoomArea/

    // Begin Model method /getSectionCost/
    //
    // Example   : model.getSectionCost( 'architect' )
    // Purpose   : calculate section subcost
    // Arguments :
    //    * section_name
    // Action    :
    //   * store section map
    //   * sum up section work types cost
    // Return    : section subcost
    // Throws    : none
    //
    getSectionCost : function ( section_name ) {
      var
        section = this.get( 'design' )[ section_name ],
        section_cost = 0;

      section.forEach( function ( work_type ) {
        section_cost += work_type.cost;
      } );

      return section_cost;
    },
    // End Model method /getSectionCost/

    // Begin Model method /getRoomsNumber/
    //
    // Example   : model.getRoomsNumber( 'bedroom' )
    // Purpose   : get number of rooms of given type
    // Arguments :
    //    * room_type - type of a room
    // Action    :
    //   * get all floors
    //   * for each floor increase count for every matching room
    //   * return count
    // Return    : number of rooms matching the given type
    // Throws    : none
    //
    getRoomsNumber : function ( room_type ) {
      var
        count = 0,
        floors, floor, rooms;

      floors = this.get( 'floors' );

      for ( floor in floors ) {
        if ( floors.hasOwnProperty( floor ) ) {
          rooms = floors[ floor ];
          rooms.forEach( function( room ) {
            if ( room.type === room_type ) {
              count++ ;
            }
          });
        }
      }

      return count;
    }
    // End Model method /getRoomsNumber/

  });

  // ------------------------ END MODULE CONSTRUCTORS ----------------------


  // Return model constructor
  return ProjectsDetailedModel;

});