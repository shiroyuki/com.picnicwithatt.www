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
    this.config = {
        showPrev: true,
        showNext: true,
        showNaviAid: true
    };

    $.extend(this.config, config || {});

    this.$window         = $(window);
    this.$container      = $('body');
    this.$sections       = $selector;
    this.$bookmark       = null;
    this.$naviAid        = null;
    this.$currentSection = null;
    this.numberOfSectors = $selector.length;
    this.animationControl = this.config.animationControl;
    this.totalScrollingDistance = 0;
    this.keyToIndexMap   = {};

    if (this.animationControl) {
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
        this.updateNaviAid();
        this.showNaviAid();

        if (this.config.animationControl) {
            this.animationControl.trigger('update-section-visibility');

            return;
        }

        this.manageSectionVisibility();
    },

    onGoToNavigate: function (event) {
        var key = String($(event.currentTarget).attr('href')).substring(1);

        event.preventDefault();

        this.navigateByKey(key);
    },

    activate: function () {
        var i = this.numberOfSectors
            self = this
        ;

        if (this.config.showNaviAid) {
            this.$container.append('<div class="navi-aid"></div>');

            this.$naviAid = this.$container.find('.navi-aid');
        }

        this.$sections.each(function (index) {
            var $section = $(this);

            self.keyToIndexMap[$section.attr('data-key')] = index;

            $section.addClass('section');

            if (index > 0) {
                self.setSectionPosition($section, 'bottom');
            }

            if (self.config.showPrev && index > 0) {
                $section.append('<a class="go-to prev" href="#' + $section.prev().attr('data-key') + '">' + $section.prev().attr('data-title') + '</a>');
            }

            if (self.config.showNext && index < self.numberOfSectors - 1) {
                $section.append('<a class="go-to next" href="#' + $section.next().attr('data-key') + '">' + $section.next().attr('data-title') + '</a>');
            }

            $section.addClass('enabled');
        });

        this.$window.on('resize', $.proxy(this.onResize, this));
        this.$window.on('scroll', $.proxy(this.onScroll, this));
        this.$window.on('touchmove', $.proxy(this.onScroll, this));
        this.$window.on('hashchange', $.proxy(this.onHashNavigate, this));

        this.$sections
            .on('click', 'a.go-to', $.proxy(this.onGoToNavigate, this));

        this.adjustContainer();
        this.manageSectionVisibility();
        this.updateNaviAid();
    },

    navigateByKey: function (key) {
        var index = this.keyToIndexMap[key];

        window.scrollTo(0, this.getSectionTopPosition(index));
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

    getSectionIndex: function () {
        var currentPosition = this.getCurrentScrollingPosition(),
            sectionIndex    = Math.floor(currentPosition / this.scrollingLengthPerSection)
        ;

        if (sectionIndex < 0) {
            return 0;
        }

        if (sectionIndex >= this.numberOfSectors) {
            return this.numberOfSectors - 1;
        }

        return sectionIndex;
    },

    getSectionTopPosition: function (index) {
        return Math.floor(this.scrollingLengthPerSection * index);
    },

    manageSectionVisibility: function () {
        var self         = this,
            sectionIndex = this.getSectionIndex()
        ;

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
                self.$currentSection = $section;
                window.location.hash = $section.attr('data-key');
                position = 'current';
            }

            self.setSectionPosition($(this), position);
        });

        this.hideNaviAid();
    },

    adjustContainer: function () {
        var totalScrollingDistance = this.getTotalScrollingDistance(),
            windowOuterHeight      = this.$window.outerHeight()
        ;

        this.$container.height(windowOuterHeight + totalScrollingDistance);
    },

    updateNaviAid: function () {
        var sectionIndex,
            bottomPosition;

        if (!this.config.showNaviAid) {
            return;
        }

        sectionIndex   = this.getSectionIndex();
        bottomPosition = (sectionIndex + 0.5) / this.numberOfSectors * 100

        this.$naviAid.text(this.$sections.eq(sectionIndex).attr('data-title'));
        this.$naviAid.css('top', bottomPosition + '%');
    },

    showNaviAid: function () {
        if (!this.config.showNaviAid) {
            return;
        }

        this.$naviAid.addClass('active');
    },

    hideNaviAid: function () {
        if (!this.config.showNaviAid) {
            return;
        }

        this.$naviAid.removeClass('active');
    },
});