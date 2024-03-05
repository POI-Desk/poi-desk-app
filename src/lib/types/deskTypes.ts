
export type Desk = {
    pk_deskid: string;
    desknum: string;
    bookings: {
        date: string;
        ismorning: boolean;
        isafternoon: boolean;
    }[];
    map: {
        floor: {
            floorname: string;
            building: {
                buildingname: string;
            }
        }
    }
};
