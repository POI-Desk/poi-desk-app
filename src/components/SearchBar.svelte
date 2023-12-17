<script lang="ts">
	import { graphql } from '$houdini';
	import type { User } from '$lib/types/userTypes';
	import { getBookings } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { onMount } from 'svelte';
	import { searchedUser } from '$lib/searchStore';
	import { goto } from '$app/navigation';
	import { MapPin } from 'lucide-svelte';

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
	*/

	let pageNumber = 0;
	let searchUsers: User[] = [];
	let dropdownIsOpen: boolean = false;
	const pageSizeConst = 5;
	let hasNextPage: boolean;
	

	// onMount(() => {
	// 	getSearchUsers(0);
	// });

	async function getSearchUsers(pageNumber_param: number) {
		console.log("geSearchUsers");
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
			let index = searchUsers.indexOf(user);
			searchUsers[index] = await getUserInfo(user);
		}
	}
*/
	// let userInfo: string = "";
	let userLocation: string = '';


	$: bookingsOfUser = $getBookings.data?.getBookingsByUserid;

	let typedUsername: string;
	let typedUser: User;
	let mpUserUserinfo = new Map();

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
							mpUserUserinfo.set(user.pk_userid, 'today in ' + userLocation)
							//user.userInfo = 'today in ' + userLocation;
						} else if (booking.ismorning) {
							mpUserUserinfo.set(user.pk_userid, 'this morning in ' + userLocation)
							//user.userInfo = 'this morning in ' + userLocation;
						} else if (booking.isafternoon) {
							mpUserUserinfo.set(user.pk_userid, 'this afternoon in ' + userLocation)
							//user.userInfo = 'this afternoon in ' + userLocation;
						}
					});
					break;
				} else {
					mpUserUserinfo.set(user.pk_userid, 'not in office today')
					//user.userInfo = 'not in office today';
				}
			}
		} else {
			mpUserUserinfo.set(user.pk_userid, 'not in office today')
			//user.userInfo = 'not in office today';
		}
		console.log(
			user.username + ' -> userLocation: ' + userLocation + '; userInfo: ' + mpUserUserinfo.get(user.pk_userid)
		);
		return user;
	}
*/
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
			//getSearchUsers(pageNumber);
		}
	}


	let loadMore: boolean = true;

	function handleLoadMore() {
		// TODO was passiert, wenn es keine pages mehr gibt?
		pageNumber++;
		//getSearchUsers(pageNumber);
	}

	function handleLoadLess() {
		pageNumber--;
	}

</script>


<div class="flex justify-center w-full" on:focusout={handleDropdownFocusLoss}>
	<div class="dropdown w-full">
		<div>
			<input
				class="input my-1 w-full rounded-full"
				placeholder="Search for user"
				bind:value={typedUsername}
				on:click={handleDropDownClick}
				
			/>
		</div>
		
		<div class="absolute left-0 right-0 w-full px-2 z-10">
		{#if dropdownIsOpen}

			<ul
				style="background-color: white;"
				class="dropdown-content menu shadow bg-base-100 rounded-xl max-h-90 flex-nowrap overflow-auto"
			>
				{#each searchUsers as usr}
					<li class="m-1 flex justify-center">
						<button class="w-full px-3 border rounded-2xl flex flex-col"
							style="grid-row: 1; background-color: #1A4775; color: #ffffff;"
							on:click={() => {
								$searchedUser = usr;
								goto("/bookings/" + usr.username)
							}}>
							<div class="grid grid-cols-1 justify-items-start">
								<span>{usr.username}</span>
								<span style="grid-row: 2">{mpUserUserinfo.get(usr.pk_userid)}</span>
							</div>
						</button>
						
					</li>
				{/each}
					<li class="m-1">
						<div class="grid grid-cols-2 grid-rows-1">
							<div style="grid-col: 1">
								{#if pageNumber > 0}
									<button on:click={() => {pageNumber --}}
										class="border rounded-2xl py-1 px-2" 
										style="background-color: #FFFCF2;">show less...</button>
								{/if}
							</div>
								{#if hasNextPage && typedUsername}
									<div style="grid-col: 2" class="flex justify-end">
										<button 
										class="border rounded-2xl py-1 px-2"
										style="background-color: #FFFCF2;"
										on:click={
											() => {
												//dropdownIsOpen = true;
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
