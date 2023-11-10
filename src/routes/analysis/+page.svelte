<script lang="ts">
  import BarChart from "$components/AnalysisComponents/BarChart.svelte";
  import ComparisonBarChart from "$components/AnalysisComponents/ComparisonBarChart.svelte";
  import { MonthlyBookings } from '$lib/queries/analysisQueries';
  import { RadioGroup, RadioItem, ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import type { AnalysisResult, AnalysisComparisonInfo } from '$lib/types/analysisResultType';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

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
      { variables: { year: "2023", month: "11", location:"b1a7f298-e727-457c-9a89-11bc50f76c81" } });//user.location
    if (result && chartLabels.length == 0) {
      let monthlyBookingResult = result.data?.getMonthlyBooking;
      monthlyBookingResult?.dailyBookings?.forEach((element: {pk_day: String, totalBooking: Number} | null) => {
        if(element?.totalBooking != 0){
          chartValues.push(element?.totalBooking!);
          chartLabels.push(element?.pk_day!);
        }
      });
      analysisResult = {
        month: monthlyBookingResult?.month!,
        amountOfDesks: 200,//monthlyBookingResult?.amountOfDesks!,
        highestBookings: monthlyBookingResult?.highestBookings!,
        averageBookings: monthlyBookingResult?.averageBookings!,
        lowestBookings: monthlyBookingResult?.lowestBookings!,
        totalBooking: monthlyBookingResult?.totalBooking!,
      };
    }
	}
	let chartValues: [Number?] = [];
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
        label: 'Amount of Seats',
        data: chartValues,
        backgroundColor: 'rgb(0, 0, 255)',
        borderWidth: 1
      }]
  }

  const years = ['2023', '2024'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  async function getData(dataNumber: number){
    if(analysisResult.month === ""){
      await loadData();
    }
    switch(dataNumber){
      case 0:
        return monthData;
      case 1:
        return {
        labels: ['October', 'November'], //analysisResult.month
        datasets: [
        {
          label: 'Min',
          data: [45, analysisResult.lowestBookings],
          backgroundColor: 'rgb(26,71,117)',
        },
              {
          label: 'Avg',
          data: [120, analysisResult.averageBookings],
          backgroundColor: 'rgb(139,128,249)',
        },
        {
          label: 'Max',
          data: [190, analysisResult.highestBookings],
          backgroundColor: 'rgb(223,59,88)',
        },
        {
          label: 'Amount of Seats',
          data: [analysisResult.amountOfDesks, 210],
          backgroundColor: 'rgb(235,94,40)',
        },]
      };
    }
  }

  let value = 0;
</script>

<div>
  <h1  class="text-center">Analysis</h1>
  <div class="grid-container">
    <div class="grid-item" style="grid-column: 1 / span 2;">
      {#await getData(0)}
        <p>loading...</p>
      {:then data} 
        <BarChart data={data} title="Total amount of Seats Booked" />
      {/await}
    </div>
    <div class="grid-item" style="grid-column: 3 / span 2;">
      {#await getData(1)}
        <p>loading...</p>
      {:then data} 
        <BarChart data={data} title="Max Avg Min" />
      {/await}
    </div>
    <div class="grid-item" style="grid-column: 1 / span 4" >
      <div>
        <p>First Datapoint: </p>
        <button class="btn variant-filled w-48 justify-between" use:popup={firstSelectYear}>
          <span class="capitalize">{comparison.firstYear ?? 'Year'}</span>
          <span>↓</span>
        </button>
        <button class="btn variant-filled w-48 justify-between" use:popup={firstSelectMonth}>
          <span class="capitalize">{comparison.firstMonth ?? 'Month'}</span>
          <span>↓</span>
        </button>
      </div>
      <div>
        <p>Second Datapoint: </p>
        <button class="btn variant-filled w-48 justify-between" use:popup={secondSelectYear}>
          <span class="capitalize">{comparison.secondYear ?? 'Year'}</span>
          <span>↓</span>
        </button>
        <button class="btn variant-filled w-48 justify-between" use:popup={secondSelectMonth}>
          <span class="capitalize">{comparison.secondMonth ?? 'Month'}</span>
          <span>↓</span>
      </div>
      
      <!--<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
        <RadioItem bind:group={comparison.showType} name="end" value="Days">Bookings of Days</RadioItem>
        <RadioItem bind:group={comparison.showType} name="end" value="Data">Data from Time</RadioItem>
      </RadioGroup>-->

    </div>
    <div class="grid-item" style="grid-column: 1 / span 2;">
      {#key comparison.firstMonth || comparison.firstYear}
        {#if comparison.firstYear !== null && comparison.firstMonth !== null}
          <ComparisonBarChart title="Total amount of Seats Booked" year="{comparison.firstYear.toString() ?? ""}" month="{comparison.firstMonth.toString() ?? ""}" />
        {/if}
      {/key}
    </div>
    <div class="grid-item" style="grid-column: 3 / span 2;">
      {#key comparison.secondMonth || comparison.secondYear}
        {#if comparison.secondYear !== null && comparison.secondMonth !== null}
          <ComparisonBarChart title="Total amount of Seats Booked" year="{comparison.secondYear.toString() ?? ""}" month="{comparison.secondMonth.toString() ?? ""}" />
        {/if}
      {/key}

    </div>
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
    {#each months as month}
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
    {#each months as month}
      <ListBoxItem bind:group={comparison.secondMonth} name="medium" value="{month}">{month}</ListBoxItem>
    {/each}
</ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>
<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 20px;
}

.grid-item {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  
}
</style>