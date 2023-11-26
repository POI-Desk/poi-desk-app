<script lang="ts">
	import { graphql } from '$houdini';
	import type { User } from '$lib/types/userTypes';
	import { getBookings } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { onMount } from 'svelte';
	import { searchedUser } from '$lib/searchStore';
	import { goto } from '$app/navigation';

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
	const pageSizeConst = 5;
	let hasNextPage: boolean;

	onMount(() => {
		getSearchUsers(0);
	});

	async function getSearchUsers(pageNumber_param: number) {
		if (typedUsername === "") {
			pageNumber = 1;
		}
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
					break;
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
		if (!typedUsername) {
			pageNumber = 0;
		}
		if (typedUsername) {
			getSearchUsers(pageNumber);
		}
	}

</script>


<div class="flex justify-center w-full">
	<div class="dropdown w-full" on:focusout={handleDropdownFocusLoss}>
		<input
			class="input my-3 w-full"
			placeholder="Search for user"
			bind:value={typedUsername}
			on:click={handleDropDownClick}
			
		/>
		
		<div class="absolute left-0 right-0 w-full px-2">
		{#if dropdownIsOpen}

			<ul
				
				class="dropdown-content z-[1] menu shadow bg-base-100 rounded-box max-h-90 flex-nowrap overflow-auto"
			>
				{#each searchUsers as usr}
					<li class="m-1 flex justify-center">
						<button class="w-full px-3 border rounded-lg flex flex-col"
							style="grid-row: 1; background-color: #d4d6d9;"
							on:click={() => {
								$searchedUser = usr;
								goto("/bookingsOfSearchedUser")
							}}>
							<div class="grid grid-cols-1 justify-items-start">
								<span>{usr.username}</span>
								<span style="grid-row: 2">{usr.userInfo}</span>
							</div>
						</button>
						
					</li>
				{/each}
					<li class="m-1">
						<div class="grid grid-cols-2 grid-rows-1">
							<div style="grid-col: 1">
								{#if pageNumber > 0}
									<button on:click={() => {pageNumber --}}
										class="border rounded-lg py-1 px-2">show less...</button>
								{/if}
							</div>
								{#if hasNextPage && typedUsername}
									<div style="grid-col: 2" class="flex justify-end">
										<button 
										class="border rounded-lg py-1 px-2"
										
										on:click={
											() => {
												dropdownIsOpen = true;
												pageNumber ++;
												getSearchUsers(pageNumber);
											}}>show more...</button>
									</div>
								{/if}
						</div>
					</li>
			</ul>
		{/if}
		</div>
	</div>
</div>
