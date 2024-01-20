<script>
	import AddBuilding from "$components/SuperAdminComponents/AddBuilding.svelte";
	import AddLocation from "$components/SuperAdminComponents/AddLocation.svelte";
	import LocationList from "$components/SuperAdminComponents/LocationList.svelte";
	import SaveChanges from "$components/SuperAdminComponents/SaveChanges.svelte";

	let addLocationClicked = false;

</script>
<AddLocation />
<AddBuilding />
<SaveChanges />	

<!-- <LocationList /> -->