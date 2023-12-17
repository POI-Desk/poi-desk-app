<script lang="ts">
  import BarChart from "$components/AnalysisComponents/BarChart.svelte";
  import DataChart from "$components/AnalysisComponents/DataChart.svelte";
  import ComparisonBarChart from "$components/AnalysisComponents/ComparisonBarChart.svelte";
  import DaisplayData from "$components/AnalysisComponents/DaisplayData.svelte";
  import { MonthlyBookings } from '$lib/queries/analysisQueries';
  import { RadioGroup, RadioItem, ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import type { AnalysisResult, AnalysisComparisonInfo } from '$lib/types/analysisResultType';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { user } from '$lib/userStore';
  import { storePopup } from '@skeletonlabs/skeleton';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
			
  
  let analysisResult: AnalysisResult = {
    month: "",
    amountOfDesks: 0,
    highestBookings: 0,
    averageBookings: 0,
    lowestBookings: 0,
    totalBooking: 0,
  }	;

  async function loadData() {
		const result = await MonthlyBookings.fetch(
      { variables: { year: "2023", month: "12", location: $user.location?.pk_locationid || "" } });//user.location
    if (result && chartLabels.length == 0) {
      let monthlyBookingResult = result.data?.getMonthlyBooking;
      monthlyBookingResult?.dailyBookings?.forEach((element: {day: String, totalBookings: Number, morning: Number, afternoon: Number} | null) => {
        if(element?.totalBookings != 0){
          chartLabels.push(element?.day!);
          morningValues.push(element?.morning!);
          afternoonValues.push(element?.afternoon!);
          chartValues.push(element?.totalBookings!);
        }
      });
      /*
      analysisResult = {
        month: monthlyBookingResult?.month!,
        amountOfDesks: monthlyBookingResult?.amountOfDesks!,
        highestBookings: monthlyBookingResult?.highestBookings!,
        averageBookings: monthlyBookingResult?.averageBookings!,
        lowestBookings: monthlyBookingResult?.lowestBookings!,
        totalBooking: monthlyBookingResult?.totalBooking!,
      };*/
    }
	}
	let chartValues: [Number?] = [];
  let morningValues: [Number?] = [];
  let afternoonValues: [Number?] = [];
	let chartLabels: [String?] = [];
  
  let comparison: AnalysisComparisonInfo = {
    firstYear: null,
    firstMonth: null,
    secondYear: null,
    secondMonth: null,
    showType: 'Days',
  }


  const firstSelectYear: PopupSettings = {
    event: 'focus-click',
    target: 'firstSelectYear',
    placement: 'right',
    closeQuery: '.listbox-item'
  };

  const firstSelectMonth: PopupSettings = {
    event: 'focus-click',
    target: 'firstSelectMonth',
    placement: 'right',
    closeQuery: '.listbox-item'
  };

  const secondSelectYear: PopupSettings = {
    event: 'focus-click',
    target: 'secondSelectYear',
    placement: 'right',
    closeQuery: '.listbox-item'
  };

  const secondSelectMonth: PopupSettings = {
    event: 'focus-click',
    target: 'secondSelectMonth',
    placement: 'right',
    closeQuery: '.listbox-item'
  };



  let monthData = {
      labels: chartLabels,
      datasets: [{
        label: 'morning',
        data: morningValues,
        backgroundColor: 'rgb(0, 0, 255)',
        borderWidth: 1
      },
    {
        label: 'afternoon',
        data: afternoonValues,
        backgroundColor: 'rgb(255, 0, 0)',
        borderWidth: 1
      }]
  }

  const years = ['2023'];
  const selectableTimePeriods = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Q1', 'Q2', 'Q3', 'Q4', 'All']

  async function getData(dataNumber: number): Promise<any>{
    if(analysisResult.month === ""){
      await loadData();
    }
    switch(dataNumber){
      case 0:
        console.log(monthData)
        return monthData;
      case 1:
        return {
        month: analysisResult.month,
        amountOfDesks: analysisResult.amountOfDesks,
        totalBooking: analysisResult.totalBooking,
        highestBookings: analysisResult.highestBookings,
        averageBookings: analysisResult.averageBookings,
        lowestBookings: analysisResult.lowestBookings,
      };
    }
  }
  let value = 0;
</script>


<div class="container">
  <div class="Title">
    <div class="flex align-item-center justify-items-cente">
      <p style="font-size: 40px;">Analysis</p>
    </div>
  </div>
  <div class="first-Dia">
    <div class="flex align-item-center justify-items-cente">
      {#await getData(0)}
        <p>loading...</p>
      {:then data}
        <div class="ComparisonBarChart">
          <BarChart data={data} title="Total amount of Seats Booked" />
        </div>

          
      {/await}
    </div>  
  </div>
  <div class="second-Dia">
    <div class="flex align-item-center justify-items-cente">
      {#await getData(1)}
        <p>loading...</p>
      {:then data}
        <DaisplayData data={data}></DaisplayData>
        <!--<BarChart data={data} title="Max Avg Min" />-->
      {/await}
    </div>  
  </div>
  
  <div class="first-sel">
    <div class="flex align-item-center justify-items-cente">
      <div>
        <button class="btn variant-filled w-48 justify-between" use:popup={firstSelectYear}>
          <span class="capitalize">{comparison.firstYear ?? '1.Year'}</span>
          <span>↓</span>
        </button>
        <button class="btn variant-filled w-48 justify-between" use:popup={firstSelectMonth}>
          <span class="capitalize">{comparison.firstMonth ?? '1.TimePeriods'}</span>
          <span>↓</span>
        </button>
      </div>
    </div>
  </div>

  <div class="second-sel">
    <div class="flex align-item-center justify-items-cente">
      <div>
        <button class="btn variant-filled w-48 justify-between" use:popup={secondSelectYear}>
          <span class="capitalize">{comparison.secondYear ?? '2.Year'}</span>
          <span>↓</span>
        </button>
        <button class="btn variant-filled w-48 justify-between" use:popup={secondSelectMonth}>
          <span class="capitalize">{comparison.secondMonth ?? '2.TimePeriods'}</span>
          <span>↓</span>
      </div>
    </div>
  </div>

  <div class="select-type">
    <div class="flex align-item-center justify-items-cente">
      <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
        <RadioItem bind:group={comparison.showType} name="end" value="Days">Bookings of Days</RadioItem>
        <RadioItem bind:group={comparison.showType} name="end" value="Data">Data from Time</RadioItem>
      </RadioGroup>
    </div>
  </div>

  <div class="first-com">
    {#if !comparison.firstMonth || !comparison.firstYear}
      <div class="flex justify-items-center align-middle">
        <p>Select Time</p>
      </div>
    {/if}
    {#key comparison.firstMonth || comparison.firstYear}
      {#if comparison.firstYear !== null && comparison.firstMonth !== null}
        {#if comparison.showType === 'Days'}
          <ComparisonBarChart title="Total amount of Seats Booked Days" year="{comparison.firstYear.toString() ?? ""}" selectedTimePeriod="{comparison.firstMonth.toString() ?? ""}" />
        {:else if comparison.showType === 'Data'}

          <DataChart year="{comparison.firstYear.toString() ?? ""}" selectedTimePeriod="{comparison.firstMonth.toString() ?? ""}" />
        {/if}
      {/if}
    {/key}
  </div>

  <div class="second-com">
    {#if !comparison.secondMonth || !comparison.secondYear}
      <div class="flex justify-items-center align-middle">
        <p>Select Time</p>
      </div>
    {/if}
    {#key comparison.secondMonth || comparison.secondYear}
      {#if comparison.secondYear !== null && comparison.secondMonth !== null}
        {#if comparison.showType === 'Days'}
          <ComparisonBarChart title="Total amount of Seats Booked Days" year="{comparison.secondYear.toString() ?? ""}" selectedTimePeriod="{comparison.secondMonth.toString() ?? ""}" />
        {:else if comparison.showType === 'Data'}
          <ComparisonBarChart title="Total amount of Seats Booked Data" year="{comparison.secondYear.toString() ?? ""}" selectedTimePeriod="{comparison.secondMonth.toString() ?? ""}" />
        {/if}
      {/if}
    {/key}
  </div>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="firstSelectYear">
  <ListBox rounded="rounded-none">
    {#each years as year}
      <ListBoxItem bind:group={comparison.firstYear} name="medium" value="{year}">{year}</ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl py-2" data-popup="firstSelectMonth">
  <ListBox rounded="rounded-none">
    {#each selectableTimePeriods as month}
      <ListBoxItem bind:group={comparison.firstMonth} name="medium" value="{month}">{month}</ListBoxItem>
    {/each}
</ListBox>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="secondSelectYear">
  <ListBox rounded="rounded-none">
    {#each years as year}
      <ListBoxItem bind:group={comparison.secondYear} name="medium" value="{year}">{year}</ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl py-2" data-popup="secondSelectMonth" >
  <ListBox rounded="rounded-none">
    {#each selectableTimePeriods as month}
      <ListBoxItem bind:group={comparison.secondMonth} name="medium" value="{month}">{month}</ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<style>
.container {  
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 5fr 1fr 1fr 5fr;
  row-gap: 10px;
  gap: 1px 10px;
  grid-auto-flow: row;
  grid-template-areas:
    "Title Title"
    "first-Dia second-Dia"
    "first-sel second-sel"
    "select-type select-type"
    "first-com second-com";
  
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5px;
  width: 100vw;
  height: 100vh;
}

.Title { grid-area: Title; background-color: #f1f1f1; height: 50px; display: flex; justify-content: center; align-items: center; }

.first-Dia { grid-area: first-Dia; background-color: #f1f1f1;}

.second-Dia { grid-area: second-Dia; background-color: #f1f1f1; width: 100%; }

.first-sel { grid-area: first-sel; background-color: #f1f1f1; width: 100%; display: flex; justify-content: center; align-items: center; }

.second-sel { grid-area: second-sel; background-color: #f1f1f1; width: 100%;  display: flex; justify-content: center; align-items: center; }

.select-type{ grid-area: select-type; background-color: #f1f1f1; width: 100%; display: flex; justify-content: center; align-items: center; }

.first-com { grid-area: first-com; background-color: #f1f1f1; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;}

.second-com { grid-area: second-com; background-color: #f1f1f1; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }

.ComparisonBarChart{
  width: 100%;
  height: 100%;
}

</style>