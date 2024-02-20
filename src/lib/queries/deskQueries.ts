import { graphql } from '$houdini';

export const _getDesksOnFloorVariables = () => {
	return '';
};

export const getDeskById = graphql(`
	query getDeskById($deskId: ID!) {
		getDeskById(deskId: $deskId) {
			pk_deskid
			desknum
			x
			y
			user {
				pk_userid
				username
			}
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
			floor {
				pk_floorid
				floorname
				building {
					pk_buildingid
					buildingname
				}
			}
		}
	}
`);
