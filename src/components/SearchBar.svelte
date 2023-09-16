<script lang="ts">
    import {graphql} from "$houdini";
	import type { User } from "$lib/types/userTypes";
	import { getBookings } from "$lib/bookingStore";
	import { dateValue } from "$lib/dateStore";


    const getUsers = graphql(`
		query getAllUsers @load {
			getAllUsers {
				pk_userid
                username
			}
		}
	`);

    $: users = $getUsers.data?.getAllUsers || [];

    let searchUsers: User[] = [];

    $: {
        if (users) {
            searchUsers = users.map((user) => ({
                pk_userid: user?.pk_userid || null,
                username: user?.username || null,
            }));
        }
    }

   
    $: bookingsOfSelectedUser = $getBookings.data?.getBookingsByUserid;
    let bookingsOnDate = [];

    export let selectedUsername: string;
    export let selectedUser: User; 

    export const _getSeatOfBookingVariables = () => {
		return {};
    }

    const getSeat = graphql(`
        query getSeatOfBooking($bookingid: ID!) @load {
            getSeatOfBooking(bookingid: $bookingid) {
                pk_seatid
                seatnum
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
                await getSeat.fetch({variables: {bookingid: booking.pk_bookingid ?? ""}}).then(() => {
                    let seat = $getSeat.data?.getSeatOfBooking;
                    console.log(user.username + " sitzt heute auf " + seat.seatnum);  
                })
            }
        }
    }

    $: filteredUsers = searchUsers.filter(function(usr) {
        return usr.username?.toLowerCase().includes(selectedUsername?.toLowerCase() ?? "");
    })

</script>

<div>

    <div class="dropdown">
        <input class="input input-bordered" placeholder="Search for user" bind:value={selectedUsername}/>
        <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto">
            {#each filteredUsers as usr}
                <li><button on:click|preventDefault={() => onUserClicked(usr)}>{usr.username}</button></li>
            {/each}
        </ul>
        <span>You selected: {selectedUsername}</span>
    </div>
</div>