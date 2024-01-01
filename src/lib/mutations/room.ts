import { graphql } from "$houdini";

export const addRoom = graphql(`
  mutation AddRoom($room: RoomInput!) {
    addRoom(roomInput: $room) {
      createdOn
    }
  }
`);

export const updateRoomsOnMap = graphql(`
  mutation UpdateRoomsOnMap($mapId: ID!, $roomInputs: [UpdateRoomInput!]!) {
    updateRoomsOnMap(mapId: $mapId, roomInputs: $roomInputs) {
      pk_roomId
    }
  }
`);

export const deleteRooms = graphql(`
  mutation DeleteRooms($roomIds: [ID!]!) {
    deleteRooms(roomIds: $roomIds) {
      pk_roomId
    }
  }
`);