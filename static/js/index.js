$(document).ready(function () {
    var $sections = $('body > article'),
        $menu     = $('body > nav'),
        $menuList = $menu.children('ul'),
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
        temporaryConfig,
        $temporaryContainer
    ;

    animationControl.activate();
    parallaxer.activate();

    for (namespace in enabledSectionMap) {
        TemporarySectionClass = enabledSectionMap[namespace];
        $temporaryContainer   = $sections.filter('[data-key="' + namespace + '"]');

        temporaryConfig = {
            namespace:        namespace,
            container:        $temporaryContainer,
            animationControl: animationControl,
            dueTimestamp:     new Date('2014/12/29 7:00 GMT+0700')
        };

        activeSectionMap[namespace] = new TemporarySectionClass(temporaryConfig);
    }

    $sections.each(function (i) {
        var $section = $(this);
        $menuList.append('<li><a href="#' + $section.attr('data-key') + '">' + $section.attr('data-title') + '</a></li>');
    });

    $menu.on('click', '.menu-activator', function (event) {
        $menu.addClass('active');
    });

    $menu.on('click', '.menu-deactivator', function (event) {
        $menu.removeClass('active');
    });

    $menu.on('click', 'ul a', function (event) {
        $menu.removeClass('active');
    });
});