import { getUserById } from "$lib/queries/userQueries";
import { user } from "$lib/stores/userStore";
import type { Role } from '$lib/types/roleTypes';
import { goto } from "$app/navigation";

export async function getUser(userid: string) {
  const tempUser = await getUserById.fetch({ variables: { id: userid } });

  user.set({
    pk_userid: tempUser.data?.getUserById?.pk_userid ?? "",
    username: tempUser.data?.getUserById?.username ?? "",
    roles: tempUser.data?.getUserById?.roles ?? [],
    location: {
      locationname: tempUser.data?.getUserById?.location?.locationname ?? "",
      pk_locationid: tempUser.data?.getUserById?.location?.pk_locationid ?? ""
    }
  });

  // user.pk_userid = tempUser.data?.getUserById?.pk_userid ?? "";
  // $user.username = tempUser.data?.getUserById?.username ?? "";
  // $user.roles = tempUser.data?.getUserById?.roles;
}

export function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function checkCookie(role: string) {
  let userid = getCookie("userid");
  if (userid != "") {
    getUser(userid).then(() => {
      !user.subscribe((u) => {
        if (!u.roles?.map((r: Role) => r.rolename).includes(role)) {
          goto("/");
        }
			});
    });
  } else {
    goto("/login");
  }
}