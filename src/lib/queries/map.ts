import { fragment, graphql } from '$houdini';

export const getMapByFloor = graphql(`
	query GetMapByFloor($floorID: ID!) {
		getMapByFloor(floorId: $floorID) {
			pk_mapId
			height
			width
			desks {
				pk_deskid
				desknum
				x
				y
				rotation
			}
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
	}
`);

export const getMapById = graphql(`
	query getMapById($mapId: ID!) {
		getMapById(mapId: $mapId) {
			pk_mapId
			height
			width
			desks {
				pk_deskid
				desknum
				x
				y
				rotation
			}
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
		}
	}
`);
