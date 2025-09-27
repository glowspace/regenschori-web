<template>
    <a
        tabindex="0"
        @click="darkModeToggle"
        class="btn btn-secondary dark-mode-button animate-fadein"
        ><i class="fas fa-moon"></i>
        <slot></slot>
    </a>
</template>

<script>
/**
 * Dark mode button.
 */
export default {
    name: 'dark-mode-button',

    methods: {
        darkModeToggle: function() {
            if (process.client && window.localStorage) {
                if (localStorage.getItem('dark') === 'true') {
                    localStorage.setItem('dark', false);
                    document.getElementsByTagName('body')[0].removeAttribute('data-dark');
                } else {
                    localStorage.setItem('dark', true);
                    document.getElementsByTagName('body')[0].setAttribute('data-dark', 'dark');
                }
            }
        },
        darkModeInit: function() {
            if (process.client && window.localStorage) {
                if (localStorage.getItem('dark') === 'true') {
                    document.getElementsByTagName('body')[0].setAttribute('data-dark', 'dark');
                } else {
                    document.getElementsByTagName('body')[0].removeAttribute('data-dark');
                }
            }
        }
    },

    created() {
        this.darkModeInit();
    }
};
</script>
