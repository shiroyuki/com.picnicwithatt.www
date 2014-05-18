$(document).ready(function () {
    var animationControl = new AnimationControl({
            debug: false
        }),
        parallaxer = new Parallaxer($('body > article'), animationControl);

    animationControl.activate();
    parallaxer.activate();
});