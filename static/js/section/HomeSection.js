var HomeSection = function (config) {
    this.config    = config;
    this.container = this.config.container;
    this.namespace = this.config.namespace;
    this.countdown = new Countdown({
            namespace:        'home',
            animationControl: this.config.animationControl,
            callback:         $.proxy(this.updateCounter, this),
            dueTimestamp:     this.config.dueTimestamp
        })
    ;

    this.$countdown = this.container.find('.countdown');
};

$.extend(HomeSection.prototype, {
    updateCounter: function (diff) {
        var diffInMonths = this.config.dueTimestamp.getMonth() - (new Date()).getMonth(),
            diffInHours = parseInt(diff / 60, 10),
            diffInDays  = parseInt(diff / 60 / 24, 10);

        if (diffInHours < -18) { // after 18 hours after the first event
            this.$countdown.attr('data-variation', 'end');
            this.$countdown.html('the wedding became history.');

            return;
        } else if (-18 < diffInHours && diffInHours < 0) {
            this.$countdown.attr('data-variation', 'now');
            this.$countdown.html('the wedding is happening <span>now</span>.');

            return;
        } else if (0 <= diffInHours && diffInHours < 1) {
            this.$countdown.attr('data-variation', 'next');
            this.$countdown.html('the wedding is about to happen.');

            return;
        } else if (1 <= diffInHours && diffInHours < 48) {
            this.$countdown.attr('data-variation', 'hours');
            this.$countdown.html('About <span>' + diffInHours + ' hours</span> to go');

            return;
        } else if (diffInDays < 100) {
            this.$countdown.attr('data-variation', 'days');
            this.$countdown.html('Just <span>' + diffInDays + ' days</span> to go');
        }

        this.$countdown.attr('data-variation', 'months');
        this.$countdown.html('<span>' + diffInMonths + ' months</span> remaining');
    }
});