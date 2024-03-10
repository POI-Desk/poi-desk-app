<script lang="ts">


  import { goto } from "$app/navigation";
  import { graphql } from "$houdini";
  import { user } from "$lib/stores/userStore";


  const createOrLoginAsUser = graphql(`
		mutation createOrLoginAsUser($username: String!, $password: String!) {
			createOrLoginAsUser(username: $username, password: $password) {
				pk_userid
				username
				location {
					pk_locationid
					locationname
				}
			}
		}
	`);

  let path: string = "/location";
  let username: string = "";
  let password: string = "";

  function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  async function loginWithoutMicrosoft() {
    try {
      const result = await createOrLoginAsUser.mutate({
        username: username,
        password: password
      });
      if (result.data?.createOrLoginAsUser?.pk_userid) {
        console.log("hallo defined");

        $user = { ...result.data?.createOrLoginAsUser! };
        path = $user.location == null ? "/location" : "/";
        goto(path);
        setCookie("userid", $user.pk_userid, 7);
        console.log(decodeURIComponent(document.cookie));

      } else {
        alert("Incorrect user name or password");
        username = "";
        password = "";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>

<div class="h-screen w-full flex items-center justify-center">
  <div class="h-full flex flex-col items-center justify-between py-52">
    <img class="max-w-md" src="/poi-desk_logo.svg" alt="Das POI-Desk Logo" />

    <div class="p-3 flex flex-col justify-center gap-2">
      <input type="text" placeholder="username" class="input input-primary" id="usernameInput"
             bind:value={username} />
      <input type="password" placeholder="password" class="input input-primary" bind:value={password} />

      <div class="p-4 flex justify-center">
        <button class="btn variant-filled-primary p-3 px-5" on:click={loginWithoutMicrosoft}>
          Login
        </button>
      </div>
    </div>
    <div></div>
  </div>
</div>