/**
 * Animation Control
 *
 * This class is to fixate the frame rate.
 *
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @copyright Juti Noppornpitak
 * @license Common MIT License
 */
var AnimationControl = function (config) {
    this.config = {
        debug:      false,
        frameRate:  60, // frame per second
        delay:      2    // number of frames
    };

    $.extend(this.config, config);

    this.loop             = null;
    this.config.cycleRate = 1000 / this.config.frameRate;
    this.keyMap           = {};
    this.selectorMap      = {};

    if (this.config.debug) {
        $('body').append([
            '<style>',
                '#sac-debug {',
                    'z-index: 10000;',
                    'opacity: 0.7;',
                    'border: 3px solid #000;',
                    'background: white;',
                    'padding: 5px 10px;',
                    'border-radius: 5px;',
                    'position: fixed;',
                    'bottom: 5px;',
                    'right: 5px;',
                '}',
                '#sac-debug table { width: 100%; }',
                '#sac-debug th { padding: 5px; text-align: right; }',
                '#sac-debug td { padding: 5px; overflow: hidden; }',
            '</style>',
            '<div id="sac-debug">',
                '<table>',
                    '<tr class="delay    "><th>Delay     </th><td></td></tr>',
                    '<tr class="framerate"><th>Frame Rate</th><td></td></tr>',
                    '<tr class="cyclerate"><th>Cycle Rate</th><td></td></tr>',
                '</table>',
            '</div>'
        ].join(' '));

        this.selectorMap.debug = {
            base: $('#sac-debug table'),
            dl: $('#sac-debug table .delay td'),
            fr: $('#sac-debug table .framerate td'),
            cr: $('#sac-debug table .cyclerate td'),
            etc: {}
        }
    }
};

$.extend(AnimationControl.prototype, {
    monitor: function () {
        var rootMap = this.selectorMap.debug;

        rootMap.dl.text(this.config.delay || 'N/A');
        rootMap.fr.text(this.config.frameRate);
        rootMap.cr.text(this.config.cycleRate);

        $.each(this.keyMap, function (key, meta) {
            rootMap.etc[key].text(meta.counter);
        });
    },
    activate: function () {
        this.loop = setInterval($.proxy(this.watch, this), this.config.cycleRate);
    },
    register: function (key, callback) {
        this.keyMap[key] = {
            callback: callback,
            counter:  0
        };

        if (this.config.debug) {
            this.selectorMap.debug.base.append('<tr class="etc" data-key="' + key + '"><th>' + key + '</th><td></td></tr>');
            this.selectorMap.debug.etc[key] = $('#sac-debug tr.etc[data-key="' + key + '"] td');
        }
    },
    trigger: function (key) {
        if (this.keyMap[key].counter === 0) {
            this.keyMap[key].counter = this.config.delay;

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

            meta.counter = 0;

            meta.callback();
        });

        if (this.config.debug) {
            this.monitor();
        }
    }
});