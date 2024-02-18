<script lang="ts">
  import "../../app.css";
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
  import { AppShell, initializeStores, Modal, storePopup, Toast } from "@skeletonlabs/skeleton";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();
</script>

<Modal position="items-center !p-0" transitions={true} />
<Toast 	zIndex="z-[1000]"/>
<AppShell>
  <slot />
</AppShell>
