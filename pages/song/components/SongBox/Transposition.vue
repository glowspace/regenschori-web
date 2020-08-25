<template>
    <div>
        <div>Transpozice</div>
        <div class="btn-group m-0" role="group">
            <a class="btn btn-secondary" v-on:click="transpose(-1)">-</a>
            <a
                class="btn btn-secondary bg-light transpose-window"
                v-on:click="reset()"
                >{{ value }}</a
            >
            <a class="btn btn-secondary" v-on:click="transpose(1)">+</a>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],

    methods: {
        transpose: function(val) {
            this.value = (this.value + val) % 12;
            this.$emit('input', this.value);
        },

        reset() {
            this.value = 0;
            this.$emit('input', this.value);
        }
    }
};
</script>
