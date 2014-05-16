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
        frameRate:  24, // frame per second
        delay:      6   // number of frames
    };

    $.extend(this.config, config);

    this.config.cycleRate = 1000 / 24;
    this.keyMap           = {};

    if (this.config.debug) {
        $('body').append([
            '<div id="sac-debug">',
                'Delay:      <b>[<span class="delay    "></span>]</b>',
                'Frame Rate: <b>[<span class="framerate"></span>]</b>',
                'Key Map:    <b>[<span class="keymap   "></span>]</b>',
            '</div>'
        ].join(' '));
    }

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