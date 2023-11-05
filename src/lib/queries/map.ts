import { graphql } from '$houdini';

export const getMapByFloor = graphql(`
	query GetMapByFloor($floorID: ID!) @load {
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
		}
	}
`);
