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

    //$: users = getUsers.fetch({ variables: { pageNumber: 1, pageSize: 2}});

    let searchUsers: User[] = [];

    onMount(() => {
        getSearchUsers();
    })

    async function getSearchUsers() {
        // TODO change page size and page number
        await getUsers.fetch({ variables: { input: selectedUsername, pageNumber: 0, pageSize: 2}}).then(() => {
            let users = $getUsers.data?.getAllUsers;
            searchUsers = users.map((user) => ({
                pk_userid: user?.pk_userid,
                username: user?.username,
                location: null
            }));
        })
    }

   
    $: bookingsOfSelectedUser = $getBookings.data?.getBookingsByUserid;
    let bookingsOnDate = [];

    let selectedUsername: string;
    let selectedUser: User;

    export const _getDeskOfBookingVariables = () => {
		return {};
    }

    const getDesk = graphql(`
        query getDeskOfBooking($bookingid: ID!) @load {
            getBookingById(id: $bookingid) {
                desk{
                    desknum
                    y
                    x
                }
            }
        }
    `)


    async function onUserClicked(user: User) {
        selectedUsername = user?.username ?? "";
        selectedUser = user;        
        getBookings.fetch({variables: {userid: user.pk_userid ?? ""}});
        for (const booking of bookingsOfSelectedUser?? []) {
            console.log(booking?.date + "== " + $dateValue);
            
                      
            if (booking?.date == $dateValue) {
                bookingsOnDate.push(booking);       
                await getDesk.fetch({variables: {bookingid: booking.pk_bookingid ?? ""}}).then(() => {
                    let desk = $getDesk.data?.getBookingById?.desk;
                    console.log(user.username + " sitzt heute auf " + desk?.desknum);  
                })
            }
        }
    }

    // $: filteredUsers = searchUsers.filter(function(usr) {
    //     return usr.username?.toLowerCase().includes(selectedUsername?.toLowerCase() ?? "");
    // })
    
    $: {
        if (selectedUsername) {
            getSearchUsers();
        }
    }

</script>

<div>
    <div class="dropdown">
        <input class="input w-1/5 my-3" placeholder="Search for user" bind:value={selectedUsername}/>
        <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto">
            {#each searchUsers as usr}
                <li><button on:click|preventDefault={() => onUserClicked(usr)}>{usr.username}</button></li>
            {/each}
            <li><button>load more...</button></li>
        </ul>
        <span>You selected: {selectedUsername}</span>
    </div>
</div>