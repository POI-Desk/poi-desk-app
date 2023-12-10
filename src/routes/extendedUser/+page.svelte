<script>
    import EBDeskSelection from "$components/EBDeskSelection.svelte";
    import SearchBar from "$components/SearchBar.svelte";
    import {user} from "$lib/userStore.ts";
    import DateSelection from "$components/DateSelection.svelte";
    import BuildingSelection from "$components/BuildingSelection.svelte";
    import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
    import FloorSelection from "$components/FloorSelection.svelte";
</script>

<div class="m-3">

    <h1>Extended User</h1>

    <a class="btn variant-filled-primary" href="./login">Login</a>

    <!--Debugging-->
    <!-- <p>{$user.pk_userid ?? 'no id'}</p> -->
    <p>You are logged in as {$user.username ?? 'no username'}</p>
    <p>Your location is {$user.location?.locationname ?? 'no location'}</p>
    <!-- <p>{$user.location?.pk_locationid ?? 'no location'}</p> -->
    <!---->
    <SearchBar/>

    <DateSelection/>

    <IntervalSelection/>

    <FloorSelection/>

    <EBDeskSelection/>

    <div class="flex justify-center">
        <div class="absolute bottom-20">
            <BuildingSelection/>
        </div>
    </div>

</div>
