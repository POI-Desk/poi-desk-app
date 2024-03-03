<script lang="ts">

  import { graphql } from "$houdini";
  import { user } from "$lib/userStore";
  import { goto } from "$app/navigation";


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


<h1 class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500-400-token">
  POI-Desk</h1>

<div class="h-screen flex flex-col items-center justify-center">
  <div class="p-3">
    <input type="text" placeholder="Enter your username" class="input input-primary" id="usernameInput"
           bind:value={username} />
    <input type="password" placeholder="Enter your password" class="input input-primary" bind:value={password} />
  </div>
  <div class="p-3">
    <button class="btn variant-filled-primary p-3" on:click={loginWithoutMicrosoft}>
      Login
    </button>
  </div>
</div>