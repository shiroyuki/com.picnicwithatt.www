$(document).ready(function () {
    var $sections = $('body > article'),
        animationControl = new AnimationControl({
            debug: false,
            delay: 20,
        }),
        parallaxer = new Parallaxer(
            $sections,
            {
                animationControl: animationControl,
                showNext: false,
                showPrev: false
            }
        ),
        activeSectionMap = {},
        enabledSectionMap = {
            'home': HomeSection
        },
        TemporarySectionClass,
        temporaryConfig
    ;

    animationControl.activate();
    parallaxer.activate();

    for (namespace in enabledSectionMap) {
        TemporarySectionClass = enabledSectionMap[namespace];

        temporaryConfig = {
            namespace:        namespace,
            container:        $sections.filter('[data-key="' + namespace + '"]'),
            animationControl: animationControl,
            dueTimestamp:     new Date('2014-12-29 7:00 GMT+0700')
        };

        activeSectionMap[namespace] = new TemporarySectionClass(temporaryConfig);
    }
});