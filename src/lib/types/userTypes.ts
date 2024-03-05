import type { Location } from "./locationType";
import type { Team } from "$lib/types/teamType";

export type User = {
	pk_userid: string;
	username: string;
	location: Location | null;
	teams: [Team] | null
};
