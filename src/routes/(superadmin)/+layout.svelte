<script lang="ts">
  import ModalDefaultLocation from "$components/DefaultLocationComponents/ModalContents/ModalDefaultLocation.svelte";
  import ModalBooking from "$components/SetBookingComponents/ModalContents/ModalBooking.svelte";
  import ModalEditBooking from "$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte";
  import ModalChangeDefaultLocation from "$components/UserPageComponents/ModalChangeDefaultLocation.svelte";
  import "../../app.css";
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
  import type { ModalComponent } from "@skeletonlabs/skeleton";
  import {
    AppShell,
    initializeStores,
    Modal,
    modeUserPrefers,
    setModeCurrent,
    storePopup,
    Toast
  } from "@skeletonlabs/skeleton";
  import ModalExtendedBooking from "$components/ExtendedBookingComponents/ModalExtendedBooking.svelte";
  import { onMount } from "svelte";
  import { getUserById } from "$lib/queries/userQueries";
  import { user } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import type { Role } from "$lib/types/roleTypes";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  const modalComponentRegistry: Record<string, ModalComponent> = {
    modalBooking: {
      ref: ModalBooking,
      slot: "<p>skeleton</p>"
    },
    modalExtendedBooking: {
      ref: ModalExtendedBooking,
      slot: "<p>skeleton</p>"
    },
    modalDefaultLocation: {
      ref: ModalDefaultLocation,
      slot: "<p>skeleton</p>"
    },
    modalEditBooking: {
      ref: ModalEditBooking,
      slot: "<p>skeleton</p>"
    },
    modalChangeDefaultLocation: {
      ref: ModalChangeDefaultLocation,
      slot: "<p>skeleton</p>"
    }
  };

  onMount(() => {
    setModeCurrent($modeUserPrefers ?? true);
    checkCookie();
  });

  async function getUser(userid: string) {
    const tempUser = await getUserById.fetch({ variables: { id: userid } });
    $user.location = {
      locationname: tempUser.data?.getUserById?.location?.locationname ?? "",
      pk_locationid: tempUser.data?.getUserById?.location?.pk_locationid ?? ""
    };
    $user.pk_userid = tempUser.data?.getUserById?.pk_userid ?? "";
    $user.username = tempUser.data?.getUserById?.username ?? "";
    $user.roles = tempUser.data?.getUserById?.roles;
  }

  function getCookie(cname: string) {
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

  function checkCookie() {
    let userid = getCookie("userid");
    if (userid != "") {
      getUser(userid).then(() => {
        if (!$user.roles?.map((r: Role) => r.rolename).includes("Super Admin")) {
          goto("/");
        }
      });
    } else {
      goto("/login");
    }
  }
</script>

<Modal position="items-center !p-0" transitions={true} components={modalComponentRegistry} />
<Toast zIndex="z-[1000]" />
<AppShell>
  <slot />
</AppShell>
