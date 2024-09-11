<script setup>

</script>
<template>

    <div class="m-4" v-for="a in [,,,,]">
        <div class="flex flex-row  items-center">
            <div>
                <img src="/public/noimage.png" class="mx-2 w-10 h-10" alt="">

            </div>
            <p class="mx-2">Name</p>
        </div>
        <div class="my-3">
            <p>Descipcion</p>
            <div> <img src="/public/no-image.jpg" class="mx-auto mt-3 w-[30rem]"
                ></div>
        </div>
        <div class="flex justify-between my-3">
            <p>Like</p>
            <p>Compartir</p>
            <p>Comentar</p>
        </div>
    </div>
</template>