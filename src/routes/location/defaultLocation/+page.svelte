<script>
    //api call to get selected location
    let location = 'Wien';
    let setAsDefault = false;
</script>

<div class="grid place-items-center place-content-center space-y-5 h-screen">
    <h1 class="text-2xl"> Do you want to set {location} as your default</h1>
    <div class="">
        <button class="btn btn-success px-14"> <a href="." on:click={()=>{setAsDefault=true}}>Yes</a></button>
        <button class="btn btn-error px-14"><a href="." on:click={()=>{setAsDefault=false}}>No</a></button>
    </div>
</div>
