import type { User } from "$lib/types/userTypes";

export type Team = {
  pk_teamid: string;
  teamname: string;
  teammembers: [User]
};
