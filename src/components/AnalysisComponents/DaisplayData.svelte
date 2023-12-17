<script lang="ts">
	import type { AnalysisResult } from "$lib/types/analysisResultType";

  export let data: AnalysisResult;
</script>

<ol class="" style="height: full;">
  <li>time: {data.month}</li>
  <li>amountOfDesks: {data.amountOfDesks}</li>
  <li>totalBooking: {data.totalBooking}</li>
  <li>highestBookings: {data.highestBookings}</li>
  <li>averageBookings: {data.averageBookings}</li>
  <li>lowestBookings: {data.lowestBookings}</li>
</ol>

<style>
  ol{
    height: full;
  }
  li{
    padding: 10px;
  }
</style>