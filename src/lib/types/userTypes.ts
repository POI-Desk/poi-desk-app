import type { Location } from "./locationType";

export type User = {
	pk_userid: string;
	username: string;
	location: Location | null;
};
