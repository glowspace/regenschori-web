<template>
    <div>
        <div>Velikost písma</div>
        <div class="btn-group m-0" role="group">
            <a
                class="btn btn-secondary"
                @click="setFontSizePercent(value - 10)"
                >-</a
            >
            <a
                class="btn btn-secondary bg-light transpose-window"
                @click="setFontSizePercent(100)"
                >{{ (value - 100) / 10 }}</a
            >
            <a
                class="btn btn-secondary"
                @click="setFontSizePercent(value + 10)"
                >+</a
            >
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],

    data() {
        return {
            sl_refresh_handler: null
        };
    },

    methods: {
        setFontSizePercent: function(val) {
            let sl = process.client ? document.getElementById('song-lyrics') : null;

            if (!sl.style.height) {
                sl.style.height = sl.clientHeight + 'px';
            }

            if (this.sl_refresh_handler) {
                clearTimeout(this.sl_refresh_handler);
            }

            this.sl_refresh_handler = setTimeout(() => {
                sl.style.height = null;
            }, 1000);

            if (val > 70) {
                this.$emit('input', val);
            }
        }
    }
};
</script>
