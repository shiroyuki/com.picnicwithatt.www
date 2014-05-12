$(document).ready(function () {
    var animationControl = new AnimationControl(),
        parallaxer = new Parallaxer($('body > article'), animationControl);

    animationControl.activate();
    parallaxer.activate();
});