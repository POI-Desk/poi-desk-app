<script lang="ts">
  import { graphql } from "$houdini";
  import type { User } from "$lib/types/userTypes";
  import { getBookingsOfUserAndTime } from "$lib/bookingStore";
  import { dateValue } from "$lib/dateStore";
  import { createEventDispatcher, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { MapPin, Search } from "lucide-svelte";

  export let showUsrInfo: boolean;
  const dispatch = createEventDispatcher();

  export const _getAllUsersVariables = () => {
    return "";
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
          userInfo: ""
        }));
        hasNextPage = $getUsers.data?.getAllUsers?.hasNextPage ?? false;
      });

    for (const user of searchUsers) {
      let index = searchUsers.indexOf(user);
      searchUsers[index] = await getUserInfo(user);
    }
  }

  let userLocation: string = "";

  $: bookingsOfUser = $getBookingsOfUserAndTime.data?.getBookingsByUserAndCurrent;

  let typedUsername: string;
  let mpUserUserinfo = new Map();

  async function getUserInfo(user: User) {
    await getBookingsOfUserAndTime.fetch({ variables: { userid: user.pk_userid ?? "", isCurrent: true } });
    if (bookingsOfUser?.length ?? 0 > 0) {
      for (const booking of bookingsOfUser ?? []) {
        if (booking?.date === $dateValue) {
          await getDesk.fetch({ variables: { bookingid: booking.pk_bookingid ?? "" } }).then(() => {
            let desk = $getDesk.data?.getBookingById?.desk;
            userLocation = desk?.map?.floor?.building.location?.locationname ?? "";
            if (booking.ismorning && booking.isafternoon) {
              mpUserUserinfo.set(user.pk_userid, "today in " + userLocation);
            } else if (booking.ismorning) {
              mpUserUserinfo.set(user.pk_userid, "this morning in " + userLocation);
            } else if (booking.isafternoon) {
              mpUserUserinfo.set(user.pk_userid, "this afternoon in " + userLocation);
            }
          });
          break;
        } else {
          mpUserUserinfo.set(user.pk_userid, "not in office today");
        }
      }
    } else {
      mpUserUserinfo.set(user.pk_userid, "not in office today");
    }

    return user;
  }

  function onUserClicked() {
    dispatch("clicked", "clicked");
  }

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
					map {
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
		}
	`);

  function handleDropDownClick() {
    dropdownIsOpen = true;
  }

  const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
    dropdownIsOpen = false;
  };

  $: {
    if (!typedUsername) {
      pageNumber = 0;
    }
    if (typedUsername) {
      getSearchUsers(pageNumber);
    }
    if (typedUsername === "") {
      dropdownIsOpen = false;
    }
  }

  function handleUserClicked(usr) {
    dispatch("clicked", usr);
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

<div class="flex items-center relative">
  <div class="flex justify-center w-full" on:focusout={handleDropdownFocusLoss}>
    <div class="dropdown w-full">
      <input
        class="input my-1 w-full rounded-full py-3 border-none shadow-md"
        class:pl-20={showUsrInfo}
        class:pl-3={!showUsrInfo}
        placeholder="Search..."
        bind:value={typedUsername}
        on:input={handleDropDownClick}
      />
      <div class="absolute left-0 right-0 w-full px-2 z-10">
        {#if dropdownIsOpen}
          <ul
            class="dropdown-content menu shadow variant-filled-tertiary dark:bg-surface-600 rounded-xl max-h-90 flex-nowrap overflow-auto"
          >
            {#each searchUsers as usr}
              <li class="m-1 flex justify-center">
                <button
                  class="w-full px-3 py-2 border rounded-2xl flex flex-col"
                  style="grid-row: 1; background-color: #1A4775; color: #ffffff;"
                  on:click={() => handleUserClicked(usr)}
                >
                  <div class="grid grid-cols-1 justify-items-start">
                    <span>{usr.username}</span>
                    {#if showUsrInfo}
                      <span style="grid-row: 2">{mpUserUserinfo.get(usr.pk_userid)}</span>
                    {/if}
                  </div>
                </button>
              </li>
            {/each}
            <li class="m-1">
              <div class="grid grid-cols-2 grid-rows-1">
                <div style="grid-col: 1">
                  {#if pageNumber > 0}
                    <button
                      on:click={() => {
												pageNumber--;
											}}
                      class="border rounded-2xl py-1 px-2"
                      style="background-color: #FFFCF2;"
                    >show less...
                    </button>
                  {/if}
                </div>
                {#if hasNextPage && typedUsername}
                  <div style="grid-col: 2" class="flex justify-end">
                    <button
                      class="border rounded-2xl py-1 px-2"
                      style="background-color: #FFFCF2;"
                      on:click={() => {
												//dropdownIsOpen = true;
												pageNumber++;
												getSearchUsers(pageNumber);
											}}
                    >show more...
                    </button>
                  </div>
                {/if}
              </div>
            </li>
          </ul>
        {/if}
      </div>
    </div>
  </div>

  {#if showUsrInfo}
    <button
      class="btn variant-filled-primary rounded-full absolute left-3 text-white text-center px-5 py-2"
      on:click={() => {
				goto('/location');
			}}
    >
      <MapPin />
    </button>
  {/if}

  <div class="absolute right-1 w-10 text-secondary-900 pointer-events-none">
    <Search />
  </div>
</div>
