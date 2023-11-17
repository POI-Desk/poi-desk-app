<script lang="ts">
	import { graphql } from '$houdini';
	import type { User } from '$lib/types/userTypes';
	import { getBookings } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { onMount } from 'svelte';
	import { searchedUser } from '$lib/searchStore';
	import { user } from '$lib/userStore';
	import { goto } from '$app/navigation';
	import { DivideSquare } from 'lucide-svelte';

	export const _getAllUsersVariables = () => {
		return '';
	};



	const getUsers = graphql(`
		query getAllUsers($input: String, $pageNumber: Int, $pageSize: Int) @load {
			getAllUsers(input: $input, pageNumber: $pageNumber, pageSize: $pageSize) {
				content {
					pk_userid
					username
				}
				hasNextPage
			}
		}
	`);

	let pageNumber = 0;
	let searchUsers: User[] = [];
	let dropdownIsOpen: boolean = false;
	const pageSizeConst = 3;
	let hasNextPage: boolean;

	onMount(() => {
		getSearchUsers(0);
	});

	async function getSearchUsers(pageNumber_param: number) {
		await getUsers
			.fetch({
				variables: { input: typedUsername, pageNumber: pageNumber_param, pageSize: pageSizeConst }
			})
			.then(() => {
				let users = $getUsers.data?.getAllUsers.content;
				searchUsers = users.map((user) => ({
					pk_userid: user?.pk_userid,
					username: user?.username,
					location: null,
					userInfo: ''
				}))
				hasNextPage = $getUsers.data?.getAllUsers?.hasNextPage ?? false;
			});

		for (const user of searchUsers) {
			console.log(searchUsers);
			console.log(user);
			let index = searchUsers.indexOf(user);
			console.log(index);
			searchUsers[index] = await getUserInfo(user);
		}
	}

	// let userInfo: string = "";
	let userLocation: string = '';

	$: bookingsOfUser = $getBookings.data?.getBookingsByUserid;

	let typedUsername: string;
	let typedUser: User;

	async function getUserInfo(user: User) {
		typedUser = user;
		await getBookings.fetch({ variables: { userid: user.pk_userid ?? '' } });
		if (bookingsOfUser?.length ?? 0 > 0) {
			for (const booking of bookingsOfUser ?? []) {
				if (booking?.date == $dateValue) {
					await getDesk.fetch({ variables: { bookingid: booking.pk_bookingid ?? '' } }).then(() => {
						let desk = $getDesk.data?.getBookingById?.desk;
						userLocation = desk?.floor?.building.location?.locationname ?? '';
						if (booking.ismorning && booking.isafternoon) {
							user.userInfo = 'today in ' + userLocation;
						} else if (booking.ismorning) {
							user.userInfo = 'this morning in ' + userLocation;
						} else if (booking.isafternoon) {
							user.userInfo = 'this afternoon in ' + userLocation;
						}
					});
				} else {
					user.userInfo = 'not in office today';
				}
			}
		} else {
			user.userInfo = 'not in office today';
		}
		console.log(
			user.username + ' -> userLocation: ' + userLocation + '; userInfo: ' + user.userInfo
		);
		return user;
	}

	async function onUserClicked(user: User) {}

	export const _getDeskOfBookingVariables = () => {
		return {};
	};

	const getDesk = graphql(`
		query getDeskOfBooking($bookingid: ID!) @load {
			getBookingById(id: $bookingid) {
				ismorning
				isafternoon
				desk {
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
	`);

	function handleDropDownClick() {
		dropdownIsOpen = true;
		console.log(dropdownIsOpen + " dropDown wurde geklickt")
	}

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return 
		dropdownIsOpen = false;
		console.log(dropdownIsOpen + " dropDown sollte wieder zu sein")
	}	

	$: {
		if (typedUsername) {
			getSearchUsers(pageNumber);
		}
	}

	let loadMore: boolean = true;

	function handleLoadMore() {
		// TODO was passiert, wenn es keine pages mehr gibt?
		pageNumber++;
		getSearchUsers(pageNumber);
	}

	function handleLoadLess() {
		pageNumber--;
	}
</script>

<!-- on:focusout|stopPropagation={handleDropdownFocusLoss}  -->

<div>
	<div class="dropdown" on:focusout={handleDropdownFocusLoss}>
		<input
			class="input w-3/4 my-3"
			placeholder="Search for user"
			bind:value={typedUsername}
			on:click={handleDropDownClick}
			
		/>
		
		<div >
		{#if dropdownIsOpen}
		
			<ul
				
				class=" dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-3/4 max-h-80 flex-nowrap overflow-auto"
			>
				{#each searchUsers as usr}
					<li >
						<button class="grid grid-cols-2 grid-rows-1"
							style="grid-col: 1"
							on:click={() => {
								$searchedUser = usr;
								goto("/bookingsOfSearchedUser")
							}}>{usr.username}
							<span style="grid-col: 2">{usr.userInfo}</span>
						</button>
						
					</li>
				{/each}
				<li>
					<div class="grid grid-cols-2 grid-rows-1">
						<div style="grid-col: 1; width=100%;">
							{#if pageNumber > 0}
								<button on:click={handleLoadLess}>show less...</button>
							{/if}
						</div>
						{#if hasNextPage && typedUsername}
							<div style="grid-col: 2">
								<button on:click={handleLoadMore}>show more...</button>
							</div>
						{/if}
					</div>
				</li>
			</ul>
		
		{/if}
	</div>
	</div>
</div>
