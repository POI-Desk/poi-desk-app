<script lang="ts">
    import { onMount } from 'svelte';
    import type { AnalysisData } from '$lib/types/analysisResultType';
    import { user } from '$lib/userStore.js';
    import { MonthlyBookingDataByLocation, MonthlyBookingDataByBuilding, MonthlyBookingDataByFloor, QuarterlyBookingDataByLocation, QuarterlyBookingDataByBuilding, QuarterlyBookingDataByFloor, YearlyBookingDataByLocation, YearlyBookingDataByBuilding, YearlyBookingDataByFloor } from '$lib/queries/analysisQueries';
    import type { Building } from '$lib/types/buildingType';    
    import type {Floor} from '$lib/types/floorType'
    export let year: string;
    export let selectedTimePeriod: string;
    export let building: Building | null;
    export let floor :Floor | null;

    interface MonthDictionary {
        [key: string]: number;
    }

    const monthDictionary: MonthDictionary = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
        Q1: 13,
        Q2: 14,
        Q3: 15,
        Q4: 16,
        All: 17,
    };
    let analysisData2: AnalysisData = {
        time: "december",
        totalBookings: 2314,
        days: 21,
        amountOfDesks: 435,
        morning_highestBooking: {
          days: "2023-12-02",
          morning: 341,
          afternoon: 324,
        },
        morningAverageBooking: 187.5,
        morning_lowestBooking: {
          days: "2023-12-14",
          morning: 23,
          afternoon: 124,
        },
        afternoon_highestBooking: {
          days: "2023-12-23",
          morning: 123,
          afternoon: 421,
        },
        afternoonAverageBooking: 210.5,
        afternoon_lowestBooking: {
          days: "2023-12-06",
          morning: 151,
          afternoon: 94,
        },
    };
    let analysisData: AnalysisData;
    async function loadData() {
        switch (true) {
            case  monthDictionary[selectedTimePeriod] <= 12:
            {
              let result;
              let monthlyBookingResult;
              if(!building && !floor){
                  result = await MonthlyBookingDataByLocation.fetch(
                      { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), location: $user.location?.pk_locationid || ""} });
                  monthlyBookingResult = result.data?.getMonthlyBookingByLocation;
              }
              else if(building && !floor){
                  result = await MonthlyBookingDataByBuilding.fetch(
                      { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), building: building.buildingid} });
                  monthlyBookingResult = result.data?.getMonthlyBookingByBuilding;
              }
              else if(building && floor){
                  result = await MonthlyBookingDataByFloor.fetch(
                      { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), floor: floor.floorid} });
                  monthlyBookingResult = result.data?.getMonthlyBookingByFloor;
              }
                if (result) {
                    analysisData = {
                        //time: "",
                        time: monthlyBookingResult?.month!,
                        totalBookings: monthlyBookingResult?.totalBookings!,
                        days: monthlyBookingResult?.days!,
                        amountOfDesks: monthlyBookingResult?.amountOfDesks!,
                        morning_highestBooking: {
                          days: monthlyBookingResult?.morning_highestBooking?.day!,
                          morning: monthlyBookingResult?.morning_highestBooking?.morning!,
                          afternoon: monthlyBookingResult?.morning_highestBooking?.afternoon!,
                        },
                        morningAverageBooking: monthlyBookingResult?.morningAverageBooking!,
                        morning_lowestBooking: {
                          days: monthlyBookingResult?.morning_lowestBooking?.day!,
                          morning: monthlyBookingResult?.morning_lowestBooking?.morning!,
                          afternoon: monthlyBookingResult?.morning_lowestBooking?.afternoon!,
                        },
                        afternoon_highestBooking: {
                          days: monthlyBookingResult?.afternoon_highestBooking?.day!,
                          morning: monthlyBookingResult?.afternoon_highestBooking?.morning!,
                          afternoon: monthlyBookingResult?.afternoon_highestBooking?.afternoon!,
                        },
                        afternoonAverageBooking: monthlyBookingResult?.afternoonAverageBooking!,
                        afternoon_lowestBooking: {
                          days: monthlyBookingResult?.afternoon_lowestBooking?.day!,
                          morning: monthlyBookingResult?.afternoon_lowestBooking?.morning!,
                          afternoon: monthlyBookingResult?.afternoon_lowestBooking?.afternoon!,
                        },
                      }   
                }
                break;
            }
            case monthDictionary[selectedTimePeriod] >= 13 && monthDictionary[selectedTimePeriod] <= 16:
            {
                const result = await QuarterlyBookingDataByLocation.fetch(
                    { variables: { year: year, quarter: monthDictionary[selectedTimePeriod]-12, location: $user.location?.pk_locationid || "" } });
                if (result) {
                    let quarterlyBookingResult = result.data?.getQuarterlyBookingByLocation;
                      analysisData = {
                        time: quarterlyBookingResult?.year! + "-Q" + quarterlyBookingResult?.quarter!.toString,
                        totalBookings: quarterlyBookingResult?.totalBookings!,
                        days: quarterlyBookingResult?.days!,
                        amountOfDesks: quarterlyBookingResult?.amountOfDesks!,
                        morning_highestBooking: {
                          days: quarterlyBookingResult?.morning_highestBooking?.day!,
                          morning: quarterlyBookingResult?.morning_highestBooking?.morning!,
                          afternoon: quarterlyBookingResult?.morning_highestBooking?.afternoon!,
                        },
                        morningAverageBooking: quarterlyBookingResult?.morningAverageBooking!,
                        morning_lowestBooking: {
                          days: quarterlyBookingResult?.morning_lowestBooking?.day!,
                          morning: quarterlyBookingResult?.morning_lowestBooking?.morning!,
                          afternoon: quarterlyBookingResult?.morning_lowestBooking?.afternoon!,
                        },
                        afternoon_highestBooking: {
                          days: quarterlyBookingResult?.afternoon_highestBooking?.day!,
                          morning: quarterlyBookingResult?.afternoon_highestBooking?.morning!,
                          afternoon: quarterlyBookingResult?.afternoon_highestBooking?.afternoon!,
                        },
                        afternoonAverageBooking: quarterlyBookingResult?.afternoonAverageBooking!,
                        afternoon_lowestBooking: {
                          days: quarterlyBookingResult?.afternoon_lowestBooking?.day!,
                          morning: quarterlyBookingResult?.afternoon_lowestBooking?.morning!,
                          afternoon: quarterlyBookingResult?.afternoon_lowestBooking?.afternoon!,
                        },
                      }                        
              };
              break;
            }
            case monthDictionary[selectedTimePeriod] === 17:
            {
                const result = await YearlyBookingDataByLocation.fetch(
                    { variables: { year: year, location: $user.location?.pk_locationid || "" } });
                if (result) {
                    let yearlyBookingResult = result.data?.getYearlyBookingByLocation;
                    analysisData = {
                        //time: "",
                        time: yearlyBookingResult?.year!,
                        totalBookings: yearlyBookingResult?.totalBookings!,
                        days: yearlyBookingResult?.days!,
                        amountOfDesks: yearlyBookingResult?.amountOfDesks!,
                        morning_highestBooking: {
                          days: yearlyBookingResult?.morning_highestBooking?.day!,
                          morning: yearlyBookingResult?.morning_highestBooking?.morning!,
                          afternoon: yearlyBookingResult?.morning_highestBooking?.afternoon!,
                        },
                        morningAverageBooking: yearlyBookingResult?.morningAverageBooking!,
                        morning_lowestBooking: {
                          days: yearlyBookingResult?.morning_lowestBooking?.day!,
                          morning: yearlyBookingResult?.morning_lowestBooking?.morning!,
                          afternoon: yearlyBookingResult?.morning_lowestBooking?.afternoon!,
                        },
                        afternoon_highestBooking: {
                          days: yearlyBookingResult?.afternoon_highestBooking?.day!,
                          morning: yearlyBookingResult?.afternoon_highestBooking?.morning!,
                          afternoon: yearlyBookingResult?.afternoon_highestBooking?.afternoon!,
                        },
                        afternoonAverageBooking: yearlyBookingResult?.afternoonAverageBooking!,
                        afternoon_lowestBooking: {
                          days: yearlyBookingResult?.afternoon_lowestBooking?.day!,
                          morning: yearlyBookingResult?.afternoon_lowestBooking?.morning!,
                          afternoon: yearlyBookingResult?.afternoon_lowestBooking?.afternoon!,
                        },
                      }   
                };
                break;
            }
            default:
                return "Invalid section";
            }
        
    }
    /*onMount(async () => {
        if( year === "" || selectedTimePeriod === "")
            return;
        await loadData();
    })*/
</script>


{#await loadData()}
  <p>loading...</p>
{:then d}
  <ol>
    <li>Time: {analysisData.time}</li>
    <li>TotalBookings: {analysisData.totalBookings}</li>
    <li>days: {analysisData.days}</li>
    <li>Desks: {analysisData.amountOfDesks}</li>
    <li>Morning highestBooking:  {analysisData.morning_highestBooking.days}: {analysisData.morning_highestBooking.morning}</li>
    <li>Morning Average: {analysisData.morningAverageBooking}</li>
    <li>Morning lowestBooking: {analysisData.morning_lowestBooking.days}: {analysisData.morning_lowestBooking.morning}</li>
    <li>Afternoon highestBooking: {analysisData.afternoon_highestBooking.days}: {analysisData.afternoon_highestBooking.afternoon}</li>
    <li>Afternoon Average: {analysisData.afternoonAverageBooking}</li>
    <li>Afternoon lowestBooking: {analysisData.afternoon_lowestBooking.days}: {analysisData.afternoon_lowestBooking.afternoon}</li>
    </ol>
{/await}
