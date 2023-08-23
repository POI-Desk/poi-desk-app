<script lang="ts">
    import { createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("close");
    }
    let isModalOpen: boolean = false;
    export let chosenLocation:string = "none";
    let setAsDefault: boolean = false;
</script>

<!-- The button to open modal -->
<!-- 🔵 set true on click -->


<!-- Put this part before </body> tag -->
<!-- 🔵 conditional `modal-open` class if true -->
<div class="modal" class:modal-open={true}>
    <div class="modal-box">
        <h1 class="text-2xl"> Do you want to set {chosenLocation} as your default</h1>
        <div class="">
            <button class="btn btn-success px-14"> <a href="." on:click={()=>{setAsDefault=true}}>Yes</a></button>
            <button class="btn btn-error px-14"><a href="." on:click={()=>{setAsDefault=false}}>No</a></button>
        </div>
    </div>
</div>


<style>

</style>
