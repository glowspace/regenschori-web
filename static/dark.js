// a fix of flash of white background when dark mode is on

var dom_observer = new MutationObserver(function(mutation) {
    // this runs (multiple times but most importantly), before the body is rendered
    if (window.localStorage) {
        if (window.matchMedia('(prefers-color-scheme: dark)') && localStorage.getItem('dark') === undefined) {
            localStorage.setItem('dark', true);
        }

        if (localStorage.getItem('dark') === 'true') {
            document.getElementsByTagName('body')[0].setAttribute('data-dark', 'dark');
        }
    }
});
var container = document.documentElement || document.body;
var config = { attributes: true, childList: true, characterData: true };
dom_observer.observe(container, config);
