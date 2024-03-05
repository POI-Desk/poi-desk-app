import { fragment, graphql } from '$houdini';

export const getPublishedMapOnFloor = graphql(`
    query GetMapByFloor($floorID: ID!) {
        getPublishedMapOnFloor(floorId: $floorID) {
            pk_mapId
            height
            width
            published
            desks {
                pk_deskid
                desknum
                x
                y
                rotation
                map {
                    rooms {
                        pk_roomId
                        x
                        y
                        width
                        height
                    }
                    walls {
                        pk_wallId
                        x
                        y
                        rotation
                        width
                    }
                    doors {
                        pk_doorId
                        x
                        y
                        rotation
                        width
                    }
                    labels {
                        pk_labelId
                        text
                        x
                        y
                        rotation
                    }
                    floor {
                        floorname
                        building {
                            buildingname
                        }
                    }
                }
                bookings {
                    date
                    ismorning
                    isafternoon
                }
                user {
                    pk_userid
                    username
                }
                
            }
        }
    }
`);