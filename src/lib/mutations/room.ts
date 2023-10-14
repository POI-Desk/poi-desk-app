import { graphql } from "$houdini";

export const addRoom = graphql(`
  mutation AddRoom($room: RoomInput!) {
    addRoom(roomInput: $room) {
      createdOn
    }
  }
`);