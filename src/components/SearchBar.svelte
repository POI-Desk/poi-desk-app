<script lang="ts">
	import { graphql } from '$houdini';
	import type { User } from '$lib/types/userTypes';
	import { getBookings } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';

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
				pk_userid: user?.pk_userid,
				username: user?.username,
				location: null
			}));
		}
	}

	$: bookingsOfSelectedUser = $getBookings.data?.getBookingsByUserid;
	let bookingsOnDate = [];

	let selectedUsername: string;
	let selectedUser: User;

	export const _getDeskOfBookingVariables = () => {
		return {};
	};

	const getDesk = graphql(`
		query getDeskOfBooking($bookingid: ID!) @load {
			getBookingById(id: $bookingid) {
				desk {
					desknum
					y
					x
				}
			}
		}
	`);

	async function onUserClicked(user: User) {
		selectedUsername = user?.username ?? '';
		selectedUser = user;
		getBookings.fetch({ variables: { userid: user.pk_userid ?? '' } });
		for (const booking of bookingsOfSelectedUser ?? []) {
			console.log(booking?.date + '== ' + $dateValue);

			if (booking?.date == $dateValue) {
				bookingsOnDate.push(booking);
				await getDesk.fetch({ variables: { bookingid: booking.pk_bookingid ?? '' } }).then(() => {
					let desk = $getDesk.data?.getBookingById?.desk;
					console.log(user.username + ' sitzt heute auf ' + desk?.desknum);
				});
			}
		}
	}

	$: filteredUsers = searchUsers.filter(function (usr) {
		return usr.username?.toLowerCase().includes(selectedUsername?.toLowerCase() ?? '');
	});
</script>

<div>
	<div class="dropdown">
		<input class="input w-1/5 my-3" placeholder="Search for user" bind:value={selectedUsername} />
		<ul
			class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto"
		>
			{#each filteredUsers as usr}
				<li><button on:click|preventDefault={() => onUserClicked(usr)}>{usr.username}</button></li>
			{/each}
		</ul>
		<span>You selected: {selectedUsername}</span>
	</div>
</div>
