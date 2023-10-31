<script lang="ts">
    import {graphql} from "$houdini";
	import type { User } from "$lib/types/userTypes";
	import { getBookings } from "$lib/bookingStore";
	import { dateValue } from "$lib/dateStore";
	import { onMount } from "svelte";
	import { user } from "$lib/userStore";

    export const _getAllUsersVariables = () => {
        return "";
    }

    const getUsers = graphql(`
		query getAllUsers ($input: String, $pageNumber: Int, $pageSize: Int) @load {
			getAllUsers (input: $input, pageNumber: $pageNumber, pageSize: $pageSize){
				pk_userid
				username
			}
		}
	`);


    let pageNumber = 0;
    let searchUsers: User[] = [];
    let dropdownIsOpen: boolean = false;
    const pageSizeConst = 2;

    onMount(() => {
        getSearchUsers(0);
    })

    async function getSearchUsers(pageNumber_param: number) {
        await getUsers.fetch({ variables: { input: typedUsername, pageNumber: pageNumber_param, pageSize: pageSizeConst}}).then(() => {
            let users = $getUsers.data?.getAllUsers;
            searchUsers = users.map((user) => ({
                pk_userid: user?.pk_userid,
                username: user?.username,
                location: null
            }));
        })

        for (const user of searchUsers) {
            onUserClicked(user);
        }

    }

    // let userInfo: string = "";
    let userLocation: string = "";

    async function onUserClicked(user: User) {
        //typedUsername = user?.username ?? "";
        selectedUser = user;
        getBookings.fetch({variables: {userid: user.pk_userid ?? ""}});
        for (const booking of bookingsOfSelectedUser?? []) {
            //console.log(booking?.date + "== " + $dateValue);
            if (booking?.date == $dateValue) {
                //bookingsOnDate.push(booking);       
                await getDesk.fetch({variables: {bookingid: booking.pk_bookingid ?? ""}}).then(() => {
                    let desk = $getDesk.data?.getBookingById?.desk;
                    // console.log(user.username + " sitzt am nachmittag hier: " + booking.isafternoon)
                    // console.log(user.username + " sitzt heute auf " + desk?.floor?.building?.location?.locationname);  
                    userLocation = desk?.floor?.building.location?.locationname ?? "";
                    if (booking.ismorning || booking.isafternoon) user.userInfo = "today in " + userLocation;
                    else {
                        console.log(user.username + "not in office today");
                        user.userInfo = "not in office today"
                    }
                    console.log(user.username + " -> userLocation: " + userLocation + "; userInfo: " + user.userInfo);
                })
            }

            

        }
    }

	$: bookingsOfSelectedUser = $getBookings.data?.getBookingsByUserid;
	let bookingsOnDate = [];

    let typedUsername: string;
    let selectedUser: User;

	export const _getDeskOfBookingVariables = () => {
		return {};
    }

    const getDesk = graphql(`
        query getDeskOfBooking($bookingid: ID!) @load {
            getBookingById(id: $bookingid) {
                ismorning
                isafternoon
                desk{
                    desknum
                    y
                    x
                    floor {
                        pk_floorid
                        floorname
                        building {
                            buildingname
                            location {
                                locationname
                            }
                        }
                    }
                }
            }
        }
    `)

    function handleDropDownClick() {
        dropdownIsOpen = true;
    }

    function handleDropdownFocusLoss() {
        dropdownIsOpen = false;
    }

  

    
    $: {
        if (typedUsername) {
            getSearchUsers(pageNumber);
        }
    }

    let loadMore: boolean = true;

    function handleLoadMore() {
        // TODO was passiert, wenn es keine pages mehr gibt?
        pageNumber ++;
        getSearchUsers(pageNumber);
    }

    function handleLoadLess() {
        pageNumber --;
    }

	$: filteredUsers = searchUsers.filter(function (usr) {
		return usr.username?.toLowerCase().includes(selectedUsername?.toLowerCase() ?? '');
	});
</script>

<div>
    <div class="dropdown">
        <input class="input w-1/5 my-3" placeholder="Search for user" bind:value={typedUsername} on:click={handleDropDownClick}/>
        {#if dropdownIsOpen}        
            <ul on:focusout|stopPropagation={handleDropdownFocusLoss} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto">
                {#each searchUsers as usr}
                    <li>
                        <button on:click|preventDefault={() => onUserClicked(usr)}>{usr.username}</button>
                        <!-- <span>{usr.userInfo}</span> -->
                    </li>
                {/each}
                <li>
                    {#if loadMore && typedUsername}
                        <button on:click={handleLoadMore}>show more...</button>
                    {/if}
                    {#if pageNumber > 0}
                        <button on:click={handleLoadLess}>show less...</button>
                    {/if}
                </li>
                
            </ul>
        {/if}
    </div>
</div>
