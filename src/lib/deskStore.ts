import {graphql} from "$houdini";

export const _getDesksOnFloorVariables = () => {
    return "";
}


export const getDesks = graphql(`
    query getDesksOnFloor($floorid: ID!) @load {
        getDesksOnFloor(floorid: $floorid) {
            pk_deskid
            desknum
            x
            y
            bookings {
                user {
                    pk_userid
                    username
                }
                date
                ismorning
                isafternoon
            }
            attributes {
                attributename
            }
            floor{
                pk_floorid
                floorname
                building{
                    pk_buildingid
                    buildingname
                }
            }
        }
    }
`);