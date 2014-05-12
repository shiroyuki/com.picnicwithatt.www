var AnimationControl = function (config) {
    this.config = {
        frameRate:  24, // frame per second
        delay:      6   // number of frames
    };

    $.extend(this.config, config);

    this.config.cycleRate = 1000 / 24;
    this.keyMap           = {};

    console.log(this.config.cycleRate);
};

$.extend(AnimationControl.prototype, {
    activate: function () {
        setInterval($.proxy(this.watch, this), this.config.cycleRate);
    },
    register: function (key, callback) {
        this.keyMap[key] = {
            callback: callback,
            counter:  0
        };
    },
    trigger: function (key) {
        if (this.keyMap[key].counter === 0) {
            this.keyMap[key].counter += this.delay;

            return;
        }

        this.keyMap[key].counter++;
    },
    watch: function () {
        var self = this;

        $.each(this.keyMap, function (key, meta) {
            var readyForAction = meta.counter === 1;

            if (meta.counter > 0) {
                meta.counter--;
            }

            if (!readyForAction) {
                return;
            }

            meta.callback();
        });
    }
});

var Parallaxer = function ($selector, animationControl) {
    this.$window         = $(window);
    this.$container      = $('body');
    this.$sections       = $selector;
    this.numberOfSectors = $selector.length;
    this.animationControl = animationControl;
    this.totalScrollingDistance = 0;
    this.keyToIndexMap   = {};

    this.animationControl.register('adjust-container', $.proxy(this.onResize, this));
    this.animationControl.register('update-section-visibility', $.proxy(this.onScroll, this));
};

$.extend(Parallaxer.prototype, {
    scrollingLengthPerSection: 200,

    onResize: function () {
        this.animationControl.trigger('adjustContainer');
    },

    onScroll: function () {
        this.animationControl.trigger('update-section-visibility');
    },

    activate: function () {
        var i = this.numberOfSectors
            self = this
        ;

        this.$sections.each(function (index) {
            var $section = $(this);

            self.keyToIndexMap[$section.attr('data-key')] = index;

            $section.addClass('parallaxer section');
            $section.css('z-index', i--);

            if (index > 0) {
                self.setSectionPosition($section, 'bottom');
            }

            $section.addClass('enabled');
        });

        this.$window.on('resize', $.proxy(this.adjustContainer, this));
        this.$window.on('scroll', $.proxy(this.manageSectionVisibility, this));
        this.$window.on('touchmove', $.proxy(this.manageSectionVisibility, this));

        this.adjustContainer();
        this.manageSectionVisibility();
    },

    getTotalScrollingDistance: function () {
        if (!this.totalScrollingDistance) {
            this.totalScrollingDistance = this.numberOfSectors * this.scrollingLengthPerSection;
        }

        return this.totalScrollingDistance;
    },

    getCurrentScrollingPosition: function () {
        return document.documentElement.scrollTop || document.body.scrollTop;
    },

    setSectionPosition: function ($section, position) {
        var positionToCSSMap = {
            current: {
                //'opacity':  1,
                'top':      0,
                'bottom':   0
            },
            top: {
                //'opacity':  0.5,
                'top':      '-100%',
                'bottom':   '100%'
            },
            bottom: {
                //'opacity':  0.5,
                'top':      '100%',
                'bottom':   '-100%'
            }
        }

        $section.css(positionToCSSMap[position]);
    },

    manageSectionVisibility: function (event) {
        var currentPosition = this.getCurrentScrollingPosition(),
            sectionIndex    = Math.floor(currentPosition / this.scrollingLengthPerSection),
            $currentSection,
            $prevSection,
            $nextSection
        ;

        if (sectionIndex < 0) {
            sectionIndex = 0;
        }

        if (sectionIndex >= this.numberOfSectors) {
            sectionIndex = this.numberOfSectors - 1;
        }

        $currentSection = this.$sections.eq(sectionIndex);
        this.setSectionPosition($currentSection, 'current');

        window.location.hash = $currentSection.attr('data-key');

        if ($currentSection.prev()) {
            $prevSection = $currentSection.prev();
            this.setSectionPosition($prevSection, 'top');
        }

        if ($currentSection.next()) {
            $nextSection = $currentSection.next();
            this.setSectionPosition($nextSection, 'bottom');
        }
    },

    adjustContainer: function (event) {
        var totalScrollingDistance = this.getTotalScrollingDistance(),
            windowOuterHeight      = this.$window.outerHeight()
        ;

        this.$container.height(windowOuterHeight + totalScrollingDistance);
    }
});

$(document).ready(function () {
    var animationControl = new AnimationControl(),
        parallaxer = new Parallaxer($('body > article'), animationControl);

    animationControl.activate();
    parallaxer.activate();
});