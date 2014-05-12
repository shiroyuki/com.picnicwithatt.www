/**
 * Parallaxer
 *
 * This class is to enable the parallax effect.
 *
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @copyright Juti Noppornpitak
 * @license Common MIT License
 */
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
                'top':      0,
                'bottom':   0
            },
            top: {
                'top':      '-100%',
                'bottom':   '100%'
            },
            bottom: {
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