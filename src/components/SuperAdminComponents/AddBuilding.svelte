<script lang="ts">
    //import { addBuilding } from "$lib/mutations/buildings";
    import { getBuildings } from "$lib/queries/buildingQueries";
	import { onMount } from "svelte";
    import { locationid } from "$lib/locationStore";

    $: locid = $locationid;

    let buildingNames: String[] = [];

    onMount(async () => {
        await getBuildings.fetch({ variables: { locationid: locid } });
        let buildings = $getBuildings.data?.getBuildingsInLocation;
        for (let building in buildings) {
            buildingNames.push(building.buildingname);
        }
    })
</script>

<p>hello buildingadd</p>