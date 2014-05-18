/**
 * Countdown
 *
 * This class is to enable the countdown clock.
 *
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @copyright Juti Noppornpitak
 * @license Common MIT License
 */
var Countdown = function (config) {
    this.config           = config || {};
    this.animationControl = this.config.animationControl;
    this.dueTimestamp     = this.config.dueTimestamp

    if (!this.config.animationControl) {
        throw 'com.shiroyuki.banana.UndefinedAnimationControl';
    }

    if (!this.config.namespace) {
        throw 'com.shiroyuki.banana.UndefinedNamespace';
    }

    if (!this.config.dueTimestamp) {
        throw 'com.shiroyuki.banana.UndefinedDueTimestamp';
    }

    this.animationControl.register(
        this.config.namespace + '/update-countdown',
        $.proxy(this.updateCounter, this),
        {
            alwaysOn: true
        }
    );
};

$.extend(Countdown.prototype, {
    updateCounter: function () {
        var now = new Date();

        this.config.callback(
            parseInt((this.dueTimestamp - now) / 60 / 1000, 10) // in minutes
        );
    }
});