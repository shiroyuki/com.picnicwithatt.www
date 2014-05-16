$(document).ready(function () {
    var animationControl = new AnimationControl({
            delay: 24,
            debug: true
        }),
        parallaxer = new Parallaxer($('body > article'), animationControl);

    animationControl.activate();
    parallaxer.activate();
});