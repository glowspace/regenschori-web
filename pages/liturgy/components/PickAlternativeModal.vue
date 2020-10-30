<template>
    <b-modal :id="id"
             title="Zvolte píseň">
        <p class="my-4">Hello from modal!</p>
    </b-modal>
</template>

<script>
export default {
    name: "PickAlternativeModal",

    props: [
        'id',
        'show',
    ]
}
</script>

<style scoped>

</style>
