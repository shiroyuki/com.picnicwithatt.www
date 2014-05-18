/**
 * Parallaxer
 *
 * This class is to enable the parallax effect.
 *
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @copyright Juti Noppornpitak
 * @license Common MIT License
 */
var Parallaxer = function ($selector, config) {
    this.config          = config || {}
    this.$window         = $(window);
    this.$container      = $('body');
    this.$sections       = $selector;
    this.$bookmark       = null;
    this.numberOfSectors = $selector.length;
    this.animationControl = this.config.animationControl;
    this.totalScrollingDistance = 0;
    this.keyToIndexMap   = {};

    if (this.config.animationControl) {
        this.animationControl.register('adjust-container', $.proxy(this.adjustContainer, this));
        this.animationControl.register('update-section-visibility', $.proxy(this.manageSectionVisibility, this));
    }
};

$.extend(Parallaxer.prototype, {
    scrollingLengthPerSection: 100,

    onResize: function () {
        if (this.config.animationControl) {
            this.animationControl.trigger('adjust-container');

            return;
        }

        this.adjustContainer();
    },

    onScroll: function () {
        if (this.config.animationControl) {
            this.animationControl.trigger('update-section-visibility');

            return;
        }

        this.manageSectionVisibility();
    },

    activate: function () {
        var i = this.numberOfSectors
            self = this
        ;

        this.$sections.each(function (index) {
            var $section = $(this);

            self.keyToIndexMap[$section.attr('data-key')] = index;

            $section.addClass('section');
            $section.css('z-index', i--);

            if (index > 0) {
                self.setSectionPosition($section, 'bottom');
            }

            $section.addClass('enabled');
        });

        this.$window.on('resize', $.proxy(this.onResize, this));
        this.$window.on('scroll', $.proxy(this.onScroll, this));
        this.$window.on('touchmove', $.proxy(this.onScroll, this));

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
                //'opacity':  0,
                'top':      '-100%',
                'bottom':   '100%'
            },
            bottom: {
                //'opacity':  0,
                'top':      '100%',
                'bottom':   '-100%'
            }
        }

        $section.css(positionToCSSMap[position]);
    },

    manageSectionVisibility: function (event) {
        var self = this,
            currentPosition = this.getCurrentScrollingPosition(),
            sectionIndex    = Math.floor(currentPosition / this.scrollingLengthPerSection),
            $currentSection,
            $prevSection,
            $nextSection
        ;

        console.log('Parallaxer.manageSectionVisibility');

        if (sectionIndex < 0) {
            sectionIndex = 0;
        }

        if (sectionIndex >= this.numberOfSectors) {
            sectionIndex = this.numberOfSectors - 1;
        }

        this.$sections.each(function (index) {
            var position = null,
                $section = $(this);

            switch (true) {
            case index < sectionIndex:
                position = 'top';
                break;
            case index > sectionIndex:
                position = 'bottom';
                break;
            default:
                window.location.hash = $section.attr('data-key');
                position = 'current';
            }

            self.setSectionPosition($(this), position);
        });
    },

    adjustContainer: function (event) {
        var totalScrollingDistance = this.getTotalScrollingDistance(),
            windowOuterHeight      = this.$window.outerHeight()
        ;

        this.$container.height(windowOuterHeight + totalScrollingDistance);
    }
});