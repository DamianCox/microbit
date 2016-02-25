// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());;/*
 * Cookies.js - 1.2.1
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }

            return Cookies._cache[Cookies._cacheKeyPrefix + key];
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ? options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            return {
                key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
                value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
        // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);;// https://remysharp.com/2010/07/21/throttling-function-calls
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};/*
Check to see if an element is in the viewport
@see: http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport

*/
function isElementInViewport(el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    // console.log(rect);

    // item is above viewport
    if (rect.bottom < 0) {
        return true;
    }

    // whole item is in view
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};/*! jCarousel - v0.3.3 - 2015-04-07
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2015 Jan Sorgalla; Licensed MIT */
(function ($) {
    'use strict';

    var jCarousel = $.jCarousel = {};

    jCarousel.version = '0.3.3';

    var rRelativeTarget = /^([+\-]=)?(.+)$/;

    jCarousel.parseTarget = function (target) {
        var relative = false,
            parts = typeof target !== 'object' ?
                           rRelativeTarget.exec(target) :
                           null;

        if (parts) {
            target = parseInt(parts[2], 10) || 0;

            if (parts[1]) {
                relative = true;
                if (parts[1] === '-=') {
                    target *= -1;
                }
            }
        } else if (typeof target !== 'object') {
            target = parseInt(target, 10) || 0;
        }

        return {
            target: target,
            relative: relative
        };
    };

    jCarousel.detectCarousel = function (element) {
        var carousel;

        while (element.length > 0) {
            carousel = element.filter('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            carousel = element.find('[data-jcarousel]');

            if (carousel.length > 0) {
                return carousel;
            }

            element = element.parent();
        }

        return null;
    };

    jCarousel.base = function (pluginName) {
        return {
            version: jCarousel.version,
            _options: {},
            _element: null,
            _carousel: null,
            _init: $.noop,
            _create: $.noop,
            _destroy: $.noop,
            _reload: $.noop,
            create: function () {
                this._element
                    .attr('data-' + pluginName.toLowerCase(), true)
                    .data(pluginName, this);

                if (false === this._trigger('create')) {
                    return this;
                }

                this._create();

                this._trigger('createend');

                return this;
            },
            destroy: function () {
                if (false === this._trigger('destroy')) {
                    return this;
                }

                this._destroy();

                this._trigger('destroyend');

                this._element
                    .removeData(pluginName)
                    .removeAttr('data-' + pluginName.toLowerCase());

                return this;
            },
            reload: function (options) {
                if (false === this._trigger('reload')) {
                    return this;
                }

                if (options) {
                    this.options(options);
                }

                this._reload();

                this._trigger('reloadend');

                return this;
            },
            element: function () {
                return this._element;
            },
            options: function (key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }

                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ?
                                null :
                                this._options[key];
                    }

                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }

                return this;
            },
            carousel: function () {
                if (!this._carousel) {
                    this._carousel = jCarousel.detectCarousel(this.options('carousel') || this._element);

                    if (!this._carousel) {
                        $.error('Could not detect carousel for plugin "' + pluginName + '"');
                    }
                }

                return this._carousel;
            },
            _trigger: function (type, element, data) {
                var event,
                    defaultPrevented = false;

                data = [this].concat(data || []);

                (element || this._element).each(function () {
                    event = $.Event((pluginName + ':' + type).toLowerCase());

                    $(this).trigger(event, data);

                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });

                return !defaultPrevented;
            }
        };
    };

    jCarousel.plugin = function (pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function (element, options) {
            this._element = $(element);
            this.options(options);

            this._init();
            this.create();
        };

        Plugin.fn = Plugin.prototype = $.extend(
            {},
            jCarousel.base(pluginName),
            pluginPrototype
        );

        $.fn[pluginName] = function (options) {
            var args = Array.prototype.slice.call(arguments, 1),
                returnValue = this;

            if (typeof options === 'string') {
                this.each(function () {
                    var instance = $(this).data(pluginName);

                    if (!instance) {
                        return $.error(
                            'Cannot call methods on ' + pluginName + ' prior to initialization; ' +
                            'attempted to call method "' + options + '"'
                        );
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error(
                            'No such method "' + options + '" for ' + pluginName + ' instance'
                        );
                    }

                    var methodValue = instance[options].apply(instance, args);

                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $(this).data(pluginName);

                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }

            return returnValue;
        };

        return Plugin;
    };
}(jQuery));

(function ($, window) {
    'use strict';

    var toFloat = function (val) {
        return parseFloat(val) || 0;
    };

    $.jCarousel.plugin('jcarousel', {
        animating: false,
        tail: 0,
        inTail: false,
        resizeTimer: null,
        lt: null,
        vertical: false,
        rtl: false,
        circular: false,
        underflow: false,
        relative: false,

        _options: {
            list: function () {
                return this.element().children().eq(0);
            },
            items: function () {
                return this.list().children();
            },
            animation: 400,
            transitions: false,
            wrap: null,
            vertical: null,
            rtl: null,
            center: false
        },

        // Protected, don't access directly
        _list: null,
        _items: null,
        _target: $(),
        _first: $(),
        _last: $(),
        _visible: $(),
        _fullyvisible: $(),
        _init: function () {
            var self = this;

            this.onWindowResize = function () {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }

                self.resizeTimer = setTimeout(function () {
                    self.reload();
                }, 100);
            };

            return this;
        },
        _create: function () {
            this._reload();

            $(window).on('resize.jcarousel', this.onWindowResize);
        },
        _destroy: function () {
            $(window).off('resize.jcarousel', this.onWindowResize);
        },
        _reload: function () {
            this.vertical = this.options('vertical');

            if (this.vertical == null) {
                this.vertical = this.list().height() > this.list().width();
            }

            this.rtl = this.options('rtl');

            if (this.rtl == null) {
                this.rtl = (function (element) {
                    if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                        return true;
                    }

                    var found = false;

                    element.parents('[dir]').each(function () {
                        if ((/rtl/i).test($(this).attr('dir'))) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }(this._element));
            }

            this.lt = this.vertical ? 'top' : 'left';

            // Ensure before closest() call
            this.relative = this.list().css('position') === 'relative';

            // Force list and items reload
            this._list = null;
            this._items = null;

            var item = this.index(this._target) >= 0 ?
                           this._target :
                           this.closest();

            // _prepare() needs this here
            this.circular = this.options('wrap') === 'circular';
            this.underflow = false;

            var props = { 'left': 0, 'top': 0 };

            if (item.length > 0) {
                this._prepare(item);
                this.list().find('[data-jcarousel-clone]').remove();

                // Force items reload
                this._items = null;

                this.underflow = this._fullyvisible.length >= this.items().length;
                this.circular = this.circular && !this.underflow;

                props[this.lt] = this._position(item) + 'px';
            }

            this.move(props);

            return this;
        },
        list: function () {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }

            return this._list;
        },
        items: function () {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-jcarousel-clone]');
            }

            return this._items;
        },
        index: function (item) {
            return this.items().index(item);
        },
        closest: function () {
            var self = this,
                pos = this.list().position()[this.lt],
                closest = $(), // Ensure we're returning a jQuery instance
                stop = false,
                lrb = this.vertical ? 'bottom' : (this.rtl && !this.relative ? 'left' : 'right'),
                width;

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            this.items().each(function () {
                closest = $(this);

                if (stop) {
                    return false;
                }

                var dim = self.dimension(closest);

                pos += dim;

                if (pos >= 0) {
                    width = dim - toFloat(closest.css('margin-' + lrb));

                    if ((Math.abs(pos) - dim + (width / 2)) <= 0) {
                        stop = true;
                    } else {
                        return false;
                    }
                }
            });


            return closest;
        },
        target: function () {
            return this._target;
        },
        first: function () {
            return this._first;
        },
        last: function () {
            return this._last;
        },
        visible: function () {
            return this._visible;
        },
        fullyvisible: function () {
            return this._fullyvisible;
        },
        hasNext: function () {
            if (false === this._trigger('hasnext')) {
                return true;
            }

            var wrap = this.options('wrap'),
                end = this.items().length - 1,
                check = this.options('center') ? this._target : this._last;

            return end >= 0 && !this.underflow &&
                ((wrap && wrap !== 'first') ||
                    (this.index(check) < end) ||
                    (this.tail && !this.inTail)) ? true : false;
        },
        hasPrev: function () {
            if (false === this._trigger('hasprev')) {
                return true;
            }

            var wrap = this.options('wrap');

            return this.items().length > 0 && !this.underflow &&
                ((wrap && wrap !== 'last') ||
                    (this.index(this._first) > 0) ||
                    (this.tail && this.inTail)) ? true : false;
        },
        clipping: function () {
            return this._element['inner' + (this.vertical ? 'Height' : 'Width')]();
        },
        dimension: function (element) {
            return element['outer' + (this.vertical ? 'Height' : 'Width')](true);
        },
        scroll: function (target, animate, callback) {
            if (this.animating) {
                return this;
            }

            if (false === this._trigger('scroll', null, [target, animate])) {
                return this;
            }

            if ($.isFunction(animate)) {
                callback = animate;
                animate = true;
            }

            var parsed = $.jCarousel.parseTarget(target);

            if (parsed.relative) {
                var end = this.items().length - 1,
                    scroll = Math.abs(parsed.target),
                    wrap = this.options('wrap'),
                    current,
                    first,
                    index,
                    start,
                    curr,
                    isVisible,
                    props,
                    i;

                if (parsed.target > 0) {
                    var last = this.index(this._last);

                    if (last >= end && this.tail) {
                        if (!this.inTail) {
                            this._scrollTail(animate, callback);
                        } else {
                            if (wrap === 'both' || wrap === 'last') {
                                this._scroll(0, animate, callback);
                            } else {
                                if ($.isFunction(callback)) {
                                    callback.call(this, false);
                                }
                            }
                        }
                    } else {
                        current = this.index(this._target);

                        if ((this.underflow && current === end && (wrap === 'circular' || wrap === 'both' || wrap === 'last')) ||
                            (!this.underflow && last === end && (wrap === 'both' || wrap === 'last'))) {
                            this._scroll(0, animate, callback);
                        } else {
                            index = current + scroll;

                            if (this.circular && index > end) {
                                i = end;
                                curr = this.items().get(-1);

                                while (i++ < index) {
                                    curr = this.items().eq(0);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().append(curr);

                                    if (!isVisible) {
                                        props = {};
                                        props[this.lt] = this.dimension(curr);
                                        this.moveBy(props);
                                    }

                                    // Force items reload
                                    this._items = null;
                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.min(index, end), animate, callback);
                            }
                        }
                    }
                } else {
                    if (this.inTail) {
                        this._scroll(Math.max((this.index(this._first) - scroll) + 1, 0), animate, callback);
                    } else {
                        first = this.index(this._first);
                        current = this.index(this._target);
                        start = this.underflow ? current : first;
                        index = start - scroll;

                        if (start <= 0 && ((this.underflow && wrap === 'circular') || wrap === 'both' || wrap === 'first')) {
                            this._scroll(end, animate, callback);
                        } else {
                            if (this.circular && index < 0) {
                                i = index;
                                curr = this.items().get(0);

                                while (i++ < 0) {
                                    curr = this.items().eq(-1);
                                    isVisible = this._visible.index(curr) >= 0;

                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }

                                    this.list().prepend(curr);

                                    // Force items reload
                                    this._items = null;

                                    var dim = this.dimension(curr);

                                    props = {};
                                    props[this.lt] = -dim;
                                    this.moveBy(props);

                                }

                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.max(index, 0), animate, callback);
                            }
                        }
                    }
                }
            } else {
                this._scroll(parsed.target, animate, callback);
            }

            this._trigger('scrollend');

            return this;
        },
        moveBy: function (properties, opts) {
            var position = this.list().position(),
                multiplier = 1,
                correction = 0;

            if (this.rtl && !this.vertical) {
                multiplier = -1;

                if (this.relative) {
                    correction = this.list().width() - this.clipping();
                }
            }

            if (properties.left) {
                properties.left = (position.left + correction + toFloat(properties.left) * multiplier) + 'px';
            }

            if (properties.top) {
                properties.top = (position.top + correction + toFloat(properties.top) * multiplier) + 'px';
            }

            return this.move(properties, opts);
        },
        move: function (properties, opts) {
            opts = opts || {};

            var option = this.options('transitions'),
                transitions = !!option,
                transforms = !!option.transforms,
                transforms3d = !!option.transforms3d,
                duration = opts.duration || 0,
                list = this.list();

            if (!transitions && duration > 0) {
                list.animate(properties, opts);
                return;
            }

            var complete = opts.complete || $.noop,
                css = {};

            if (transitions) {
                var backup = {
                    transitionDuration: list.css('transitionDuration'),
                    transitionTimingFunction: list.css('transitionTimingFunction'),
                    transitionProperty: list.css('transitionProperty')
                },
                    oldComplete = complete;

                complete = function () {
                    $(this).css(backup);
                    oldComplete.call(this);
                };
                css = {
                    transitionDuration: (duration > 0 ? duration / 1000 : 0) + 's',
                    transitionTimingFunction: option.easing || opts.easing,
                    transitionProperty: duration > 0 ? (function () {
                        if (transforms || transforms3d) {
                            // We have to use 'all' because jQuery doesn't prefix
                            // css values, like transition-property: transform;
                            return 'all';
                        }

                        return properties.left ? 'left' : 'top';
                    })() : 'none',
                    transform: 'none'
                };
            }

            if (transforms3d) {
                css.transform = 'translate3d(' + (properties.left || 0) + ',' + (properties.top || 0) + ',0)';
            } else if (transforms) {
                css.transform = 'translate(' + (properties.left || 0) + ',' + (properties.top || 0) + ')';
            } else {
                $.extend(css, properties);
            }

            if (transitions && duration > 0) {
                list.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', complete);
            }

            list.css(css);

            if (duration <= 0) {
                list.each(function () {
                    complete.call(this);
                });
            }
        },
        _scroll: function (item, animate, callback) {
            if (this.animating) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            if (typeof item !== 'object') {
                item = this.items().eq(item);
            } else if (typeof item.jquery === 'undefined') {
                item = $(item);
            }

            if (item.length === 0) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            this.inTail = false;

            this._prepare(item);

            var pos = this._position(item),
                currPos = this.list().position()[this.lt];

            if (pos === currPos) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._animate(properties, animate, callback);

            return this;
        },
        _scrollTail: function (animate, callback) {
            if (this.animating || !this.tail) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }

                return this;
            }

            var pos = this.list().position()[this.lt];

            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }

            if (this.rtl && !this.vertical) {
                pos += this.tail;
            } else {
                pos -= this.tail;
            }

            this.inTail = true;

            var properties = {};
            properties[this.lt] = pos + 'px';

            this._update({
                target: this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            });

            this._animate(properties, animate, callback);

            return this;
        },
        _animate: function (properties, animate, callback) {
            callback = callback || $.noop;

            if (false === this._trigger('animate')) {
                callback.call(this, false);
                return this;
            }

            this.animating = true;

            var animation = this.options('animation'),
                complete = $.proxy(function () {
                    this.animating = false;

                    var c = this.list().find('[data-jcarousel-clone]');

                    if (c.length > 0) {
                        c.remove();
                        this._reload();
                    }

                    this._trigger('animateend');

                    callback.call(this, true);
                }, this);

            var opts = typeof animation === 'object' ?
                           $.extend({}, animation) :
                           { duration: animation },
                oldComplete = opts.complete || $.noop;

            if (animate === false) {
                opts.duration = 0;
            } else if (typeof $.fx.speeds[opts.duration] !== 'undefined') {
                opts.duration = $.fx.speeds[opts.duration];
            }

            opts.complete = function () {
                complete();
                oldComplete.call(this);
            };

            this.move(properties, opts);

            return this;
        },
        _prepare: function (item) {
            var index = this.index(item),
                idx = index,
                wh = this.dimension(item),
                clip = this.clipping(),
                lrb = this.vertical ? 'bottom' : (this.rtl ? 'left' : 'right'),
                center = this.options('center'),
                update = {
                    target: item,
                    first: item,
                    last: item,
                    visible: item,
                    fullyvisible: wh <= clip ? item : $()
                },
                curr,
                isVisible,
                margin,
                dim;

            if (center) {
                wh /= 2;
                clip /= 2;
            }

            if (wh < clip) {
                while (true) {
                    curr = this.items().eq(++idx);

                    if (curr.length === 0) {
                        if (!this.circular) {
                            break;
                        }

                        curr = this.items().eq(0);

                        if (item.get(0) === curr.get(0)) {
                            break;
                        }

                        isVisible = this._visible.index(curr) >= 0;

                        if (isVisible) {
                            curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                        }

                        this.list().append(curr);

                        if (!isVisible) {
                            var props = {};
                            props[this.lt] = this.dimension(curr);
                            this.moveBy(props);
                        }

                        // Force items reload
                        this._items = null;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.last = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            if (!this.circular && !center && wh < clip) {
                idx = index;

                while (true) {
                    if (--idx < 0) {
                        break;
                    }

                    curr = this.items().eq(idx);

                    if (curr.length === 0) {
                        break;
                    }

                    dim = this.dimension(curr);

                    if (dim === 0) {
                        break;
                    }

                    wh += dim;

                    update.first = curr;
                    update.visible = update.visible.add(curr);

                    // Remove right/bottom margin from total width
                    margin = toFloat(curr.css('margin-' + lrb));

                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }

                    if (wh >= clip) {
                        break;
                    }
                }
            }

            this._update(update);

            this.tail = 0;

            if (!center &&
                this.options('wrap') !== 'circular' &&
                this.options('wrap') !== 'custom' &&
                this.index(update.last) === (this.items().length - 1)) {

                // Remove right/bottom margin from total width
                wh -= toFloat(update.last.css('margin-' + lrb));

                if (wh > clip) {
                    this.tail = wh - clip;
                }
            }

            return this;
        },
        _position: function (item) {
            var first = this._first,
                pos = first.position()[this.lt],
                center = this.options('center'),
                centerOffset = center ? (this.clipping() / 2) - (this.dimension(first) / 2) : 0;

            if (this.rtl && !this.vertical) {
                if (this.relative) {
                    pos -= this.list().width() - this.dimension(first);
                } else {
                    pos -= this.clipping() - this.dimension(first);
                }

                pos += centerOffset;
            } else {
                pos -= centerOffset;
            }

            if (!center &&
                (this.index(item) > this.index(first) || this.inTail) &&
                this.tail) {
                pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
                this.inTail = true;
            } else {
                this.inTail = false;
            }

            return -pos;
        },
        _update: function (update) {
            var self = this,
                current = {
                    target: this._target,
                    first: this._first,
                    last: this._last,
                    visible: this._visible,
                    fullyvisible: this._fullyvisible
                },
                back = this.index(update.first || current.first) < this.index(current.first),
                key,
                doUpdate = function (key) {
                    var elIn = [],
                        elOut = [];

                    update[key].each(function () {
                        if (current[key].index(this) < 0) {
                            elIn.push(this);
                        }
                    });

                    current[key].each(function () {
                        if (update[key].index(this) < 0) {
                            elOut.push(this);
                        }
                    });

                    if (back) {
                        elIn = elIn.reverse();
                    } else {
                        elOut = elOut.reverse();
                    }

                    self._trigger(key + 'in', $(elIn));
                    self._trigger(key + 'out', $(elOut));

                    self['_' + key] = update[key];
                };

            for (key in update) {
                doUpdate(key);
            }

            return this;
        }
    });
}(jQuery, window));

(function ($) {
    'use strict';

    $.jcarousel.fn.scrollIntoView = function (target, animate, callback) {
        var parsed = $.jCarousel.parseTarget(target),
            first = this.index(this._fullyvisible.first()),
            last = this.index(this._fullyvisible.last()),
            index;

        if (parsed.relative) {
            index = parsed.target < 0 ? Math.max(0, first + parsed.target) : last + parsed.target;
        } else {
            index = typeof parsed.target !== 'object' ? parsed.target : this.index(parsed.target);
        }

        if (index < first) {
            return this.scroll(index, animate, callback);
        }

        if (index >= first && index <= last) {
            if ($.isFunction(callback)) {
                callback.call(this, false);
            }

            return this;
        }

        var items = this.items(),
            clip = this.clipping(),
            lrb = this.vertical ? 'bottom' : (this.rtl ? 'left' : 'right'),
            wh = 0,
            curr;

        while (true) {
            curr = items.eq(index);

            if (curr.length === 0) {
                break;
            }

            wh += this.dimension(curr);

            if (wh >= clip) {
                var margin = parseFloat(curr.css('margin-' + lrb)) || 0;
                if ((wh - margin) !== clip) {
                    index++;
                }
                break;
            }

            if (index <= 0) {
                break;
            }

            index--;
        }

        return this.scroll(index, animate, callback);
    };
}(jQuery));

(function ($) {
    'use strict';

    $.jCarousel.plugin('jcarouselControl', {
        _options: {
            target: '+=1',
            event: 'click',
            method: 'scroll'
        },
        _active: null,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onEvent = $.proxy(function (e) {
                e.preventDefault();

                var method = this.options('method');

                if ($.isFunction(method)) {
                    method.call(this);
                } else {
                    this.carousel()
                        .jcarousel(this.options('method'), this.options('target'));
                }
            }, this);
        },
        _create: function () {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend jcarousel:scrollend', this.onReload);

            this._element
                .on(this.options('event') + '.jcarouselcontrol', this.onEvent);

            this._reload();
        },
        _destroy: function () {
            this._element
                .off('.jcarouselcontrol', this.onEvent);

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend jcarousel:scrollend', this.onReload);
        },
        _reload: function () {
            var parsed = $.jCarousel.parseTarget(this.options('target')),
                carousel = this.carousel(),
                active;

            if (parsed.relative) {
                active = carousel
                    .jcarousel(parsed.target > 0 ? 'hasNext' : 'hasPrev');
            } else {
                var target = typeof parsed.target !== 'object' ?
                                carousel.jcarousel('items').eq(parsed.target) :
                                parsed.target;

                active = carousel.jcarousel('target').index(target) >= 0;
            }

            if (this._active !== active) {
                this._trigger(active ? 'active' : 'inactive');
                this._active = active;
            }

            return this;
        }
    });
}(jQuery));

(function ($) {
    'use strict';

    $.jCarousel.plugin('jcarouselPagination', {
        _options: {
            perPage: null,
            item: function (page) {
                return '<a href="#' + page + '">' + page + '</a>';
            },
            event: 'click',
            method: 'scroll'
        },
        _carouselItems: null,
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onScroll = $.proxy(this._update, this);
        },
        _create: function () {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy)
                .on('jcarousel:reloadend', this.onReload)
                .on('jcarousel:scrollend', this.onScroll);

            this._reload();
        },
        _destroy: function () {
            this._clear();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy)
                .off('jcarousel:reloadend', this.onReload)
                .off('jcarousel:scrollend', this.onScroll);

            this._carouselItems = null;
        },
        _reload: function () {
            var perPage = this.options('perPage');

            this._pages = {};
            this._items = {};

            // Calculate pages
            if ($.isFunction(perPage)) {
                perPage = perPage.call(this);
            }

            if (perPage == null) {
                this._pages = this._calculatePages();
            } else {
                var pp = parseInt(perPage, 10) || 0,
                    items = this._getCarouselItems(),
                    page = 1,
                    i = 0,
                    curr;

                while (true) {
                    curr = items.eq(i++);

                    if (curr.length === 0) {
                        break;
                    }

                    if (!this._pages[page]) {
                        this._pages[page] = curr;
                    } else {
                        this._pages[page] = this._pages[page].add(curr);
                    }

                    if (i % pp === 0) {
                        page++;
                    }
                }
            }

            this._clear();

            var self = this,
                carousel = this.carousel().data('jcarousel'),
                element = this._element,
                item = this.options('item'),
                numCarouselItems = this._getCarouselItems().length;

            $.each(this._pages, function (page, carouselItems) {
                var currItem = self._items[page] = $(item.call(self, page, carouselItems));

                currItem.on(self.options('event') + '.jcarouselpagination', $.proxy(function () {
                    var target = carouselItems.eq(0);

                    // If circular wrapping enabled, ensure correct scrolling direction
                    if (carousel.circular) {
                        var currentIndex = carousel.index(carousel.target()),
                            newIndex = carousel.index(target);

                        if (parseFloat(page) > parseFloat(self._currentPage)) {
                            if (newIndex < currentIndex) {
                                target = '+=' + (numCarouselItems - currentIndex + newIndex);
                            }
                        } else {
                            if (newIndex > currentIndex) {
                                target = '-=' + (currentIndex + (numCarouselItems - newIndex));
                            }
                        }
                    }

                    carousel[this.options('method')](target);
                }, self));

                element.append(currItem);
            });

            this._update();
        },
        _update: function () {
            var target = this.carousel().jcarousel('target'),
                currentPage;

            $.each(this._pages, function (page, carouselItems) {
                carouselItems.each(function () {
                    if (target.is(this)) {
                        currentPage = page;
                        return false;
                    }
                });

                if (currentPage) {
                    return false;
                }
            });

            if (this._currentPage !== currentPage) {
                this._trigger('inactive', this._items[this._currentPage]);
                this._trigger('active', this._items[currentPage]);
            }

            this._currentPage = currentPage;
        },
        items: function () {
            return this._items;
        },
        reloadCarouselItems: function () {
            this._carouselItems = null;
            return this;
        },
        _clear: function () {
            this._element.empty();
            this._currentPage = null;
        },
        _calculatePages: function () {
            var carousel = this.carousel().data('jcarousel'),
                items = this._getCarouselItems(),
                clip = carousel.clipping(),
                wh = 0,
                idx = 0,
                page = 1,
                pages = {},
                curr,
                dim;

            while (true) {
                curr = items.eq(idx++);

                if (curr.length === 0) {
                    break;
                }

                dim = carousel.dimension(curr);

                if ((wh + dim) > clip) {
                    page++;
                    wh = 0;
                }

                wh += dim;

                if (!pages[page]) {
                    pages[page] = curr;
                } else {
                    pages[page] = pages[page].add(curr);
                }
            }

            return pages;
        },
        _getCarouselItems: function () {
            if (!this._carouselItems) {
                this._carouselItems = this.carousel().jcarousel('items');
            }

            return this._carouselItems;
        }
    });
}(jQuery));

(function ($, document) {
    'use strict';

    var hiddenProp,
        visibilityChangeEvent,
        visibilityChangeEventNames = {
            hidden: 'visibilitychange',
            mozHidden: 'mozvisibilitychange',
            msHidden: 'msvisibilitychange',
            webkitHidden: 'webkitvisibilitychange'
        }
    ;

    $.each(visibilityChangeEventNames, function (key, val) {
        if (typeof document[key] !== 'undefined') {
            hiddenProp = key;
            visibilityChangeEvent = val;
            return false;
        }
    });

    $.jCarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target: '+=1',
            interval: 3000,
            autostart: false
        },
        _timer: null,
        _started: false,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel()
                    .one('jcarousel:createend', $.proxy(this._create, this));
            }, this);

            this.onAnimateEnd = $.proxy(this._start, this);

            this.onVisibilityChange = $.proxy(function () {
                if (document[hiddenProp]) {
                    this._stop();
                } else {
                    this._start();
                }
            }, this);
        },
        _create: function () {
            this.carousel()
                .one('jcarousel:destroy', this.onDestroy);

            $(document)
                .on(visibilityChangeEvent, this.onVisibilityChange);

            if (this.options('autostart')) {

            }
        },
        _destroy: function () {
            this._stop();

            this.carousel()
                .off('jcarousel:destroy', this.onDestroy);

            $(document)
                .off(visibilityChangeEvent, this.onVisibilityChange);
        },
        _start: function () {
            this._stop();

            if (!this._started) {
                return;
            }

            this.carousel()
                .one('jcarousel:animateend', this.onAnimateEnd);

            this._timer = setTimeout($.proxy(function () {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));

            return this;
        },
        _stop: function () {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }

            this.carousel()
                .off('jcarousel:animateend', this.onAnimateEnd);

            return this;
        },
        start: function () {
            this._started = true;
            this._start();

            return this;
        },
        stop: function () {
            this._started = false;
            this._stop();

            return this;
        }
    });
}(jQuery, document));

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-localstorage-shiv-cssclasses-load
 */
; window.Modernizr = function (a, b, c) { function u(a) { j.cssText = a } function v(a, b) { return u(prefixes.join(a + ";") + (b || "")) } function w(a, b) { return typeof a === b } function x(a, b) { return !!~("" + a).indexOf(b) } function y(a, b, d) { for (var e in a) { var f = b[a[e]]; if (f !== c) return d === !1 ? a[e] : w(f, "function") ? f.bind(d || b) : f } return !1 } var d = "2.8.3", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = {}, n = {}, o = {}, p = [], q = p.slice, r, s = {}.hasOwnProperty, t; !w(s, "undefined") && !w(s.call, "undefined") ? t = function (a, b) { return s.call(a, b) } : t = function (a, b) { return b in a && w(a.constructor.prototype[b], "undefined") }, Function.prototype.bind || (Function.prototype.bind = function (b) { var c = this; if (typeof c != "function") throw new TypeError; var d = q.call(arguments, 1), e = function () { if (this instanceof e) { var a = function () { }; a.prototype = c.prototype; var f = new a, g = c.apply(f, d.concat(q.call(arguments))); return Object(g) === g ? g : f } return c.apply(b, d.concat(q.call(arguments))) }; return e }), m.localstorage = function () { try { return localStorage.setItem(h, h), localStorage.removeItem(h), !0 } catch (a) { return !1 } }; for (var z in m) t(m, z) && (r = z.toLowerCase(), e[r] = m[z](), p.push((e[r] ? "" : "no-") + r)); return e.addTest = function (a, b) { if (typeof a == "object") for (var d in a) t(a, d) && e.addTest(d, a[d]); else { a = a.toLowerCase(); if (e[a] !== c) return e; b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b } return e }, u(""), i = k = null, function (a, b) { function l(a, b) { var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement; return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild) } function m() { var a = s.elements; return typeof a == "string" ? a.split(" ") : a } function n(a) { var b = j[a[h]]; return b || (b = {}, i++, a[h] = i, j[i] = b), b } function o(a, c, d) { c || (c = b); if (k) return c.createElement(a); d || (d = n(c)); var g; return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g } function p(a, c) { a || (a = b); if (k) return a.createDocumentFragment(); c = c || n(a); var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length; for (; e < g; e++) d.createElement(f[e]); return d } function q(a, b) { b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) { return s.shivMethods ? o(c, a, b) : b.createElem(c) }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function (a) { return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")' }) + ");return n}")(s, b.frag) } function r(a) { a || (a = b); var c = n(a); return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a } var c = "3.7.0", d = a.html5 || {}, e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, g, h = "_html5shiv", i = 0, j = {}, k; (function () { try { var a = b.createElement("a"); a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = a.childNodes.length == 1 || function () { b.createElement("a"); var a = b.createDocumentFragment(); return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined" }() } catch (c) { g = !0, k = !0 } })(); var s = { elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video", version: c, shivCSS: d.shivCSS !== !1, supportsUnknownElements: k, shivMethods: d.shivMethods !== !1, type: "default", shivDocument: r, createElement: o, createDocumentFragment: p }; a.html5 = s, r(b) }(this, b), e._version = d, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + p.join(" ") : ""), e }(this, this.document), function (a, b, c) { function d(a) { return "[object Function]" == o.call(a) } function e(a) { return "string" == typeof a } function f() { } function g(a) { return !a || "loaded" == a || "complete" == a || "uninitialized" == a } function h() { var a = p.shift(); q = 1, a ? a.t ? m(function () { ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1) }, 0) : (a(), h()) : q = 0 } function i(a, c, d, e, f, i, j) { function k(b) { if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) { "img" != a && m(function () { t.removeChild(l) }, 50); for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload() } } var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = { t: d, s: c, e: f, a: i, x: j }; 1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () { k.call(this, r) }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l)) } function j(a, b, c, d, f) { return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this } function k() { var a = B; return a.loader = { load: j, i: 0 }, a } var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function (a) { return "[object Array]" == o.call(a) }, x = [], y = {}, z = { timeout: function (a, b) { return b.length && (a.timeout = b[0]), a } }, A, B; B = function (a) { function b(a) { var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = { url: c, origUrl: c, prefixes: a }, e, f, g; for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g)); for (f = 0; f < b; f++) c = x[f](c); return c } function g(a, e, f, g, h) { var i = b(a), j = i.autoCallback; i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () { k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2 }))) } function h(a, b) { function c(a, c) { if (a) { if (e(a)) c || (j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() }), g(a, j, b, 0, h); else if (Object(a) === a) for (n in m = function () { var b = 0, c; for (c in a) a.hasOwnProperty(c) && b++; return b }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() } : j[n] = function (a) { return function () { var b = [].slice.call(arguments); a && a.apply(this, b), l() } }(k[n])), g(a[n], j, b, n, h)) } else !c && l() } var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n; c(h ? a.yep : a.nope, !!i), i && c(i) } var i, j, l = this.yepnope.loader; if (e(a)) g(a, 0, l, 0); else if (w(a)) for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l) }, B.addPrefix = function (a, b) { z[a] = b }, B.addFilter = function (a) { x.push(a) }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () { b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete" }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) { var k = b.createElement("script"), l, o, e = e || B.errorTimeout; k.src = a; for (o in d) k.setAttribute(o, d[o]); c = j ? h : c || f, k.onreadystatechange = k.onload = function () { !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null) }, m(function () { l || (l = 1, c(1)) }, e), i ? k.onload() : n.parentNode.insertBefore(k, n) }, a.yepnope.injectCss = function (a, c, d, e, g, i) { var e = b.createElement("link"), j, c = i ? h : c || f; e.href = a, e.rel = "stylesheet", e.type = "text/css"; for (j in d) e.setAttribute(j, d[j]); g || (n.parentNode.insertBefore(e, n), m(c, 0)) } }(this, document), Modernizr.load = function () { yepnope.apply(window, [].slice.call(arguments, 0)) };

/*MUSTACHE.js
 *
 */
(function defineMustache(global, factory) { if (typeof exports === "object" && exports && typeof exports.nodeName !== "string") { factory(exports) } else if (typeof define === "function" && define.amd) { define(["exports"], factory) } else { global.Mustache = {}; factory(Mustache) } })(this, function mustacheFactory(mustache) { var objectToString = Object.prototype.toString; var isArray = Array.isArray || function isArrayPolyfill(object) { return objectToString.call(object) === "[object Array]" }; function isFunction(object) { return typeof object === "function" } function typeStr(obj) { return isArray(obj) ? "array" : typeof obj } function escapeRegExp(string) { return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") } function hasProperty(obj, propName) { return obj != null && typeof obj === "object" && propName in obj } var regExpTest = RegExp.prototype.test; function testRegExp(re, string) { return regExpTest.call(re, string) } var nonSpaceRe = /\S/; function isWhitespace(string) { return !testRegExp(nonSpaceRe, string) } var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" }; function escapeHtml(string) { return String(string).replace(/[&<>"'\/]/g, function fromEntityMap(s) { return entityMap[s] }) } var whiteRe = /\s*/; var spaceRe = /\s+/; var equalsRe = /\s*=/; var curlyRe = /\s*\}/; var tagRe = /#|\^|\/|>|\{|&|=|!/; function parseTemplate(template, tags) { if (!template) return []; var sections = []; var tokens = []; var spaces = []; var hasTag = false; var nonSpace = false; function stripSpace() { if (hasTag && !nonSpace) { while (spaces.length) delete tokens[spaces.pop()] } else { spaces = [] } hasTag = false; nonSpace = false } var openingTagRe, closingTagRe, closingCurlyRe; function compileTags(tagsToCompile) { if (typeof tagsToCompile === "string") tagsToCompile = tagsToCompile.split(spaceRe, 2); if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error("Invalid tags: " + tagsToCompile); openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*"); closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1])); closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1])) } compileTags(tags || mustache.tags); var scanner = new Scanner(template); var start, type, value, chr, token, openSection; while (!scanner.eos()) { start = scanner.pos; value = scanner.scanUntil(openingTagRe); if (value) { for (var i = 0, valueLength = value.length; i < valueLength; ++i) { chr = value.charAt(i); if (isWhitespace(chr)) { spaces.push(tokens.length) } else { nonSpace = true } tokens.push(["text", chr, start, start + 1]); start += 1; if (chr === "\n") stripSpace() } } if (!scanner.scan(openingTagRe)) break; hasTag = true; type = scanner.scan(tagRe) || "name"; scanner.scan(whiteRe); if (type === "=") { value = scanner.scanUntil(equalsRe); scanner.scan(equalsRe); scanner.scanUntil(closingTagRe) } else if (type === "{") { value = scanner.scanUntil(closingCurlyRe); scanner.scan(curlyRe); scanner.scanUntil(closingTagRe); type = "&" } else { value = scanner.scanUntil(closingTagRe) } if (!scanner.scan(closingTagRe)) throw new Error("Unclosed tag at " + scanner.pos); token = [type, value, start, scanner.pos]; tokens.push(token); if (type === "#" || type === "^") { sections.push(token) } else if (type === "/") { openSection = sections.pop(); if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start); if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start) } else if (type === "name" || type === "{" || type === "&") { nonSpace = true } else if (type === "=") { compileTags(value) } } openSection = sections.pop(); if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos); return nestTokens(squashTokens(tokens)) } function squashTokens(tokens) { var squashedTokens = []; var token, lastToken; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; if (token) { if (token[0] === "text" && lastToken && lastToken[0] === "text") { lastToken[1] += token[1]; lastToken[3] = token[3] } else { squashedTokens.push(token); lastToken = token } } } return squashedTokens } function nestTokens(tokens) { var nestedTokens = []; var collector = nestedTokens; var sections = []; var token, section; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; switch (token[0]) { case "#": case "^": collector.push(token); sections.push(token); collector = token[4] = []; break; case "/": section = sections.pop(); section[5] = token[2]; collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens; break; default: collector.push(token) } } return nestedTokens } function Scanner(string) { this.string = string; this.tail = string; this.pos = 0 } Scanner.prototype.eos = function eos() { return this.tail === "" }; Scanner.prototype.scan = function scan(re) { var match = this.tail.match(re); if (!match || match.index !== 0) return ""; var string = match[0]; this.tail = this.tail.substring(string.length); this.pos += string.length; return string }; Scanner.prototype.scanUntil = function scanUntil(re) { var index = this.tail.search(re), match; switch (index) { case -1: match = this.tail; this.tail = ""; break; case 0: match = ""; break; default: match = this.tail.substring(0, index); this.tail = this.tail.substring(index) } this.pos += match.length; return match }; function Context(view, parentContext) { this.view = view; this.cache = { ".": this.view }; this.parent = parentContext } Context.prototype.push = function push(view) { return new Context(view, this) }; Context.prototype.lookup = function lookup(name) { var cache = this.cache; var value; if (cache.hasOwnProperty(name)) { value = cache[name] } else { var context = this, names, index, lookupHit = false; while (context) { if (name.indexOf(".") > 0) { value = context.view; names = name.split("."); index = 0; while (value != null && index < names.length) { if (index === names.length - 1) lookupHit = hasProperty(value, names[index]); value = value[names[index++]] } } else { value = context.view[name]; lookupHit = hasProperty(context.view, name) } if (lookupHit) break; context = context.parent } cache[name] = value } if (isFunction(value)) value = value.call(this.view); return value }; function Writer() { this.cache = {} } Writer.prototype.clearCache = function clearCache() { this.cache = {} }; Writer.prototype.parse = function parse(template, tags) { var cache = this.cache; var tokens = cache[template]; if (tokens == null) tokens = cache[template] = parseTemplate(template, tags); return tokens }; Writer.prototype.render = function render(template, view, partials) { var tokens = this.parse(template); var context = view instanceof Context ? view : new Context(view); return this.renderTokens(tokens, context, partials, template) }; Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) { var buffer = ""; var token, symbol, value; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { value = undefined; token = tokens[i]; symbol = token[0]; if (symbol === "#") value = this.renderSection(token, context, partials, originalTemplate); else if (symbol === "^") value = this.renderInverted(token, context, partials, originalTemplate); else if (symbol === ">") value = this.renderPartial(token, context, partials, originalTemplate); else if (symbol === "&") value = this.unescapedValue(token, context); else if (symbol === "name") value = this.escapedValue(token, context); else if (symbol === "text") value = this.rawValue(token); if (value !== undefined) buffer += value } return buffer }; Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) { var self = this; var buffer = ""; var value = context.lookup(token[1]); function subRender(template) { return self.render(template, context, partials) } if (!value) return; if (isArray(value)) { for (var j = 0, valueLength = value.length; j < valueLength; ++j) { buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate) } } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") { buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate) } else if (isFunction(value)) { if (typeof originalTemplate !== "string") throw new Error("Cannot use higher-order sections without the original template"); value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender); if (value != null) buffer += value } else { buffer += this.renderTokens(token[4], context, partials, originalTemplate) } return buffer }; Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) { var value = context.lookup(token[1]); if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate) }; Writer.prototype.renderPartial = function renderPartial(token, context, partials) { if (!partials) return; var value = isFunction(partials) ? partials(token[1]) : partials[token[1]]; if (value != null) return this.renderTokens(this.parse(value), context, partials, value) }; Writer.prototype.unescapedValue = function unescapedValue(token, context) { var value = context.lookup(token[1]); if (value != null) return value }; Writer.prototype.escapedValue = function escapedValue(token, context) { var value = context.lookup(token[1]); if (value != null) return mustache.escape(value) }; Writer.prototype.rawValue = function rawValue(token) { return token[1] }; mustache.name = "mustache.js"; mustache.version = "2.1.3"; mustache.tags = ["{{", "}}"]; var defaultWriter = new Writer; mustache.clearCache = function clearCache() { return defaultWriter.clearCache() }; mustache.parse = function parse(template, tags) { return defaultWriter.parse(template, tags) }; mustache.render = function render(template, view, partials) { if (typeof template !== "string") { throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + "argument for mustache#render(template, view, partials)") } return defaultWriter.render(template, view, partials) }; mustache.to_html = function to_html(template, view, partials, send) { var result = mustache.render(template, view, partials); if (isFunction(send)) { send(result) } else { return result } }; mustache.escape = escapeHtml; mustache.Scanner = Scanner; mustache.Context = Context; mustache.Writer = Writer });


/*! WOW - v1.1.2 - 2015-08-19
* Copyright (c) 2015 Matthieu Aussaguel; Licensed MIT */(function () { var a, b, c, d, e, f = function (a, b) { return function () { return a.apply(b, arguments) } }, g = [].indexOf || function (a) { for (var b = 0, c = this.length; c > b; b++) if (b in this && this[b] === a) return b; return -1 }; b = function () { function a() { } return a.prototype.extend = function (a, b) { var c, d; for (c in b) d = b[c], null == a[c] && (a[c] = d); return a }, a.prototype.isMobile = function (a) { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a) }, a.prototype.createEvent = function (a, b, c, d) { var e; return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e }, a.prototype.emitEvent = function (a, b) { return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0 }, a.prototype.addEvent = function (a, b, c) { return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c }, a.prototype.removeEvent = function (a, b, c) { return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b] }, a.prototype.innerHeight = function () { return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight }, a }(), c = this.WeakMap || this.MozWeakMap || (c = function () { function a() { this.keys = [], this.values = [] } return a.prototype.get = function (a) { var b, c, d, e, f; for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) if (c = f[b], c === a) return this.values[b] }, a.prototype.set = function (a, b) { var c, d, e, f, g; for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) if (d = g[c], d === a) return void (this.values[c] = b); return this.keys.push(a), this.values.push(b) }, a }()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function () { function a() { "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.") } return a.notSupported = !0, a.prototype.observe = function () { }, a }()), d = this.getComputedStyle || function (a) { return this.getPropertyValue = function (b) { var c; return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function (a, b) { return b.toUpperCase() }), (null != (c = a.currentStyle) ? c[b] : void 0) || null }, this }, e = /(\-([a-z]){1})/g, this.WOW = function () { function e(a) { null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), null != a.scrollContainer && (this.config.scrollContainer = document.querySelector(a.scrollContainer)), this.animationNameCache = new c, this.wowEvent = this.util().createEvent(this.config.boxClass) } return e.prototype.defaults = { boxClass: "wow", animateClass: "animated", offset: 0, mobile: !0, live: !0, callback: null, scrollContainer: null }, e.prototype.init = function () { var a; return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = [] }, e.prototype.start = function () { var b, c, d, e; if (this.stopped = !1, this.boxes = function () { var a, c, d, e; for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b); return e }.call(this), this.all = function () { var a, c, d, e; for (d = this.boxes, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b); return e }.call(this), this.boxes.length) if (this.disabled()) this.resetStyle(); else for (e = this.boxes, c = 0, d = e.length; d > c; c++) b = e[c], this.applyStyle(b, !0); return this.disabled() || (this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new a(function (a) { return function (b) { var c, d, e, f, g; for (g = [], c = 0, d = b.length; d > c; c++) f = b[c], g.push(function () { var a, b, c, d; for (c = f.addedNodes || [], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(this.doSync(e)); return d }.call(a)); return g } }(this)).observe(document.body, { childList: !0, subtree: !0 }) : void 0 }, e.prototype.stop = function () { return this.stopped = !0, this.util().removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0 }, e.prototype.sync = function () { return a.notSupported ? this.doSync(this.element) : void 0 }, e.prototype.doSync = function (a) { var b, c, d, e, f; if (null == a && (a = this.element), 1 === a.nodeType) { for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0); return f } }, e.prototype.show = function (a) { return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a }, e.prototype.applyStyle = function (a, b) { var c, d, e; return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) { return function () { return f.customStyle(a, b, d, c, e) } }(this)) }, e.prototype.animate = function () { return "requestAnimationFrame" in window ? function (a) { return window.requestAnimationFrame(a) } : function (a) { return a() } }(), e.prototype.resetStyle = function () { var a, b, c, d, e; for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible"); return e }, e.prototype.resetAnimation = function (a) { var b; return a.type.toLowerCase().indexOf("animationend") >= 0 ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()) : void 0 }, e.prototype.customStyle = function (a, b, c, d, e) { return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, { animationDuration: c }), d && this.vendorSet(a.style, { animationDelay: d }), e && this.vendorSet(a.style, { animationIterationCount: e }), this.vendorSet(a.style, { animationName: b ? "none" : this.cachedAnimationName(a) }), a }, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function (a, b) { var c, d, e, f; d = []; for (c in b) e = b[c], a["" + c] = e, d.push(function () { var b, d, g, h; for (g = this.vendors, h = [], b = 0, d = g.length; d > b; b++) f = g[b], h.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e); return h }.call(this)); return d }, e.prototype.vendorCSS = function (a, b) { var c, e, f, g, h, i; for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; e > c; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b); return g }, e.prototype.animationName = function (a) { var b; try { b = this.vendorCSS(a, "animation-name").cssText } catch (c) { b = d(a).getPropertyValue("animation-name") } return "none" === b ? "" : b }, e.prototype.cacheAnimationName = function (a) { return this.animationNameCache.set(a, this.animationName(a)) }, e.prototype.cachedAnimationName = function (a) { return this.animationNameCache.get(a) }, e.prototype.scrollHandler = function () { return this.scrolled = !0 }, e.prototype.scrollCallback = function () { var a; return !this.scrolled || (this.scrolled = !1, this.boxes = function () { var b, c, d, e; for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a)); return e }.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop() }, e.prototype.offsetTop = function (a) { for (var b; void 0 === a.offsetTop;) a = a.parentNode; for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop; return b }, e.prototype.isVisible = function (a) { var b, c, d, e, f; return c = a.getAttribute("data-wow-offset") || this.config.offset, f = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f }, e.prototype.util = function () { return null != this._util ? this._util : this._util = new b }, e.prototype.disabled = function () { return !this.config.mobile && this.util().isMobile(navigator.userAgent) }, e }() }).call(this);

/*!
 * Masonry PACKAGED v3.3.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function (a) { function b() { } function c(a) { function c(b) { b.prototype.option || (b.prototype.option = function (b) { a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b)) }) } function e(b, c) { a.fn[b] = function (e) { if ("string" == typeof e) { for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) { var j = this[h], k = a.data(j, b); if (k) if (a.isFunction(k[e]) && "_" !== e.charAt(0)) { var l = k[e].apply(k, g); if (void 0 !== l) return l } else f("no such method '" + e + "' for " + b + " instance"); else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'") } return this } return this.each(function () { var d = a.data(this, b); d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d)) }) } } if (a) { var f = "undefined" == typeof console ? b : function (a) { console.error(a) }; return a.bridget = function (a, b) { c(b), e(a, b) }, a.bridget } } var d = Array.prototype.slice; "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery) }(window), function (a) { function b(b) { var c = a.event; return c.target = c.target || c.srcElement || b, c } var c = document.documentElement, d = function () { }; c.addEventListener ? d = function (a, b, c) { a.addEventListener(b, c, !1) } : c.attachEvent && (d = function (a, c, d) { a[c + d] = d.handleEvent ? function () { var c = b(a); d.handleEvent.call(d, c) } : function () { var c = b(a); d.call(a, c) }, a.attachEvent("on" + c, a[c + d]) }); var e = function () { }; c.removeEventListener ? e = function (a, b, c) { a.removeEventListener(b, c, !1) } : c.detachEvent && (e = function (a, b, c) { a.detachEvent("on" + b, a[b + c]); try { delete a[b + c] } catch (d) { a[b + c] = void 0 } }); var f = { bind: d, unbind: e }; "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f }(window), function () { function a() { } function b(a, b) { for (var c = a.length; c--;) if (a[c].listener === b) return c; return -1 } function c(a) { return function () { return this[a].apply(this, arguments) } } var d = a.prototype, e = this, f = e.EventEmitter; d.getListeners = function (a) { var b, c, d = this._getEvents(); if (a instanceof RegExp) { b = {}; for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c]) } else b = d[a] || (d[a] = []); return b }, d.flattenListeners = function (a) { var b, c = []; for (b = 0; b < a.length; b += 1) c.push(a[b].listener); return c }, d.getListenersAsObject = function (a) { var b, c = this.getListeners(a); return c instanceof Array && (b = {}, b[a] = c), b || c }, d.addListener = function (a, c) { var d, e = this.getListenersAsObject(a), f = "object" == typeof c; for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : { listener: c, once: !1 }); return this }, d.on = c("addListener"), d.addOnceListener = function (a, b) { return this.addListener(a, { listener: b, once: !0 }) }, d.once = c("addOnceListener"), d.defineEvent = function (a) { return this.getListeners(a), this }, d.defineEvents = function (a) { for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]); return this }, d.removeListener = function (a, c) { var d, e, f = this.getListenersAsObject(a); for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1)); return this }, d.off = c("removeListener"), d.addListeners = function (a, b) { return this.manipulateListeners(!1, a, b) }, d.removeListeners = function (a, b) { return this.manipulateListeners(!0, a, b) }, d.manipulateListeners = function (a, b, c) { var d, e, f = a ? this.removeListener : this.addListener, g = a ? this.removeListeners : this.addListeners; if ("object" != typeof b || b instanceof RegExp) for (d = c.length; d--;) f.call(this, b, c[d]); else for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e)); return this }, d.removeEvent = function (a) { var b, c = typeof a, d = this._getEvents(); if ("string" === c) delete d[a]; else if (a instanceof RegExp) for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b]; else delete this._events; return this }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function (a, b) { var c, d, e, f, g = this.getListenersAsObject(a); for (e in g) if (g.hasOwnProperty(e)) for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener); return this }, d.trigger = c("emitEvent"), d.emit = function (a) { var b = Array.prototype.slice.call(arguments, 1); return this.emitEvent(a, b) }, d.setOnceReturnValue = function (a) { return this._onceReturnValue = a, this }, d._getOnceReturnValue = function () { return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0 }, d._getEvents = function () { return this._events || (this._events = {}) }, a.noConflict = function () { return e.EventEmitter = f, a }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () { return a }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a }.call(this), function (a) { function b(a) { if (a) { if ("string" == typeof d[a]) return a; a = a.charAt(0).toUpperCase() + a.slice(1); for (var b, e = 0, f = c.length; f > e; e++) if (b = c[e] + a, "string" == typeof d[b]) return b } } var c = "Webkit Moz ms Ms O".split(" "), d = document.documentElement.style; "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function () { return b }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b }(window), function (a) { function b(a) { var b = parseFloat(a), c = -1 === a.indexOf("%") && !isNaN(b); return c && b } function c() { } function d() { for (var a = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 }, b = 0, c = g.length; c > b; b++) { var d = g[b]; a[d] = 0 } return a } function e(c) { function e() { if (!m) { m = !0; var d = a.getComputedStyle; if (j = function () { var a = d ? function (a) { return d(a, null) } : function (a) { return a.currentStyle }; return function (b) { var c = a(b); return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c } }(), k = c("boxSizing")) { var e = document.createElement("div"); e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box"; var g = document.body || document.documentElement; g.appendChild(e); var h = j(e); l = 200 === b(h.width), g.removeChild(e) } } } function h(a) { if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) { var c = j(a); if ("none" === c.display) return d(); var f = {}; f.width = a.offsetWidth, f.height = a.offsetHeight; for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) { var o = g[m], p = c[o]; p = i(a, p); var q = parseFloat(p); f[o] = isNaN(q) ? 0 : q } var r = f.paddingLeft + f.paddingRight, s = f.paddingTop + f.paddingBottom, t = f.marginLeft + f.marginRight, u = f.marginTop + f.marginBottom, v = f.borderLeftWidth + f.borderRightWidth, w = f.borderTopWidth + f.borderBottomWidth, x = h && l, y = b(c.width); y !== !1 && (f.width = y + (x ? 0 : r + v)); var z = b(c.height); return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f } } function i(b, c) { if (a.getComputedStyle || -1 === c.indexOf("%")) return c; var d = b.style, e = d.left, f = b.runtimeStyle, g = f && f.left; return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c } var j, k, l, m = !1; return h } var f = "undefined" == typeof console ? c : function (a) { console.error(a) }, g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"]; "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty) }(window), function (a) { function b(a) { "function" == typeof a && (b.isReady ? a() : g.push(a)) } function c(a) { var c = "readystatechange" === a.type && "complete" !== f.readyState; b.isReady || c || d() } function d() { b.isReady = !0; for (var a = 0, c = g.length; c > a; a++) { var d = g[a]; d() } } function e(e) { return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b } var f = a.document, g = []; b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie) }(window), function (a) { function b(a, b) { return a[g](b) } function c(a) { if (!a.parentNode) { var b = document.createDocumentFragment(); b.appendChild(a) } } function d(a, b) { c(a); for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++) if (d[e] === a) return !0; return !1 } function e(a, d) { return c(a), b(a, d) } var f, g = function () { if (a.matches) return "matches"; if (a.matchesSelector) return "matchesSelector"; for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) { var e = b[c], f = e + "MatchesSelector"; if (a[f]) return f } }(); if (g) { var h = document.createElement("div"), i = b(h, "div"); f = i ? b : e } else f = d; "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function () { return f }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f }(Element.prototype), function (a, b) { "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function (c, d) { return b(a, c, d) }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector) }(window, function (a, b, c) { var d = {}; d.extend = function (a, b) { for (var c in b) a[c] = b[c]; return a }, d.modulo = function (a, b) { return (a % b + b) % b }; var e = Object.prototype.toString; d.isArray = function (a) { return "[object Array]" == e.call(a) }, d.makeArray = function (a) { var b = []; if (d.isArray(a)) b = a; else if (a && "number" == typeof a.length) for (var c = 0, e = a.length; e > c; c++) b.push(a[c]); else b.push(a); return b }, d.indexOf = Array.prototype.indexOf ? function (a, b) { return a.indexOf(b) } : function (a, b) { for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c; return -1 }, d.removeFrom = function (a, b) { var c = d.indexOf(a, b); -1 != c && a.splice(c, 1) }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function (a) { return a instanceof HTMLElement } : function (a) { return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName }, d.setText = function () { function a(a, c) { b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c } var b; return a }(), d.getParent = function (a, b) { for (; a != document.body;) if (a = a.parentNode, c(a, b)) return a }, d.getQueryElement = function (a) { return "string" == typeof a ? document.querySelector(a) : a }, d.handleEvent = function (a) { var b = "on" + a.type; this[b] && this[b](a) }, d.filterFindElements = function (a, b) { a = d.makeArray(a); for (var e = [], f = 0, g = a.length; g > f; f++) { var h = a[f]; if (d.isElement(h)) if (b) { c(h, b) && e.push(h); for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j]) } else e.push(h) } return e }, d.debounceMethod = function (a, b, c) { var d = a.prototype[b], e = b + "Timeout"; a.prototype[b] = function () { var a = this[e]; a && clearTimeout(a); var b = arguments, f = this; this[e] = setTimeout(function () { d.apply(f, b), delete f[e] }, c || 100) } }, d.toDashed = function (a) { return a.replace(/(.)([A-Z])/g, function (a, b, c) { return b + "-" + c }).toLowerCase() }; var f = a.console; return d.htmlInit = function (c, e) { b(function () { for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) { var k, l = g[i], m = l.getAttribute(h); try { k = m && JSON.parse(m) } catch (n) { f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + n); continue } var o = new c(l, k), p = a.jQuery; p && p.data(l, e, o) } }) }, d }), function (a, b) { "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function (c, d, e, f) { return b(a, c, d, e, f) }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils)) }(window, function (a, b, c, d, e) { function f(a) { for (var b in a) return !1; return b = null, !0 } function g(a, b) { a && (this.element = a, this.layout = b, this.position = { x: 0, y: 0 }, this._create()) } function h(a) { return a.replace(/([A-Z])/g, function (a) { return "-" + a.toLowerCase() }) } var i = a.getComputedStyle, j = i ? function (a) { return i(a, null) } : function (a) { return a.currentStyle }, k = d("transition"), l = d("transform"), m = k && l, n = !!d("perspective"), o = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "otransitionend", transition: "transitionend" }[k], p = ["transform", "transition", "transitionDuration", "transitionProperty"], q = function () { for (var a = {}, b = 0, c = p.length; c > b; b++) { var e = p[b], f = d(e); f && f !== e && (a[e] = f) } return a }(); e.extend(g.prototype, b.prototype), g.prototype._create = function () { this._transn = { ingProperties: {}, clean: {}, onEnd: {} }, this.css({ position: "absolute" }) }, g.prototype.handleEvent = function (a) { var b = "on" + a.type; this[b] && this[b](a) }, g.prototype.getSize = function () { this.size = c(this.element) }, g.prototype.css = function (a) { var b = this.element.style; for (var c in a) { var d = q[c] || c; b[d] = a[c] } }, g.prototype.getPosition = function () { var a = j(this.element), b = this.layout.options, c = b.isOriginLeft, d = b.isOriginTop, e = a[c ? "left" : "right"], f = a[d ? "top" : "bottom"], g = this.layout.size, h = -1 != e.indexOf("%") ? parseFloat(e) / 100 * g.width : parseInt(e, 10), i = -1 != f.indexOf("%") ? parseFloat(f) / 100 * g.height : parseInt(f, 10); h = isNaN(h) ? 0 : h, i = isNaN(i) ? 0 : i, h -= c ? g.paddingLeft : g.paddingRight, i -= d ? g.paddingTop : g.paddingBottom, this.position.x = h, this.position.y = i }, g.prototype.layoutPosition = function () { var a = this.layout.size, b = this.layout.options, c = {}, d = b.isOriginLeft ? "paddingLeft" : "paddingRight", e = b.isOriginLeft ? "left" : "right", f = b.isOriginLeft ? "right" : "left", g = this.position.x + a[d]; c[e] = this.getXValue(g), c[f] = ""; var h = b.isOriginTop ? "paddingTop" : "paddingBottom", i = b.isOriginTop ? "top" : "bottom", j = b.isOriginTop ? "bottom" : "top", k = this.position.y + a[h]; c[i] = this.getYValue(k), c[j] = "", this.css(c), this.emitEvent("layout", [this]) }, g.prototype.getXValue = function (a) { var b = this.layout.options; return b.percentPosition && !b.isHorizontal ? a / this.layout.size.width * 100 + "%" : a + "px" }, g.prototype.getYValue = function (a) { var b = this.layout.options; return b.percentPosition && b.isHorizontal ? a / this.layout.size.height * 100 + "%" : a + "px" }, g.prototype._transitionTo = function (a, b) { this.getPosition(); var c = this.position.x, d = this.position.y, e = parseInt(a, 10), f = parseInt(b, 10), g = e === this.position.x && f === this.position.y; if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition(); var h = a - c, i = b - d, j = {}; j.transform = this.getTranslate(h, i), this.transition({ to: j, onTransitionEnd: { transform: this.layoutPosition }, isCleaning: !0 }) }, g.prototype.getTranslate = function (a, b) { var c = this.layout.options; return a = c.isOriginLeft ? a : -a, b = c.isOriginTop ? b : -b, n ? "translate3d(" + a + "px, " + b + "px, 0)" : "translate(" + a + "px, " + b + "px)" }, g.prototype.goTo = function (a, b) { this.setPosition(a, b), this.layoutPosition() }, g.prototype.moveTo = m ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function (a, b) { this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10) }, g.prototype._nonTransition = function (a) { this.css(a.to), a.isCleaning && this._removeStyles(a.to); for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this) }, g.prototype._transition = function (a) { if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a); var b = this._transn; for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c]; for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0); if (a.from) { this.css(a.from); var d = this.element.offsetHeight; d = null } this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0 }; var r = "opacity," + h(q.transform || "transform"); g.prototype.enableTransition = function () { this.isTransitioning || (this.css({ transitionProperty: r, transitionDuration: this.layout.options.transitionDuration }), this.element.addEventListener(o, this, !1)) }, g.prototype.transition = g.prototype[k ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function (a) { this.ontransitionend(a) }, g.prototype.onotransitionend = function (a) { this.ontransitionend(a) }; var s = { "-webkit-transform": "transform", "-moz-transform": "transform", "-o-transform": "transform" }; g.prototype.ontransitionend = function (a) { if (a.target === this.element) { var b = this._transn, c = s[a.propertyName] || a.propertyName; if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) { var d = b.onEnd[c]; d.call(this), delete b.onEnd[c] } this.emitEvent("transitionEnd", [this]) } }, g.prototype.disableTransition = function () { this.removeTransitionStyles(), this.element.removeEventListener(o, this, !1), this.isTransitioning = !1 }, g.prototype._removeStyles = function (a) { var b = {}; for (var c in a) b[c] = ""; this.css(b) }; var t = { transitionProperty: "", transitionDuration: "" }; return g.prototype.removeTransitionStyles = function () { this.css(t) }, g.prototype.removeElem = function () { this.element.parentNode.removeChild(this.element), this.css({ display: "" }), this.emitEvent("remove", [this]) }, g.prototype.remove = function () { if (!k || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem(); var a = this; this.once("transitionEnd", function () { a.removeElem() }), this.hide() }, g.prototype.reveal = function () { delete this.isHidden, this.css({ display: "" }); var a = this.layout.options, b = {}, c = this.getHideRevealTransitionEndProperty("visibleStyle"); b[c] = this.onRevealTransitionEnd, this.transition({ from: a.hiddenStyle, to: a.visibleStyle, isCleaning: !0, onTransitionEnd: b }) }, g.prototype.onRevealTransitionEnd = function () { this.isHidden || this.emitEvent("reveal") }, g.prototype.getHideRevealTransitionEndProperty = function (a) { var b = this.layout.options[a]; if (b.opacity) return "opacity"; for (var c in b) return c }, g.prototype.hide = function () { this.isHidden = !0, this.css({ display: "" }); var a = this.layout.options, b = {}, c = this.getHideRevealTransitionEndProperty("hiddenStyle"); b[c] = this.onHideTransitionEnd, this.transition({ from: a.visibleStyle, to: a.hiddenStyle, isCleaning: !0, onTransitionEnd: b }) }, g.prototype.onHideTransitionEnd = function () { this.isHidden && (this.css({ display: "none" }), this.emitEvent("hide")) }, g.prototype.destroy = function () { this.css({ position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: "" }) }, g }), function (a, b) { "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function (c, d, e, f, g) { return b(a, c, d, e, f, g) }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item) }(window, function (a, b, c, d, e, f) { function g(a, b) { var c = e.getQueryElement(a); if (!c) return void (h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a))); this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b); var d = ++k; this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout() } var h = a.console, i = a.jQuery, j = function () { }, k = 0, l = {}; return g.namespace = "outlayer", g.Item = f, g.defaults = { containerStyle: { position: "relative" }, isInitLayout: !0, isOriginLeft: !0, isOriginTop: !0, isResizeBound: !0, isResizingContainer: !0, transitionDuration: "0.4s", hiddenStyle: { opacity: 0, transform: "scale(0.001)" }, visibleStyle: { opacity: 1, transform: "scale(1)" } }, e.extend(g.prototype, c.prototype), g.prototype.option = function (a) { e.extend(this.options, a) }, g.prototype._create = function () { this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize() }, g.prototype.reloadItems = function () { this.items = this._itemize(this.element.children) }, g.prototype._itemize = function (a) { for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) { var g = b[e], h = new c(g, this); d.push(h) } return d }, g.prototype._filterFindItemElements = function (a) { return e.filterFindElements(a, this.options.itemSelector) }, g.prototype.getItemElements = function () { for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element); return a }, g.prototype.layout = function () { this._resetLayout(), this._manageStamps(); var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited; this.layoutItems(this.items, a), this._isLayoutInited = !0 }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function () { this.getSize() }, g.prototype.getSize = function () { this.size = d(this.element) }, g.prototype._getMeasurement = function (a, b) { var c, f = this.options[a]; f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0 }, g.prototype.layoutItems = function (a, b) { a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout() }, g.prototype._getItemsForLayout = function (a) { for (var b = [], c = 0, d = a.length; d > c; c++) { var e = a[c]; e.isIgnored || b.push(e) } return b }, g.prototype._layoutItems = function (a, b) { if (this._emitCompleteOnItems("layout", a), a && a.length) { for (var c = [], d = 0, e = a.length; e > d; d++) { var f = a[d], g = this._getItemLayoutPosition(f); g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g) } this._processLayoutQueue(c) } }, g.prototype._getItemLayoutPosition = function () { return { x: 0, y: 0 } }, g.prototype._processLayoutQueue = function (a) { for (var b = 0, c = a.length; c > b; b++) { var d = a[b]; this._positionItem(d.item, d.x, d.y, d.isInstant) } }, g.prototype._positionItem = function (a, b, c, d) { d ? a.goTo(b, c) : a.moveTo(b, c) }, g.prototype._postLayout = function () { this.resizeContainer() }, g.prototype.resizeContainer = function () { if (this.options.isResizingContainer) { var a = this._getContainerSize(); a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1)) } }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function (a, b) { if (void 0 !== a) { var c = this.size; c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px" } }, g.prototype._emitCompleteOnItems = function (a, b) { function c() { e.dispatchEvent(a + "Complete", null, [b]) } function d() { g++, g === f && c() } var e = this, f = b.length; if (!b || !f) return void c(); for (var g = 0, h = 0, i = b.length; i > h; h++) { var j = b[h]; j.once(a, d) } }, g.prototype.dispatchEvent = function (a, b, c) { var d = b ? [b].concat(c) : c; if (this.emitEvent(a, d), i) if (this.$element = this.$element || i(this.element), b) { var e = i.Event(b); e.type = a, this.$element.trigger(e, c) } else this.$element.trigger(a, c) }, g.prototype.ignore = function (a) { var b = this.getItem(a); b && (b.isIgnored = !0) }, g.prototype.unignore = function (a) { var b = this.getItem(a); b && delete b.isIgnored }, g.prototype.stamp = function (a) { if (a = this._find(a)) { this.stamps = this.stamps.concat(a); for (var b = 0, c = a.length; c > b; b++) { var d = a[b]; this.ignore(d) } } }, g.prototype.unstamp = function (a) { if (a = this._find(a)) for (var b = 0, c = a.length; c > b; b++) { var d = a[b]; e.removeFrom(this.stamps, d), this.unignore(d) } }, g.prototype._find = function (a) { return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0 }, g.prototype._manageStamps = function () { if (this.stamps && this.stamps.length) { this._getBoundingRect(); for (var a = 0, b = this.stamps.length; b > a; a++) { var c = this.stamps[a]; this._manageStamp(c) } } }, g.prototype._getBoundingRect = function () { var a = this.element.getBoundingClientRect(), b = this.size; this._boundingRect = { left: a.left + b.paddingLeft + b.borderLeftWidth, top: a.top + b.paddingTop + b.borderTopWidth, right: a.right - (b.paddingRight + b.borderRightWidth), bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth) } }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function (a) { var b = a.getBoundingClientRect(), c = this._boundingRect, e = d(a), f = { left: b.left - c.left - e.marginLeft, top: b.top - c.top - e.marginTop, right: c.right - b.right - e.marginRight, bottom: c.bottom - b.bottom - e.marginBottom }; return f }, g.prototype.handleEvent = function (a) { var b = "on" + a.type; this[b] && this[b](a) }, g.prototype.bindResize = function () { this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0) }, g.prototype.unbindResize = function () { this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1 }, g.prototype.onresize = function () { function a() { b.resize(), delete b.resizeTimeout } this.resizeTimeout && clearTimeout(this.resizeTimeout); var b = this; this.resizeTimeout = setTimeout(a, 100) }, g.prototype.resize = function () { this.isResizeBound && this.needsResizeLayout() && this.layout() }, g.prototype.needsResizeLayout = function () { var a = d(this.element), b = this.size && a; return b && a.innerWidth !== this.size.innerWidth }, g.prototype.addItems = function (a) { var b = this._itemize(a); return b.length && (this.items = this.items.concat(b)), b }, g.prototype.appended = function (a) { var b = this.addItems(a); b.length && (this.layoutItems(b, !0), this.reveal(b)) }, g.prototype.prepended = function (a) { var b = this._itemize(a); if (b.length) { var c = this.items.slice(0); this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c) } }, g.prototype.reveal = function (a) { this._emitCompleteOnItems("reveal", a); for (var b = a && a.length, c = 0; b && b > c; c++) { var d = a[c]; d.reveal() } }, g.prototype.hide = function (a) { this._emitCompleteOnItems("hide", a); for (var b = a && a.length, c = 0; b && b > c; c++) { var d = a[c]; d.hide() } }, g.prototype.revealItemElements = function (a) { var b = this.getItems(a); this.reveal(b) }, g.prototype.hideItemElements = function (a) { var b = this.getItems(a); this.hide(b) }, g.prototype.getItem = function (a) { for (var b = 0, c = this.items.length; c > b; b++) { var d = this.items[b]; if (d.element === a) return d } }, g.prototype.getItems = function (a) { a = e.makeArray(a); for (var b = [], c = 0, d = a.length; d > c; c++) { var f = a[c], g = this.getItem(f); g && b.push(g) } return b }, g.prototype.remove = function (a) { var b = this.getItems(a); if (this._emitCompleteOnItems("remove", b), b && b.length) for (var c = 0, d = b.length; d > c; c++) { var f = b[c]; f.remove(), e.removeFrom(this.items, f) } }, g.prototype.destroy = function () { var a = this.element.style; a.height = "", a.position = "", a.width = ""; for (var b = 0, c = this.items.length; c > b; b++) { var d = this.items[b]; d.destroy() } this.unbindResize(); var e = this.element.outlayerGUID; delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace) }, g.data = function (a) { a = e.getQueryElement(a); var b = a && a.outlayerGUID; return b && l[b] }, g.create = function (a, b) { function c() { g.apply(this, arguments) } return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function () { f.apply(this, arguments) }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c }, g.Item = f, g }), function (a, b) { "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils) }(window, function (a, b, c) { var d = a.create("masonry"); return d.prototype._resetLayout = function () { this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(); var a = this.cols; for (this.colYs = []; a--;) this.colYs.push(0); this.maxY = 0 }, d.prototype.measureColumns = function () { if (this.getContainerWidth(), !this.columnWidth) { var a = this.items[0], c = a && a.element; this.columnWidth = c && b(c).outerWidth || this.containerWidth } var d = this.columnWidth += this.gutter, e = this.containerWidth + this.gutter, f = e / d, g = d - e % d, h = g && 1 > g ? "round" : "floor"; f = Math[h](f), this.cols = Math.max(f, 1) }, d.prototype.getContainerWidth = function () { var a = this.options.isFitWidth ? this.element.parentNode : this.element, c = b(a); this.containerWidth = c && c.innerWidth }, d.prototype._getItemLayoutPosition = function (a) { a.getSize(); var b = a.size.outerWidth % this.columnWidth, d = b && 1 > b ? "round" : "ceil", e = Math[d](a.size.outerWidth / this.columnWidth); e = Math.min(e, this.cols); for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = { x: this.columnWidth * h, y: g }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j; return i }, d.prototype._getColGroup = function (a) { if (2 > a) return this.colYs; for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) { var e = this.colYs.slice(d, d + a); b[d] = Math.max.apply(Math, e) } return b }, d.prototype._manageStamp = function (a) { var c = b(a), d = this._getElementOffset(a), e = this.options.isOriginLeft ? d.left : d.right, f = e + c.outerWidth, g = Math.floor(e / this.columnWidth); g = Math.max(0, g); var h = Math.floor(f / this.columnWidth); h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h); for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j]) }, d.prototype._getContainerSize = function () { this.maxY = Math.max.apply(Math, this.colYs); var a = { height: this.maxY }; return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a }, d.prototype._getContainerFitWidth = function () { for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++; return (this.cols - a) * this.columnWidth - this.gutter }, d.prototype.needsResizeLayout = function () { var a = this.containerWidth; return this.getContainerWidth(), a !== this.containerWidth }, d });

/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function () { function e() { } function t(e, t) { for (var n = e.length; n--;) if (e[n].listener === t) return n; return -1 } function n(e) { return function () { return this[e].apply(this, arguments) } } var i = e.prototype, r = this, o = r.EventEmitter; i.getListeners = function (e) { var t, n, i = this._getEvents(); if ("object" == typeof e) { t = {}; for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n]) } else t = i[e] || (i[e] = []); return t }, i.flattenListeners = function (e) { var t, n = []; for (t = 0; e.length > t; t += 1) n.push(e[t].listener); return n }, i.getListenersAsObject = function (e) { var t, n = this.getListeners(e); return n instanceof Array && (t = {}, t[e] = n), t || n }, i.addListener = function (e, n) { var i, r = this.getListenersAsObject(e), o = "object" == typeof n; for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : { listener: n, once: !1 }); return this }, i.on = n("addListener"), i.addOnceListener = function (e, t) { return this.addListener(e, { listener: t, once: !0 }) }, i.once = n("addOnceListener"), i.defineEvent = function (e) { return this.getListeners(e), this }, i.defineEvents = function (e) { for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]); return this }, i.removeListener = function (e, n) { var i, r, o = this.getListenersAsObject(e); for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1)); return this }, i.off = n("removeListener"), i.addListeners = function (e, t) { return this.manipulateListeners(!1, e, t) }, i.removeListeners = function (e, t) { return this.manipulateListeners(!0, e, t) }, i.manipulateListeners = function (e, t, n) { var i, r, o = e ? this.removeListener : this.addListener, s = e ? this.removeListeners : this.addListeners; if ("object" != typeof t || t instanceof RegExp) for (i = n.length; i--;) o.call(this, t, n[i]); else for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r)); return this }, i.removeEvent = function (e) { var t, n = typeof e, i = this._getEvents(); if ("string" === n) delete i[e]; else if ("object" === n) for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t]; else delete this._events; return this }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function (e, t) { var n, i, r, o, s = this.getListenersAsObject(e); for (r in s) if (s.hasOwnProperty(r)) for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener); return this }, i.trigger = n("emitEvent"), i.emit = function (e) { var t = Array.prototype.slice.call(arguments, 1); return this.emitEvent(e, t) }, i.setOnceReturnValue = function (e) { return this._onceReturnValue = e, this }, i._getOnceReturnValue = function () { return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0 }, i._getEvents = function () { return this._events || (this._events = {}) }, e.noConflict = function () { return r.EventEmitter = o, e }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () { return e }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e }).call(this), function (e) { function t(t) { var n = e.event; return n.target = n.target || n.srcElement || t, n } var n = document.documentElement, i = function () { }; n.addEventListener ? i = function (e, t, n) { e.addEventListener(t, n, !1) } : n.attachEvent && (i = function (e, n, i) { e[n + i] = i.handleEvent ? function () { var n = t(e); i.handleEvent.call(i, n) } : function () { var n = t(e); i.call(e, n) }, e.attachEvent("on" + n, e[n + i]) }); var r = function () { }; n.removeEventListener ? r = function (e, t, n) { e.removeEventListener(t, n, !1) } : n.detachEvent && (r = function (e, t, n) { e.detachEvent("on" + t, e[t + n]); try { delete e[t + n] } catch (i) { e[t + n] = void 0 } }); var o = { bind: i, unbind: r }; "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o }(this), function (e, t) { "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function (n, i) { return t(e, n, i) }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie) }(window, function (e, t, n) { function i(e, t) { for (var n in t) e[n] = t[n]; return e } function r(e) { return "[object Array]" === d.call(e) } function o(e) { var t = []; if (r(e)) t = e; else if ("number" == typeof e.length) for (var n = 0, i = e.length; i > n; n++) t.push(e[n]); else t.push(e); return t } function s(e, t, n) { if (!(this instanceof s)) return new s(e, t); "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred); var r = this; setTimeout(function () { r.check() }) } function f(e) { this.img = e } function c(e) { this.src = e, v[e] = this } var a = e.jQuery, u = e.console, h = u !== void 0, d = Object.prototype.toString; s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function () { this.images = []; for (var e = 0, t = this.elements.length; t > e; e++) { var n = this.elements[e]; "IMG" === n.nodeName && this.addImage(n); var i = n.nodeType; if (i && (1 === i || 9 === i || 11 === i)) for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) { var f = r[o]; this.addImage(f) } } }, s.prototype.addImage = function (e) { var t = new f(e); this.images.push(t) }, s.prototype.check = function () { function e(e, r) { return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0 } var t = this, n = 0, i = this.images.length; if (this.hasAnyBroken = !1, !i) return this.complete(), void 0; for (var r = 0; i > r; r++) { var o = this.images[r]; o.on("confirm", e), o.check() } }, s.prototype.progress = function (e) { this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded; var t = this; setTimeout(function () { t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e) }) }, s.prototype.complete = function () { var e = this.hasAnyBroken ? "fail" : "done"; this.isComplete = !0; var t = this; setTimeout(function () { if (t.emit(e, t), t.emit("always", t), t.jqDeferred) { var n = t.hasAnyBroken ? "reject" : "resolve"; t.jqDeferred[n](t) } }) }, a && (a.fn.imagesLoaded = function (e, t) { var n = new s(this, e, t); return n.jqDeferred.promise(a(this)) }), f.prototype = new t, f.prototype.check = function () { var e = v[this.img.src] || new c(this.img.src); if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"), void 0; if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0; var t = this; e.on("confirm", function (e, n) { return t.confirm(e.isLoaded, n), !0 }), e.check() }, f.prototype.confirm = function (e, t) { this.isLoaded = e, this.emit("confirm", this, t) }; var v = {}; return c.prototype = new t, c.prototype.check = function () { if (!this.isChecked) { var e = new Image; n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0 } }, c.prototype.handleEvent = function (e) { var t = "on" + e.type; this[t] && this[t](e) }, c.prototype.onload = function (e) { this.confirm(!0, "onload"), this.unbindProxyEvents(e) }, c.prototype.onerror = function (e) { this.confirm(!1, "onerror"), this.unbindProxyEvents(e) }, c.prototype.confirm = function (e, t) { this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t) }, c.prototype.unbindProxyEvents = function (e) { n.unbind(e.target, "load", this), n.unbind(e.target, "error", this) }, s });

/* BBC comScore Analytics Script */
// <![CDATA[
function udm_(e) { var t = "comScore=", n = document, r = n.cookie, i = "", s = "indexOf", o = "substring", u = "length", a = 2048, f, l = "&ns_", c = "&", h, p, d, v, m = window, g = m.encodeURIComponent || escape; if (r[s](t) + 1) for (d = 0, p = r.split(";"), v = p[u]; d < v; d++) h = p[d][s](t), h + 1 && (i = c + unescape(p[d][o](h + t[u]))); e += l + "_t=" + +(new Date) + l + "c=" + (n.characterSet || n.defaultCharset || "") + "&c8=" + g(n.title) + i + "&c7=" + g(n.URL) + "&c9=" + g(n.referrer), e[u] > a && e[s](c) > 0 && (f = e[o](0, a - 8).lastIndexOf(c), e = (e[o](0, f) + l + "cut=" + g(e[o](f + 1)))[o](0, a)), n.images ? (h = new Image, m.ns_p || (ns_p = h), h.src = e) : n.write("<", "p", "><", 'img src="', e, '" height="1" width="1" alt="*"', "><", "/p", ">") };
// ]]>


;/*! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function () {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style = document.createElement('style'),
			script = document.getElementsByTagName('script')[0],
			info = null;

        style.type = 'text/css';
        style.id = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function (media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function (media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function (w, doc, image) {
    // Enable strict mode
    "use strict";

    function expose(picturefill) {
        /* expose picturefill */
        if (typeof module === "object" && typeof module.exports === "object") {
            // CommonJS, just export
            module.exports = picturefill;
        } else if (typeof define === "function" && define.amd) {
            // AMD support
            define("picturefill", function () { return picturefill; });
        }
        if (typeof w === "object") {
            // If no AMD and we are in the browser, attach to window
            w.picturefill = picturefill;
        }
    }

    // If picture is supported, well, that's awesome. Let's get outta here...
    if (w.HTMLPictureElement) {
        expose(function () { });
        return;
    }

    // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
    doc.createElement("picture");

    // local object for method references and testing exposure
    var pf = w.picturefill || {};

    var regWDesc = /\s+\+?\d+(e\d+)?w/;

    // namespace
    pf.ns = "picturefill";

    // srcset support test
    (function () {
        pf.srcsetSupported = "srcset" in image;
        pf.sizesSupported = "sizes" in image;
        pf.curSrcSupported = "currentSrc" in image;
    })();

    // just a string trim workaround
    pf.trim = function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    };

    /**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */
    pf.makeUrl = (function () {
        var anchor = doc.createElement("a");
        return function (src) {
            anchor.href = src;
            return anchor.href;
        };
    })();

    /**
	 * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
    pf.restrictsMixedContent = function () {
        return w.location.protocol === "https:";
    };
    /**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 */

    pf.matchesMedia = function (media) {
        return w.matchMedia && w.matchMedia(media).matches;
    };

    // Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
    pf.getDpr = function () {
        return (w.devicePixelRatio || 1);
    };

    /**
	 * Get width in css pixel value from a "length" value
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 */
    pf.getWidthFromLength = function (length) {
        var cssValue;
        // If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, abort.
        if (!(length && length.indexOf("%") > -1 === false && (parseFloat(length) > 0 || length.indexOf("calc(") > -1))) {
            return false;
        }

        /**
		 * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
		 * is injected at the top of the document.
		 *
		 * TODO: maybe we should put this behind a feature test for `vw`? The risk of doing this is possible browser inconsistancies with vw vs %
		 */
        length = length.replace("vw", "%");

        // Create a cached element for getting length value widths
        if (!pf.lengthEl) {
            pf.lengthEl = doc.createElement("div");

            // Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
            pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";

            // Add a class, so that everyone knows where this element comes from
            pf.lengthEl.className = "helper-from-picturefill-js";
        }

        pf.lengthEl.style.width = "0px";

        try {
            pf.lengthEl.style.width = length;
        } catch (e) { }

        doc.body.appendChild(pf.lengthEl);

        cssValue = pf.lengthEl.offsetWidth;

        if (cssValue <= 0) {
            cssValue = false;
        }

        doc.body.removeChild(pf.lengthEl);

        return cssValue;
    };

    pf.detectTypeSupport = function (type, typeUri) {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var image = new w.Image();
        image.onerror = function () {
            pf.types[type] = false;
            picturefill();
        };
        image.onload = function () {
            pf.types[type] = image.width === 1;
            picturefill();
        };
        image.src = typeUri;

        return "pending";
    };
    // container of supported mime types that one might need to qualify before using
    pf.types = pf.types || {};

    pf.initTypeDetects = function () {
        // Add support for standard mime types
        pf.types["image/jpeg"] = true;
        pf.types["image/gif"] = true;
        pf.types["image/png"] = true;
        pf.types["image/svg+xml"] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        pf.types["image/webp"] = pf.detectTypeSupport("image/webp", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=");
    };

    pf.verifyTypeSupport = function (source) {
        var type = source.getAttribute("type");
        // if type attribute exists, return test result, otherwise return true
        if (type === null || type === "") {
            return true;
        } else {
            var pfType = pf.types[type];
            // if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
            if (typeof pfType === "string" && pfType !== "pending") {
                pf.types[type] = pf.detectTypeSupport(type, pfType);
                return "pending";
            } else if (typeof pfType === "function") {
                pfType();
                return "pending";
            } else {
                return pfType;
            }
        }
    };

    // Parses an individual `size` and returns the length, and optional media query
    pf.parseSize = function (sourceSizeStr) {
        var match = /(\([^)]+\))?\s*(.+)/g.exec(sourceSizeStr);
        return {
            media: match && match[1],
            length: match && match[2]
        };
    };

    // Takes a string of sizes and returns the width in pixels as a number
    pf.findWidthFromSourceSize = function (sourceSizeListStr) {
        // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
        //                            or (min-width:30em) calc(30% - 15px)
        var sourceSizeList = pf.trim(sourceSizeListStr).split(/\s*,\s*/),
			winningLength;

        for (var i = 0, len = sourceSizeList.length; i < len; i++) {
            // Match <media-condition>? length, ie ( min-width: 50em ) 100%
            var sourceSize = sourceSizeList[i],
				// Split "( min-width: 50em ) 100%" into separate strings
				parsedSize = pf.parseSize(sourceSize),
				length = parsedSize.length,
				media = parsedSize.media;

            if (!length) {
                continue;
            }
            // if there is no media query or it matches, choose this as our winning length
            if ((!media || pf.matchesMedia(media)) &&
                // pass the length to a method that can properly determine length
                // in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
				(winningLength = pf.getWidthFromLength(length))) {
                break;
            }
        }

        //if we have no winningLength fallback to 100vw
        return winningLength || Math.max(w.innerWidth || 0, doc.documentElement.clientWidth);
    };

    pf.parseSrcset = function (srcset) {
        /**
		 * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
		 * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
		 *
		 * 1. Let input (`srcset`) be the value passed to this algorithm.
		 * 2. Let position be a pointer into input, initially pointing at the start of the string.
		 * 3. Let raw candidates be an initially empty ordered list of URLs with associated
		 *    unparsed descriptors. The order of entries in the list is the order in which entries
		 *    are added to the list.
		 */
        var candidates = [];

        while (srcset !== "") {
            srcset = srcset.replace(/^\s+/g, "");

            // 5. Collect a sequence of characters that are not space characters, and let that be url.
            var pos = srcset.search(/\s/g),
				url, descriptor = null;

            if (pos !== -1) {
                url = srcset.slice(0, pos);

                var last = url.slice(-1);

                // 6. If url ends with a U+002C COMMA character (,), remove that character from url
                // and let descriptors be the empty string. Otherwise, follow these substeps
                // 6.1. If url is empty, then jump to the step labeled descriptor parser.

                if (last === "," || url === "") {
                    url = url.replace(/,+$/, "");
                    descriptor = "";
                }
                srcset = srcset.slice(pos + 1);

                // 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
                // let that be descriptors.
                if (descriptor === null) {
                    var descpos = srcset.indexOf(",");
                    if (descpos !== -1) {
                        descriptor = srcset.slice(0, descpos);
                        srcset = srcset.slice(descpos + 1);
                    } else {
                        descriptor = srcset;
                        srcset = "";
                    }
                }
            } else {
                url = srcset;
                srcset = "";
            }

            // 7. Add url to raw candidates, associated with descriptors.
            if (url || descriptor) {
                candidates.push({
                    url: url,
                    descriptor: descriptor
                });
            }
        }
        return candidates;
    };

    pf.parseDescriptor = function (descriptor, sizesattr) {
        // 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
        // is the order in which entries are added to the list.
        var sizes = sizesattr || "100vw",
			sizeDescriptor = descriptor && descriptor.replace(/(^\s+|\s+$)/g, ""),
			widthInCssPixels = pf.findWidthFromSourceSize(sizes),
			resCandidate;

        if (sizeDescriptor) {
            var splitDescriptor = sizeDescriptor.split(" ");

            for (var i = splitDescriptor.length - 1; i >= 0; i--) {
                var curr = splitDescriptor[i],
                    lastchar = curr && curr.slice(curr.length - 1);

                if ((lastchar === "h" || lastchar === "w") && !pf.sizesSupported) {
                    resCandidate = parseFloat((parseInt(curr, 10) / widthInCssPixels));
                } else if (lastchar === "x") {
                    var res = curr && parseFloat(curr, 10);
                    resCandidate = res && !isNaN(res) ? res : 1;
                }
            }
        }
        return resCandidate || 1;
    };

    /**
	 * Takes a srcset in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, resolution is calculated
	 */
    pf.getCandidatesFromSourceSet = function (srcset, sizes) {
        var candidates = pf.parseSrcset(srcset),
			formattedCandidates = [];

        for (var i = 0, len = candidates.length; i < len; i++) {
            var candidate = candidates[i];

            formattedCandidates.push({
                url: candidate.url,
                resolution: pf.parseDescriptor(candidate.descriptor, sizes)
            });
        }
        return formattedCandidates;
    };

    /**
	 * if it's an img element and it has a srcset property,
	 * we need to remove the attribute so we can manipulate src
	 * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
	 * this moves srcset's value to memory for later use and removes the attr
	 */
    pf.dodgeSrcset = function (img) {
        if (img.srcset) {
            img[pf.ns].srcset = img.srcset;
            img.srcset = "";
            img.setAttribute("data-pfsrcset", img[pf.ns].srcset);
        }
    };

    // Accept a source or img element and process its srcset and sizes attrs
    pf.processSourceSet = function (el) {
        var srcset = el.getAttribute("srcset"),
			sizes = el.getAttribute("sizes"),
			candidates = [];

        // if it's an img element, use the cached srcset property (defined or not)
        if (el.nodeName.toUpperCase() === "IMG" && el[pf.ns] && el[pf.ns].srcset) {
            srcset = el[pf.ns].srcset;
        }

        if (srcset) {
            candidates = pf.getCandidatesFromSourceSet(srcset, sizes);
        }
        return candidates;
    };

    pf.backfaceVisibilityFix = function (picImg) {
        // See: https://github.com/scottjehl/picturefill/issues/332
        var style = picImg.style || {},
			WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
			currentZoom = style.zoom;

        if (WebkitBackfaceVisibility) {
            style.zoom = ".999";

            WebkitBackfaceVisibility = picImg.offsetWidth;

            style.zoom = currentZoom;
        }
    };

    pf.setIntrinsicSize = (function () {
        var urlCache = {};
        var setSize = function (picImg, width, res) {
            if (width) {
                picImg.setAttribute("width", parseInt(width / res, 10));
            }
        };
        return function (picImg, bestCandidate) {
            var img;
            if (!picImg[pf.ns] || w.pfStopIntrinsicSize) {
                return;
            }
            if (picImg[pf.ns].dims === undefined) {
                picImg[pf.ns].dims = picImg.getAttribute("width") || picImg.getAttribute("height");
            }
            if (picImg[pf.ns].dims) { return; }

            if (bestCandidate.url in urlCache) {
                setSize(picImg, urlCache[bestCandidate.url], bestCandidate.resolution);
            } else {
                img = doc.createElement("img");
                img.onload = function () {
                    urlCache[bestCandidate.url] = img.width;

                    //IE 10/11 don't calculate width for svg outside document
                    if (!urlCache[bestCandidate.url]) {
                        try {
                            doc.body.appendChild(img);
                            urlCache[bestCandidate.url] = img.width || img.offsetWidth;
                            doc.body.removeChild(img);
                        } catch (e) { }
                    }

                    if (picImg.src === bestCandidate.url) {
                        setSize(picImg, urlCache[bestCandidate.url], bestCandidate.resolution);
                    }
                    picImg = null;
                    img.onload = null;
                    img = null;
                };
                img.src = bestCandidate.url;
            }
        };
    })();

    pf.applyBestCandidate = function (candidates, picImg) {
        var candidate,
			length,
			bestCandidate;

        candidates.sort(pf.ascendingSort);

        length = candidates.length;
        bestCandidate = candidates[length - 1];

        for (var i = 0; i < length; i++) {
            candidate = candidates[i];
            if (candidate.resolution >= pf.getDpr()) {
                bestCandidate = candidate;
                break;
            }
        }

        if (bestCandidate) {

            bestCandidate.url = pf.makeUrl(bestCandidate.url);

            if (picImg.src !== bestCandidate.url) {
                if (pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:") {
                    if (window.console !== undefined) {
                        console.warn("Blocked mixed content image " + bestCandidate.url);
                    }
                } else {
                    picImg.src = bestCandidate.url;
                    // currentSrc attribute and property to match
                    // http://picture.responsiveimages.org/#the-img-element
                    if (!pf.curSrcSupported) {
                        picImg.currentSrc = picImg.src;
                    }

                    pf.backfaceVisibilityFix(picImg);
                }
            }

            pf.setIntrinsicSize(picImg, bestCandidate);
        }
    };

    pf.ascendingSort = function (a, b) {
        return a.resolution - b.resolution;
    };

    /**
	 * In IE9, <source> elements get removed if they aren't children of
	 * video elements. Thus, we conditionally wrap source elements
	 * using <!--[if IE 9]><video style="display: none;"><![endif]-->
	 * and must account for that here by moving those source elements
	 * back into the picture element.
	 */
    pf.removeVideoShim = function (picture) {
        var videos = picture.getElementsByTagName("video");
        if (videos.length) {
            var video = videos[0],
				vsources = video.getElementsByTagName("source");
            while (vsources.length) {
                picture.insertBefore(vsources[0], video);
            }
            // Remove the video element once we're finished removing its children
            video.parentNode.removeChild(video);
        }
    };

    /**
	 * Find all `img` elements, and add them to the candidate list if they have
	 * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
	 * a `srcset` attribute at all, and they haven’t been evaluated already.
	 */
    pf.getAllElements = function () {
        var elems = [],
			imgs = doc.getElementsByTagName("img");

        for (var h = 0, len = imgs.length; h < len; h++) {
            var currImg = imgs[h];

            if (currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
			(currImg.getAttribute("srcset") !== null) || currImg[pf.ns] && currImg[pf.ns].srcset !== null) {
                elems.push(currImg);
            }
        }
        return elems;
    };

    pf.getMatch = function (img, picture) {
        var sources = picture.childNodes,
			match;

        // Go through each child, and if they have media queries, evaluate them
        for (var j = 0, slen = sources.length; j < slen; j++) {
            var source = sources[j];

            // ignore non-element nodes
            if (source.nodeType !== 1) {
                continue;
            }

            // Hitting the `img` element that started everything stops the search for `sources`.
            // If no previous `source` matches, the `img` itself is evaluated later.
            if (source === img) {
                return match;
            }

            // ignore non-`source` nodes
            if (source.nodeName.toUpperCase() !== "SOURCE") {
                continue;
            }
            // if it's a source element that has the `src` property set, throw a warning in the console
            if (source.getAttribute("src") !== null && typeof console !== undefined) {
                console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
            }

            var media = source.getAttribute("media");

            // if source does not have a srcset attribute, skip
            if (!source.getAttribute("srcset")) {
                continue;
            }

            // if there's no media specified, OR w.matchMedia is supported
            if ((!media || pf.matchesMedia(media))) {
                var typeSupported = pf.verifyTypeSupport(source);

                if (typeSupported === true) {
                    match = source;
                    break;
                } else if (typeSupported === "pending") {
                    return false;
                }
            }
        }

        return match;
    };

    function picturefill(opt) {
        var elements,
			element,
			parent,
			firstMatch,
			candidates,
			options = opt || {};

        elements = options.elements || pf.getAllElements();

        // Loop through all elements
        for (var i = 0, plen = elements.length; i < plen; i++) {
            element = elements[i];
            parent = element.parentNode;
            firstMatch = undefined;
            candidates = undefined;

            // immediately skip non-`img` nodes
            if (element.nodeName.toUpperCase() !== "IMG") {
                continue;
            }

            // expando for caching data on the img
            if (!element[pf.ns]) {
                element[pf.ns] = {};
            }

            // if the element has already been evaluated, skip it unless
            // `options.reevaluate` is set to true ( this, for example,
            // is set to true when running `picturefill` on `resize` ).
            if (!options.reevaluate && element[pf.ns].evaluated) {
                continue;
            }

            // if `img` is in a `picture` element
            if (parent && parent.nodeName.toUpperCase() === "PICTURE") {

                // IE9 video workaround
                pf.removeVideoShim(parent);

                // return the first match which might undefined
                // returns false if there is a pending source
                // TODO the return type here is brutal, cleanup
                firstMatch = pf.getMatch(element, parent);

                // if any sources are pending in this picture due to async type test(s)
                // remove the evaluated attr and skip for now ( the pending test will
                // rerun picturefill on this element when complete)
                if (firstMatch === false) {
                    continue;
                }
            } else {
                firstMatch = undefined;
            }

            // Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
            if ((parent && parent.nodeName.toUpperCase() === "PICTURE") ||
			(!pf.sizesSupported && (element.srcset && regWDesc.test(element.srcset)))) {
                pf.dodgeSrcset(element);
            }

            if (firstMatch) {
                candidates = pf.processSourceSet(firstMatch);
                pf.applyBestCandidate(candidates, element);
            } else {
                // No sources matched, so we’re down to processing the inner `img` as a source.
                candidates = pf.processSourceSet(element);

                if (element.srcset === undefined || element[pf.ns].srcset) {
                    // Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
                    pf.applyBestCandidate(candidates, element);
                } // Else, resolution-only `srcset` is supported natively.
            }

            // set evaluated to true to avoid unnecessary reparsing
            element[pf.ns].evaluated = true;
        }
    }

    /**
	 * Sets up picture polyfill by polling the document and running
	 * the polyfill every 250ms until the document is ready.
	 * Also attaches picturefill on resize
	 */
    function runPicturefill() {
        pf.initTypeDetects();
        picturefill();
        var intervalId = setInterval(function () {
            // When the document has finished loading, stop checking for new images
            // https://github.com/ded/domready/blob/master/ready.js#L15
            picturefill();

            if (/^loaded|^i|^c/.test(doc.readyState)) {
                clearInterval(intervalId);
                return;
            }
        }, 250);

        var resizeTimer;
        var handleResize = function () {
            picturefill({ reevaluate: true });
        };
        function checkResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 60);
        }

        if (w.addEventListener) {
            w.addEventListener("resize", checkResize, false);
        } else if (w.attachEvent) {
            w.attachEvent("onresize", checkResize);
        }
    }

    runPicturefill();

    /* expose methods for testing */
    picturefill._ = pf;

    expose(picturefill);

})(window, window.document, new window.Image());
;// requestAnimationFrame polyfill thanks to Paul Irish -> http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// And Erik Möller -> http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
;// Scroll user down the page
var smoothScroll = function (xCoordParam, scrollSpeed) {

    "use strict";

    var xCoord = xCoordParam || 0;

    if (scrollSpeed > 1) {
        jQuery('html, body').stop(true, true).animate({
            scrollTop: xCoord
        }, scrollSpeed);
    } else {
        jQuery(window).scrollTop(xCoord);
    }

};; function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}; if (document.addEventListener) {
    document.addEventListener("touchstart", function () { "use strict"; console.log(''); }, false);
}
;/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 *
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function ($) {
    $.fn.touchwipe = function (settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function () { },
            wipeRight: function () { },
            wipeUp: function () { },
            wipeDown: function () { },
            preventDefaultEvents: true
        };

        if (settings) $.extend(config, settings);

        this.each(function () {
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false;
            }

            function onTouchMove(e) {
                if (config.preventDefaultEvents) {
                    e.preventDefault();
                }
                if (isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if (Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if (dx > 0) {
                            config.wipeLeft();
                        }
                        else {
                            config.wipeRight();
                        }
                    }
                    else if (Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if (dy > 0) {
                            config.wipeDown();
                        }
                        else {
                            config.wipeUp();
                        }
                    }
                }
            }

            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false);
            }
        });

        return this;
    };

})(jQuery);
;/**
 *  microbit 2015 Global Scripting
 *  @author	Phil Thompson
 */

/*jslint browser: true, devel: true, white: true, todo: true */

/*global requestAnimationFrame: true, smoothScroll: true, throttle: true, debounce: true, Cookies: true */

// Create a global object we can reference
window.microbit = window.microbit || {};

(function ($) {

    "use strict";

    window.microbit = {

        config: {
            smoothScrollSpeed: 500
        },

        // Functions to run onload - note we don't need $(document).ready(); because we include this script before </body>
        init: function () {
            var self = this;
            self.socialShare.init();
            self.pageLinks.init();
            self.toggle.init();
            self.cookie.init();
        },

        // Open social share (e.g. Twitter/Facebook) links in a new small window
        socialShare: {

            height: 340,
            width: 675,

            init: function () {

                var self = this;

                $('a[data-share]').click(function (e) {
                    e.preventDefault();

                    self.trigger($(this));
                });
            },

            trigger: function ($link) {
                var self = this,
					newWindow,
					url,
					left = (screen.width / 2) - (self.width / 2),
					top = (screen.height / 2) - (self.height / 2),
					pageURL = window.location.href,
					pageTitle = document.title;

                url = $link.attr('href').replace('{{TITLE}}', pageTitle).replace('{{LINK}}', pageURL);
                newWindow = window.open(url, 'Share', 'height=' + self.height + ',width=' + self.width + ',top=' + top + ',left=' + left);
                if (window.focus) {
                    newWindow.focus();
                }
            }
        },

        // Smoothly scroll to page (#) links
        pageLinks: {

            $header: $('.site-header'),
            elementOffset: 0,

            init: function () {
                var self = this;

                $(document).on('click', 'a', function (e) {
                    if ($('#' + $(this)[0].href.split('#')[1]).length > 0 && $(this).hasClass('no-scroll') !== true) {
                        e.preventDefault();
                        self.trigger($(this));
                    }
                });
            },

            trigger: function ($link) {
                
                var self = this;
                var width = screen.width;
                if (width > 992) {
                    self.elementOffset = parseInt(self.$header.height() - 10);
                }
                else {
                    self.elementOffset = parseInt(self.$header.height() - 10);
                }



                smoothScroll($('#' + $link[0].href.split('#')[1]).offset().top - self.elementOffset, window.microbit.config.smoothScrollSpeed);
            }
        },

        /*
		Toggle:
		Allow an item to be shown/hidden with the click of a button
		requires HTML like this:
		<a
		href="#"
		data-js-toggle="the-class-to-be-added-to container or :root"
		data-js-toggle-container=".content-block" <-- optional: if not present add class to <html>
		data-js-toggle-wording-inactive="Open Me"
		data-js-toggle-wording-active="Close Me"
		>Open Me</a>
		*/
        toggle: {

            $buttons: $('[data-js-toggle]'),

            init: function () {
                var self = this;

                if (self.$buttons.length === 0) {
                    return;
                }

                self.$buttons.on('click', function (e) {
                    e.preventDefault();
                    self.trigger($(this));
                });
            },

            trigger: function ($button) {

                var toggleClass = $button.data('js-toggle'),
					wording = {
					    active: $button.data('js-toggle-wording-active'),
					    inactive: $button.data('js-toggle-wording-inactive')
					},
					scroll = $button.data('js-toggle-scroll'),
					scrollPosition = 0,
					$container = $button.closest($button.data('js-toggle-container'));

                //console.log($button.data('js-toggle-container'));

                if ($container.length === 0) {
                    $container = $('html');
                }
                $container.toggleClass(toggleClass);

                if (wording.active !== undefined && wording.inactive !== undefined) {
                    if ($container.hasClass(toggleClass)) {
                        $button.html(wording.active);
                    } else {
                        $button.html(wording.inactive);
                    }
                }

                // Scroll user into place (if needed)
                if (scroll !== undefined) {
                    scrollPosition = $(document).height();

                    $('html, body').animate({
                        scrollTop: scrollPosition
                    }, 50);
                }
            }
        },

        // Implied cookie consent
        // @see: https://github.com/ScottHamper/Cookies
        cookie: {

            init: function () {
                var cookiePolicy = 'ckns_policy',
						cookieValue = '011';

                var cookieAccept = 'ckns_accept',
						cookieValue = '111',
						$message = $('[data-js-cookies]'),
						activeClass = 'site-cookies--active';

                if ($message.length === 0) {
                    return;
                }

                var name = 'ckns_policy';
                var id = 'userid';

                //Cookie settings information
                //
                //‘000’ if functionality+performance cookies are disabled
                //‘010' if functionality cookies are enabled, but performance are disabled
                //‘001’ if functionality cookies are disabled, but performance are enabled
                //‘011’ if functionality+performance are enabled
                var cookieValue = function () {
                    var value = Cookies.get(cookiePolicy);
                    if (value != null) {
                        value = value.toString();
                        if (value.charAt(2) == "1") {
                            $(".per--add").attr('checked', true)
                        }
                        else {
                            $(".per--remove").attr('checked', true)
                        }
                        if (value.charAt(1) == "1") {
                            $(".func--add").attr('checked', true)
                        }
                        else {
                            $(".func--remove").attr('checked', true)
                        }
                    }
                    return value;
                };

                //check to see if ckns_accept exists in localStorage or as a cookie
                var checkAccept = function () {
                    var value = Cookies.get('ckns_accept');
                    if (value == null) {
                        $message.addClass(activeClass);
                    }

                }

                String.prototype.replaceAt = function (index, character) {
                    return this.substr(0, index) + character + this.substr(index + character.length);
                };

                var createCookieAccept = function () {

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);
                    Cookies.set(cookieAccept, "111", { expires: today });
                }
                var policyValue = cookieValue();
                var func = function () {

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);

                    Cookies.set(name, "011", { expires: today })

                };

                $(".per--add").on('click', function () {
                    var value = cookieValue();
                    var newValue = value.replaceAt(2, "1");

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);
                    Cookies.set(cookiePolicy, newValue, { expires: today });

                });
                $(".per--remove").on('click', function () {
                    var value = cookieValue();
                    var newValue = value.replaceAt(2, "0");

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);
                    Cookies.set(cookiePolicy, newValue, { expires: today });


                });
                $(".func--add").on('click', function () {
                    var value = cookieValue();
                    var newValue = value.replaceAt(1, "1");

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);
                    Cookies.set(cookiePolicy, newValue, { expires: today });

                    createCookieAccept();
                });
                $(".func--remove").on('click', function () {
                    var value = cookieValue();
                    var newValue = value.replaceAt(1, "0");

                    var today = new Date();
                    today.setFullYear(today.getFullYear() + 1);
                    Cookies.set(cookiePolicy, newValue, { expires: today });
                    Cookies.expire('ckns_accept');

                });

                var value = Cookies.get(cookiePolicy);
                if (value == null) {
                    func();
                };
                checkAccept();

                $('[data-js-cookie-close]').on('click', function () {
                    $message.removeClass(activeClass);
                    var value = cookieValue();
                    if (value.charAt(1) == "0") {
                        return
                    }
                    createCookieAccept();


                });

                function parseURL(url) {
                    var parser = document.createElement('a'),
                        searchObject = {},
                        queries, split, i;
                    // Let the browser do the work
                    parser.href = url;
                    // Convert query string to object
                    queries = parser.search.replace(/^\?/, '').split('&');
                    for (i = 0; i < queries.length; i++) {
                        split = queries[i].split('=');
                        searchObject[split[0]] = split[1];
                    }
                    return {
                        protocol: parser.protocol,
                        host: parser.host,
                        hostname: parser.hostname,
                        port: parser.port,
                        pathname: parser.pathname,
                        search: parser.search,
                        searchObject: searchObject,
                        hash: parser.hash
                    };
                };

                $(document).ready(function () {

                    //addSelectedMenu();
                    var data = parseURL(window.location.href);

                   

                    if (window.location.href.indexOf("oauth") > -1) {
                        //console.log("contains oath");
                    }
                    else {
                        var pathName = data.pathname.toString();
                        //console.log("pathName: " + data.pathname);
                        var pathEdit = "home";
                        var stringBuild = "";
                        if (data.pathname.length == 0) {

                        }
                        else {
                            if (pathName != "/") {

                                if (pathName.substring(1) == "/") {
                                    pathName = pathName.substring(1);
                                }
                                pathName = pathName.replace(/-/g, "_");
                                pathEdit = pathName.replace(/\//g, ".");
                                stringBuild = "kl.education.microbit" + pathEdit + ".page";
                                stringBuild = stringBuild.replace("..", ".");
                            }
                            else {
                                stringBuild = "kl.education.microbit." + pathEdit + ".page";
                                stringBuild = stringBuild.replace("..", ".");
                            }
                        }

                        
                       // console.log("path:" + stringBuild);
                        var stringHolder = "https://sa.bbc.co.uk/bbc/bbc/s?name=" + stringBuild + "&app_type=responsive&app_name=microbit&bbc_site=bitesize";

                        var name = 'ckns_policy';
                        var value = Cookies.get(name);
                        if (value != null) {

                            var policyValue = cookieValue();
                            if (policyValue.charAt(2) == 1) {
                                udm_(stringHolder);
                            }
                        }
                    }
                });
            }
        }
    };

    /* SCRIPT TO SWAP OUT THUMBNAILS FOR IFRAME'S ON CLICK */
    var currentVideo = "";
    $('.md-video-link').on("click", function () {

        $(".site-header").addClass("video--active");

        var name = $(this).data("playerurl");
        if (name === undefined) {
            name = $(this).data("videosrc");

        }
        $(this).find("img").remove();
        $(this).find("svg").remove();
        $('<div />', {
            "class": 'embed-responsive embed-responsive-16by9'

        }).appendTo($(this));
        $('<iframe>', {
            class: 'embed-responsive-item',
            src: name,
            frameborder: 0,
            scrolling: 'no'
        }).appendTo($(this).find(".embed-responsive.embed-responsive-16by9"));

    });

    window.microbit.init();

}(jQuery));
;/**
 *  microbit 2015 Menu Controls
 *  @author	Ben McDonough
 */


// Create a global object we can reference
window.microbit = window.microbit || {};

// Check user is login state and assign correct menu option
if (Modernizr.localstorage) {
    if (localStorage.getItem("userid") === null) {
        $('.sign-in--control').addClass("active");
    }
    else {
        $('.sign-out--control').addClass("active");
    }
}
$(function () {
    // Clickable Dropdown
    $('.click-nav > ul').toggleClass('no-js js');
    $('.click-nav .js ul').hide();
    $('.click-nav .js').click(function (e) {
        $('.click-nav .js ul').slideToggle(200);
        $('.clicker').toggleClass('active');
        e.stopPropagation();
    });
    $(document).click(function () {
        if ($('.click-nav .js ul').is(':visible')) {
            $('.click-nav .js ul', this).slideUp();
            $('.clicker').removeClass('active');
        }
    });
});

//mobile menu langauge dropdown
$(function () {
    $('.lang-dropdown').click(function () {
        //console.log("clicked lang");
        $(".lang-dropdown--menu").toggleClass("menu-open");

    });




});

/**
*  microbit 2015 Promo Cards
*  @author Ben McDonough
*/

/* SCRIPT TO LOAD IN CARDS */
$('body').on('click', '.more-link', function () {
    //console.log("link clicked");
    $(".card").removeClass('active');
    $(this).closest(".card").addClass('active');
    $(this).closest(".card-link").attr('tabindex', '-1');
});

function revealOnEnter(e) {
        if (e.which === 13 || e.charCode === 13 || e.keyCode === 13) {
            $(this).closest(".card").removeClass('active');
            $(this).closest(".card").addClass('active');
            $(this).closest(".card-link").attr('tabindex', '-1');
        }
    };

    $('body').on('click', '.close-link', function () {
            $(".card").removeClass('active');
            $(this).closest(".card-link").attr('tabindex', '0');
        });
    

    function closeOnEnter(e) {
        if (e.which === 13 || e.charCode === 13 || e.keyCode === 13) {
            $(this).closest(".card").removeClass('active');
            $(this).closest(".card-link").attr('tabindex', '0');
        }
    }


function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"), "") !== location.host) return true;
    return false;
}

/* Query URL parameters */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function loadTag() {
    items = [];
    continuation = "";
    currPos = 0;
    loading = false;
    $("#cards").empty();
    if ($(".grid").data('isotope')) {
        $('.grid').masonry('destroy');
    }
    $('.grid').masonry({
        itemSelector: '.card',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });
    $("#loadingContent").show();
    $('#loadMore').show();
    load(0, 18);
    $('.grid').masonry('layout');
}

function searchLoad() {
    
    items = [];
    continuation = "";
    currPos = 0;
    loading = false;
    $("#cards").empty();
    search = true;
    $('#loadMore').show();
    load(0, 6);
}

$(window).load(function (e) {
    $(".filters").hide();
    e.preventDefault();
    $("#filter a").click(function () {
        var tagText = $(this).text();
        $(".typed").text(tagText);
        tag = $(this).attr("href").replace(/.*#/, "");
        loadTag();
    });
    $("#searchFilter a").click(function () {
        var selectedFilter = $(this).data("filter");
        $("ol li").removeClass("selected");
        $(this).closest("li").addClass("selected");
        getSearchResults(selectedFilter);
    });

    $("#mobileSearchFilter a").click(function () {
        var selectedFilter = $(this).data("filter");
        $("ol li").removeClass("selected");
        $(this).closest("li").addClass("selected");
        getSearchResults(selectedFilter);
    });

    function getSearchResults(e) {
        filterSelected = true;
        var selectedFilter = e;
        //console.log("filter: " + selectedFilter);
        filter = selectedFilter;
        //console.log("selectedFilter : " + filter);
        searchLoad();
    }

    tag = document.location.hash.replace(/.*#/, "") || "homepage";
    //console.log(tag);
  
    if (tag == "filter" || tag == "mainContent") {
        
        tag = "homepage";
        goToAnchor = true;
      
    }

    

    var pathArray = window.location.pathname.split('/');
    var name = pathArray[0];
    //console.log(pathArray);

    if (pathArray[pathArray.length - 1] == 'search.html' || window.location.pathname === "/search" || window.location.pathname === "/search-test") {
        if (getQueryVariable("q")) {
            var currentSearchTerm = getQueryVariable("q");
            var textBox = $("#searchBox");
            textBox.val(currentSearchTerm);
            // filter currently hidden on editorial team request
            // $(".filters").show();
        }
        else {
            $('#loadMore').hide();
        }

        if ($("#cards").length > 0) {
            searchLoad();
        }
        searchTerm = getQueryVariable("q");
    }
    else {
        if ($("#cards").length > 0) {
            loadTag();
        }  
    }
});

var items = [];
var blankCount = 0;
var blankStyle = "";
var continuation = "";
var tag = "homepage";
var currPos = 0;
var loading = false;
var search = false;
var searchTerm = "";
var searchCount = 0;
var filter = "@promo";
var filterSelected = false;
var goToAnchor = false;

/* LANGUAGE TRANSLATIONS */
var tutorial = "Tutorial";
var project = "Project";
var gettingStarted = "Getting Started";
var amazingStory = "Amazing Story";
var lesson = "Lesson";
var featuredText = "Featured";
var findOutMore = "Find out more";
var close = "Close";
var by = "By";
var remixCode = "Remix code";
var addInfo = "Additional info";
var readArticle = "Read article";
var watchVideo = "Watch Video";
var followTutorial = "Follow tutorial";
var launchEditor = "Launch editor";
var challenge = "Take the challenge";
var challengeTag = "Challenge";
var eventTag = "Event";
var makesTag = "Makes";

function isEven(value) {
    if (value % 2 == 0) {
        blankStyle = "version-two";
    }
    else {
        blankStyle = "";
    }

}

var currLang = window.currentPageLanguage || Cookies.get("TD_LANG");
if (currLang == "cy") {
    /* WELSH TRANSLATIONS */
    tutorial = "Tiwtorial";
    project = "Prosiect";
    gettingStarted = "Dechrau Arni";
    amazingStory = "Stori anhygoel";
    lesson = "Gwers";
    featuredText = "Nodwedd";
    findOutMore = "Darganfod mwy";
    close = "Cau";
    by = "gan";
    remixCode = "Ailgymysgu'r cod";
    addInfo = "Gwybodaeth Ychwanegol";
    readArticle = "Darllen yr erthygl";
    watchVideo = "Gwyliwch fideo";
    followTutorial = "Dilyn y tiwtorial";
    launchEditor = "Lansio'r golygydd";
    challenge = "Derbyn yr her";
    challengeTag = "Her";
    eventTag = "Digwyddiad";
    makesTag = "Creadigaethau";

    $("#searchBox").attr("placeholder", "Dechreuwch chwilio fan hyn");
}




function load(from, to) {
    var count = 1;
    
    //hide search error
    
    //$("#loadMore").hide();

    if (window.location.pathname === "/getting-started") {
        tag = "getting-started";
    }
    if (window.location.pathname === "/teachers-and-parents") {
        tag = "teachers-and-parents";
    }
    if (items.length < to) {
        if (loading) return;
        if (continuation === null) {
            $('#loadMore').hide();
            load(from, items.length);
            return;
        }
        loading = true;
        $("#loadMore").show();
        var langSuff = currLang == "en" ? "" : "@" + currLang;
        if (!search) {
            $.ajax({ url: "/api/cached/promo-scripts/" + tag  + "?continuation=" + continuation }).then(function (r) {
                continuation = r.continuation;
                if (!continuation) continuation = null;
                r.items.forEach(function (e) { items.push(e) });
                loading = false;
                load(from, to);
            })
        }
        else {
            searchTerm = getQueryVariable("q");
            var loadMore = "";
            if (getQueryVariable("q")) {
                if (filter.length > 0) {
                    searchTerm += "+feature:" + filter;
                }
            }
            else {
                searchTerm = "feature:" + filter;
            }
            if (getQueryVariable("q") || !getQueryVariable("q") && filterSelected) {
                $('#loading').show();
                if (continuation > 0) {
                    loadMore = "&continuation=" + continuation;
                }

                $.ajax({ url: "/api/websearch?q=" + searchTerm + "&count=6" + loadMore }).then(function (r) {
                    continuation = r.continuation;
                    if (!continuation) continuation = null;
                    r.items.forEach(function (e) { items.push(e) });
                    var numberOfItems = items.length;
                    //console.log(numberOfItems);
                    if (numberOfItems > 0) {
                        $('#loading').hide();
                        //$("#nothingFound").hide();
                       // console.log("has items");
                    }
                    else {
                        $('#loading').hide();
                        $('#nothingFound').show();
                        //console.log("no items");
                    }
                    loading = false;
                    //load(from, to);
                    load(from, to);
                });
            }
            else {
                $("#nothingFound").hide();
                $("#loadMore").hide();
            }
           
            
        }
    } else {
        
        currPos = to;
        /* check to see if on search page */
        //var page = parseURL(window.location.href);
        //console.log(page);
        var template = "";
        if (search) {
            template = $('#loadSearch').html();
        }
        else {
            template = $('#loadCard').html();
        }
            Mustache.parse(template);   // optional, speeds up future uses
            var all = "";
            items.slice(from, to).forEach(function (item) {
                //check resourse
                var url = "";
                var external = "";
                if (item.promo.link != "") {
                    url = item.promo.link;
                    external = isExternal(url);
                }
                item.size = "card--project";
                item.large = false;
                item.standard = true;
                item.featured = false;
                item.primaryCTA = false;
                item.secondaryCTA = false;
                item.blank = false;
                item.findOutMore = findOutMore;
                item.by = by;
                item.close = close;
                item.featuredText = featuredText;
                item.animate = "card--animate--" + count;
                item.blankStyle = "";
                count++;

                var imageSize = "thumb1";

                var tags = item.promo.tags;

                if (tags.indexOf("large") > -1) {
                    item.standard = false;
                    item.large = true;
                    item.size = "card-featured--large";
                    imageSize = "pub";
                }

                // GET IMAGE
                if (item.meta.art) {
                    item.imageUrl = "https://az742082.vo.msecnd.net/" + imageSize + "/" + item.meta.art;
                }
                else if (item.meta.bbc) {
                    item.imageUrl = "https://files.microbit.co.uk/clips/" + item.meta.bbc + "/thumb";
                    item.video = "https://files.microbit.co.uk/clips/" + item.meta.bbc + "/embed";
                }
                else if (item.meta.videoptr) {
                    item.imageUrl = "/" + item.meta.videoptr + "/thumb";
                    item.video = "/embed/" + item.meta.videoptr;
                }
                else {
                    //default image
                    //item.imageUrl = "https://az742082.vo.msecnd.net/pub/jewlbgrj";
                    item.imageUrl = "https://microbit0.blob.core.windows.net/pub/fmpntlqm";
                }
                // END GET IMAGE
                // GET MAIN TAG
                //Check to see if card has blank tag
                if (tags.indexOf("blank") > -1) {
                    blankCount++;
                    item.mainTag = "blank";
                    item.standard = false;
                    item.blank = true;
                        
                   
                    isEven(blankCount);
                    item.blankStyle = blankStyle;
                }
                else {
                    // GETTING STARTED
                    if (tags.indexOf("getting-started") > -1 || tags.indexOf("amazing-story") > -1 ) {

                        item.primaryTarget = "_self";
                        if (item.promo.link != "") {
                            item.primaryLink = item.promo.link;
                        }
                        else {
                            item.primaryLink = item.id
                        }
                        item.primaryCTA = true;
                        if (tags.indexOf("video") > -1) {
                            //need to tag it as video
                            item.primaryIcon = "play";
                            item.primaryText = watchVideo;
                        }
                        else {
                            item.primaryText = readArticle;
                            if (tags.indexOf("download") > -1) {
                                item.primaryIcon = "download";
                            }
                            else {
                                //check link
                                if (external) {
                                    item.primaryIcon = "external";
                                    item.primaryTarget = "_blank";
                                }
                                else {
                                    item.primaryIcon = "read";
                                }
                            }
                        }
                        if (tags.indexOf("getting-started") > -1) {
                            item.mainTag = gettingStarted;
                        }
                        else if (tags.indexOf("amazing-story") > -1) {
                            item.mainTag = amazingStory;
                        }
                        else if (tags.indexOf("makes") > -1) {
                            item.mainTag = makesTag;
                        }
                    }
                        // END GETTING STARTED
                    else if (tags.indexOf("project") > -1) {
                        item.mainTag = project;

                        // primary CTA - Remix code
                        item.primaryCTA = true;
                        item.primaryIcon = "edit";
                        item.primaryLink = "/app/#create:" + item.id;
                        item.primaryText = remixCode;
                        item.primaryTarget = "_self";
                        //  Secondary CTA -- Additional info
                        if (item.promo.link != "") {
                            item.secondaryCTA = true;
                            item.secondaryText = addInfo;
                            item.secondaryLink = item.promo.link;
                            if (tags.indexOf("download") > -1) {
                                item.secondaryIcon = "download";
                            }
                            else {
                                //check link
                                if (external) {
                                    item.secondaryIcon = "external";
                                    item.secondaryTarget = "_blank";
                                }
                                else {
                                    item.secondaryIcon = "read";
                                    item.secondaryTarget = "_self";
                                }
                            }
                        }
                    }
                        // TUTORIALS 
                    else if (tags.indexOf("tutorial") > -1) {
                        //item.mainTag = "Tutorial";
                        //if there is a resource link then there show two links
                        item.mainTag = tutorial;

                        if (item.promo.link != "") {
                            item.primaryCTA = true;
                            if (tags.indexOf("download") > -1) {
                                item.secondaryIcon = "download";
                                item.secondaryTarget = "_self";
                            }
                            else {
                                //check link
                                if (external) {
                                    item.secondaryIcon = "external";
                                    item.secondaryTarget = "_blank";
                                }
                                else {
                                    item.secondaryIcon = "read";
                                    item.secondaryTarget = "_self";
                                }
                            }
                            //item.primaryText = "Follow tutorial";
                            item.secondaryLink = item.promo.link;
                            item.secondaryText = addInfo;
                            item.secondaryCTA = true;
                            item.primaryText = followTutorial;
                            item.primaryIcon = "open";
                            item.primaryLink = "/app/#follow:" + item.id;
                        }
                        else {
                            item.primaryCTA = true;
                            item.primaryIcon = "open";
                            // item.primaryText = "Follow tutorial";
                            item.primaryText = followTutorial;
                            //item.secondaryText = "Launch editor";
                            item.primaryLink = "/app/#follow:" + item.id;
                            item.primaryTarget = "_self";
                            // item.secondaryTarget = "_self";
                        }

                        if (tags.indexOf("remix") > -1) {

                            item.secondaryCTA = true;
                            if (tags.indexOf("download") > -1) {
                                item.primaryIcon = "download";
                                item.primaryTarget = "_blank";
                            }
                            else {
                                if (external) {
                                    item.primaryIcon = "external";
                                    item.primaryTarget = "_blank";
                                }
                                else {
                                    item.primaryIcon = "read";
                                };
                            }
                            item.primaryLink = item.promo.link;
                            item.primaryCTA = true;
                            item.primaryText = followTutorial;
                            item.secondaryCTA = true;
                            item.secondaryText = remixCode;
                            item.secondaryLink = "/app/#pub:" + item.id;
                            item.secondaryIcon = "edit";
                        }

                        if (tags.indexOf("launch") > -1) {
                            item.primaryCTA = true;
                            if (item.promo.link != "") {
                                item.secondaryCTA = true;
                                if (tags.indexOf("download") > -1) {
                                    item.primaryIcon = "download";
                                    item.primaryTarget = "_blank";
                                }
                                else {
                                    if (external) {
                                        item.primaryIcon = "external";
                                        item.primaryTarget = "_blank";
                                    }
                                    else {
                                        item.primaryIcon = "read";
                                        item.primaryTarget = "_self";
                                    }
                                }
                                item.primaryText = followTutorial;
                                item.primaryLink = item.promo.link;
                            }
                            item.secondaryText = launchEditor;
                            item.secondaryLink = "/app/#pub:" + item.id;
                            item.secondaryIcon = "open";
                        }

                    }
                        // CHALLENGES
                    else if (tags.indexOf("challenge") > -1) {
                        //item.mainTag = "Tutorial";
                        //if there is a resource link then there show two links

                        item.mainTag = challengeTag;

                        if (item.promo.link != "") {
                            item.primaryCTA = true;
                            if (tags.indexOf("download") > -1) {
                                item.secondaryIcon = "download";
                                item.secondaryTarget = "_self";
                            }
                            else {
                                //check link
                                if (external) {
                                    item.secondaryIcon = "external";
                                    item.secondaryTarget = "_blank";
                                }
                                else {
                                    item.secondaryIcon = "read";
                                    item.secondaryTarget = "_self";
                                }
                            }
                            //item.primaryText = "Follow tutorial";
                            item.secondaryLink = item.promo.link;
                            item.secondaryText = addInfo;
                            item.secondaryCTA = true;
                            item.primaryText = followTutorial;
                            item.primaryIcon = "open";
                            item.primaryLink = "/app/#follow:" + item.id;
                        }
                        else {
                            item.primaryCTA = true;
                            item.primaryIcon = "open";
                            // item.primaryText = "Follow tutorial";
                            item.primaryLink = "/app/#pub:" + item.id;
                            item.primaryText = challenge;
                        }
                    }
                        // END TUTORIALS // CHALLENGES
                    else if (tags.indexOf("lesson") > -1) {
                        item.mainTag = lesson;
                        item.primaryIcon = "read";
                        item.primaryLink = item.promo.link;
                        item.primaryCTA = true;
                        item.primaryText = readArticle;
                    }

                    else if (tags.indexOf("event") > -1) {
                        item.mainTag = eventTag;
                        item.primaryLink = item.promo.link;
                        item.primaryCTA = true;
                        item.primaryText = addInfo;
                        if (external) {
                            item.primaryIcon = "external";
                            item.primaryTarget = "_blank";
                        }
                        else {
                            item.primaryIcon = "read";
                            item.primaryTarget = "_self";
                        }
                    }

                        //MAKER CARD
                    else if (tags.indexOf("makes") > -1) {

                        item.mainTag = makesTag;

                        item.primaryTarget = "_self";
                        if (item.promo.link != "") {
                            item.primaryLink = item.promo.link;
                        }
                        else {
                            item.primaryLink = item.id
                        }
                        item.primaryCTA = true;
                        if (tags.indexOf("video") > -1) {
                            //need to tag it as video
                            item.primaryIcon = "play";
                            item.primaryText = watchVideo;
                        }
                        else {
                            item.primaryText = readArticle;
                            if (tags.indexOf("download") > -1) {
                                item.primaryIcon = "download";
                            }
                            else {
                                //check link
                                if (external) {
                                    item.primaryIcon = "external";
                                    item.primaryTarget = "_blank";
                                }
                                else {
                                    item.primaryIcon = "read";
                                }
                            }
                        }
                        if (tags.indexOf("launch") > -1) {
                            item.secondaryCTA = true;
                           
                            item.secondaryText = launchEditor;
                            item.secondaryLink = "/app/#pub:" + item.id;
                            item.secondaryIcon = "open";
                        }
                    }
                    // IF featured tag present make card big
                    if (tags.indexOf("featured") > -1) {

                        item.size = "card--featured";
                        item.featured = true;

                        if (tags.indexOf("large") > -1) {
                            item.standard = false;
                            item.large = true;
                            item.size = "card-featured--large";
                        }
                    }
                }
                //END MAIN TAG
                all += Mustache.render(template, item);
            })

            var $items = $(all);
            
            if (!search) {
                $items.hide();
                // append to container
                $('#cards').append($items);
                $items.imagesLoaded().always(function (imgLoad, image) {
                    // get item
                    // image is imagesLoaded class, not <img>, <img> is image.img
                    //var $item = $(image.img).parents('.card');
                    // $items.show();
                    $items.each(function () {
                        var $item = $(this);
                        // un-hide item
                        if ($item.hasClass("card")) {
                            // isotope does its thing
                            $(".grid").masonry('reloadItems');
                            $(".grid").masonry('layout');
                        }
                    });
                    $("#loadingContent").hide();
                    //force items to show to allow nice animation
                    $items.show();
                    $(".grid").masonry('reloadItems');
                    $('.grid').masonry('layout');
                   
                    if (goToAnchor) {
                        var scrollValue = $("#mainContent").offset().top;
                        $("html, body").animate({
                            scrollTop: scrollValue - 35 // scroll to position
                        }, "slow");
                    }
                });
            }
            else {
                $('#cards').append($items);
               
            }
           

        $('.md-video-link').on("click", function () {


            var name = $(this).data("playerurl");
            if (name === undefined) {
                name = $(this).data("videosrc");
            }
            $(this).find("img").remove();
            $(this).find("svg").remove();
            $(this).closest(".card__body__icon").remove();

            $('<div />', {
                "class": 'embed-responsive embed-responsive-16by9'

            }).appendTo($(this));
            $('<iframe>', {
                class: 'embed-responsive-item',
                src: name,
                frameborder: 0,
                scrolling: 'no'
            }).appendTo($(this).find(".embed-responsive.embed-responsive-16by9"));

        });
    }
}

function loadMore() {
    //console.log("current position: " + currPos);
    var goTo = currPos + 6;
    load(currPos, currPos + 6);
}


/* 2015 Microbit Search */




/* 2015 Microbit Scrolling Stick Header and Discover Menu
*  @author Ben McDonough
*/
//var iScrollPos = 0;
//$(window).scroll(function () {

//    var height = $(window).scrollTop();

//    //if (height > 50) {
//    //    $(".site-logo").addClass("black-logo");
//    //    $(".site-header").addClass("alt-header");
//    //    $(".site-header").addClass("white-menu");
//    //    $(".site-header__userarea").addClass("hide");
//    //}
//    //else {
//    //    $(".site-logo").removeClass("black-logo");
//    //    $(".site-header").removeClass("alt-header");
//    //    $(".site-header").removeClass("white-menu");
//    //    $(".site-header__userarea").removeClass("hide");
//    //}
    
   



//});
$(function () {


    var currLang = window.currentPageLanguage || Cookies.get("TD_LANG");
    if (currLang == "cy") {
        $("body").addClass("welsh");
    }
 
    $('.taster-filter').focusin(function (e) {
            $(".taster-filter").addClass('tab-focus');
        
    });

    $('.taster-filter').focusout(function () {
            
            $(".taster-filter").removeClass('tab-focus');
        
    });

    $('.taster-filter__dropdown-arrow').on('click', function (e) {
        e.preventDefault();
        $(".taster-filter").addClass('tab-focus');

    });


    // show hide subnav depending on scroll direction
    var position = $(window).scrollTop();


    //$(window).on('scroll', function () {
    //    var iCurScrollPos = $(window).scrollTop();
    //    if (iCurScrollPos > position && iCurScrollPos > 50) {
    //        $(".site-header__userarea").addClass("hide");
    //        $(".header").addClass("height--small");
    //    }
    //    else if (iCurScrollPos < position)  {
    //        $(".site-header__userarea").removeClass("hide");
    //        $(".header").removeClass("height--small");
    //    }
    //    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    //        $(".site-header__userarea").removeClass("hide");
    //        $(".header").removeClass("height--small");
    //    }

    //    if (iCurScrollPos > 0) {
    //        $(".site-cookies--active").addClass("hide--cookies");
    //    }
    //    else {
    //        $(".site-cookies--active").removeClass("hide--cookies");
    //    }
    //    position = iCurScrollPos;
    //});



    var path = window.location.href; // URL reference

    $('ul a').each(function () {
        if (this.href === path) {
            $(this).parent().addClass('site-nav__item--selected');
        }
    });

    if (window.location.hash) {
        var hash = window.location.hash;
        if (hash == "#filter" || hash == "#mainContent") {
            hash = "#homepage";
        }
        hash = hash.replace("#", ".");
        hash = hash + "-promo";
        //console.log(hash);
        var item = $(hash);
        
        if (hash == ".homepage-promo") {
            $("#promoType").text("Everything");
        }
        else {
            $("#promoType").text(item.text());
        }
    }
    $("li a.discover").on('click', function (e) {
        e.preventDefault();
        $("#filter>li.site-nav__item--selected").removeClass("site-nav__item--selected");
        $(this).closest("li").addClass("site-nav__item--selected");
        $(".taster-filter").toggleClass('tab-focus');
    });


    /* 2015 Microbit create cards */
    var createExists = document.getElementsByClassName("create-cards");
    if (createExists) {
        $('.create-cards').masonry({
            itemSelector: '.content-block',
            columnWidth: '.content-block',
            percentPosition: true
        });

    }

    !function (a, b, c, d) { function e(b, c) { this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this.drag = a.extend({}, m), this.state = a.extend({}, n), this.e = a.extend({}, o), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], a.each(e.Plugins, a.proxy(function (a, b) { this._plugins[a[0].toLowerCase() + a.slice(1)] = new b(this) }, this)), a.each(e.Pipe, a.proxy(function (b, c) { this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) }) }, this)), this.setup(), this.initialize() } function f(a) { if (a.touches !== d) return { x: a.touches[0].pageX, y: a.touches[0].pageY }; if (a.touches === d) { if (a.pageX !== d) return { x: a.pageX, y: a.pageY }; if (a.pageX === d) return { x: a.clientX, y: a.clientY } } } function g(a) { var b, d, e = c.createElement("div"), f = a; for (b in f) if (d = f[b], "undefined" != typeof e.style[d]) return e = null, [d, b]; return [!1] } function h() { return g(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1] } function i() { return g(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0] } function j() { return g(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0] } function k() { return "ontouchstart" in b || !!navigator.msMaxTouchPoints } function l() { return b.navigator.msPointerEnabled } var m, n, o; m = { start: 0, startX: 0, startY: 0, current: 0, currentX: 0, currentY: 0, offsetX: 0, offsetY: 0, distance: null, startTime: 0, endTime: 0, updatedX: 0, targetEl: null }, n = { isTouch: !1, isScrolling: !1, isSwiping: !1, direction: !1, inMotion: !1 }, o = { _onDragStart: null, _onDragMove: null, _onDragEnd: null, _transitionEnd: null, _resizer: null, _responsiveCall: null, _goToLoop: null, _checkVisibile: null }, e.Defaults = { items: 3, loop: !1, center: !1, mouseDrag: !0, touchDrag: !0, pullDrag: !0, freeDrag: !1, margin: 0, stagePadding: 0, merge: !1, mergeFit: !0, autoWidth: !1, startPosition: 0, rtl: !1, smartSpeed: 250, fluidSpeed: !1, dragEndSpeed: !1, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: b, responsiveClass: !1, fallbackEasing: "swing", info: !1, nestedItemSelector: !1, itemElement: "div", stageElement: "div", themeClass: "owl-theme", baseClass: "owl-carousel", itemClass: "owl-item", centerClass: "center", activeClass: "active" }, e.Width = { Default: "default", Inner: "inner", Outer: "outer" }, e.Plugins = {}, e.Pipe = [{ filter: ["width", "items", "settings"], run: function (a) { a.current = this._items && this._items[this.relative(this._current)] } }, { filter: ["items", "settings"], run: function () { var a = this._clones, b = this.$stage.children(".cloned"); (b.length !== a.length || !this.settings.loop && a.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = []) } }, { filter: ["items", "settings"], run: function () { var a, b, c = this._clones, d = this._items, e = this.settings.loop ? c.length - Math.max(2 * this.settings.items, 4) : 0; for (a = 0, b = Math.abs(e / 2) ; b > a; a++) e > 0 ? (this.$stage.children().eq(d.length + c.length - 1).remove(), c.pop(), this.$stage.children().eq(0).remove(), c.pop()) : (c.push(c.length / 2), this.$stage.append(d[c[c.length - 1]].clone().addClass("cloned")), c.push(d.length - 1 - (c.length - 1) / 2), this.$stage.prepend(d[c[c.length - 1]].clone().addClass("cloned"))) } }, { filter: ["width", "items", "settings"], run: function () { var a, b, c, d = this.settings.rtl ? 1 : -1, e = (this.width() / this.settings.items).toFixed(3), f = 0; for (this._coordinates = [], b = 0, c = this._clones.length + this._items.length; c > b; b++) a = this._mergers[this.relative(b)], a = this.settings.mergeFit && Math.min(a, this.settings.items) || a, f += (this.settings.autoWidth ? this._items[this.relative(b)].width() + this.settings.margin : e * a) * d, this._coordinates.push(f) } }, { filter: ["width", "items", "settings"], run: function () { var b, c, d = (this.width() / this.settings.items).toFixed(3), e = { width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding, "padding-left": this.settings.stagePadding || "", "padding-right": this.settings.stagePadding || "" }; if (this.$stage.css(e), e = { width: this.settings.autoWidth ? "auto" : d - this.settings.margin }, e[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && a.grep(this._mergers, function (a) { return a > 1 }).length > 0) for (b = 0, c = this._coordinates.length; c > b; b++) e.width = Math.abs(this._coordinates[b]) - Math.abs(this._coordinates[b - 1] || 0) - this.settings.margin, this.$stage.children().eq(b).css(e); else this.$stage.children().css(e) } }, { filter: ["width", "items", "settings"], run: function (a) { a.current && this.reset(this.$stage.children().index(a.current)) } }, { filter: ["position"], run: function () { this.animate(this.coordinates(this._current)) } }, { filter: ["width", "position", "items", "settings"], run: function () { var a, b, c, d, e = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, g = this.coordinates(this.current()) + f, h = g + this.width() * e, i = []; for (c = 0, d = this._coordinates.length; d > c; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c); this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass)) } }], e.prototype.initialize = function () { if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) { var b, c, e; if (b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && 0 >= e) return this.preloadAutoWidthImages(b), !1 } this.$element.addClass("owl-loading"), this.$stage = a("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized") }, e.prototype.setup = function () { var b = this.viewport(), c = this.options.responsive, d = -1, e = null; c ? (a.each(c, function (a) { b >= a && a > d && (d = Number(a)) }), e = a.extend({}, this.options, c[d]), delete e.responsive, e.responsiveClass && this.$element.attr("class", function (a, b) { return b.replace(/\b owl-responsive-\S+/g, "") }).addClass("owl-responsive-" + d)) : e = a.extend({}, this.options), (null === this.settings || this._breakpoint !== d) && (this.trigger("change", { property: { name: "settings", value: e } }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", { property: { name: "settings", value: this.settings } })) }, e.prototype.optionsLogic = function () { this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1) }, e.prototype.prepare = function (b) { var c = this.trigger("prepare", { content: b }); return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(b)), this.trigger("prepared", { content: c.data }), c.data }, e.prototype.update = function () { for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) { return this[a] }, this._invalidated), e = {}; c > b;) (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++; this._invalidated = {} }, e.prototype.width = function (a) { switch (a = a || e.Width.Default) { case e.Width.Inner: case e.Width.Outer: return this._width; default: return this._width - 2 * this.settings.stagePadding + this.settings.margin } }, e.prototype.refresh = function () { if (0 === this._items.length) return !1; (new Date).getTime(); this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = b.orientation, this.watchVisibility(), this.trigger("refreshed") }, e.prototype.eventsCall = function () { this.e._onDragStart = a.proxy(function (a) { this.onDragStart(a) }, this), this.e._onDragMove = a.proxy(function (a) { this.onDragMove(a) }, this), this.e._onDragEnd = a.proxy(function (a) { this.onDragEnd(a) }, this), this.e._onResize = a.proxy(function (a) { this.onResize(a) }, this), this.e._transitionEnd = a.proxy(function (a) { this.transitionEnd(a) }, this), this.e._preventClick = a.proxy(function (a) { this.preventClick(a) }, this) }, e.prototype.onThrottledResize = function () { b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate) }, e.prototype.onResize = function () { return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1 }, e.prototype.eventsRouter = function (a) { var b = a.type; "mousedown" === b || "touchstart" === b ? this.onDragStart(a) : "mousemove" === b || "touchmove" === b ? this.onDragMove(a) : "mouseup" === b || "touchend" === b ? this.onDragEnd(a) : "touchcancel" === b && this.onDragEnd(a) }, e.prototype.internalEvents = function () { var c = (k(), l()); this.settings.mouseDrag ? (this.$stage.on("mousedown", a.proxy(function (a) { this.eventsRouter(a) }, this)), this.$stage.on("dragstart", function () { return !1 }), this.$stage.get(0).onselectstart = function () { return !1 }) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !c && this.$stage.on("touchstart touchcancel", a.proxy(function (a) { this.eventsRouter(a) }, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), this.settings.responsive !== !1 && this.on(b, "resize", a.proxy(this.onThrottledResize, this)) }, e.prototype.onDragStart = function (d) { var e, g, h, i; if (e = d.originalEvent || d || b.event, 3 === e.which || this.state.isTouch) return !1; if ("mousedown" === e.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, g = f(e).x, h = f(e).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) i = this.getTransformProperty(), this.drag.offsetX = i, this.animate(i), this.state.inMotion = !0; else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, !1; this.drag.startX = g - this.drag.offsetX, this.drag.startY = h - this.drag.offsetY, this.drag.start = g - this.drag.startX, this.drag.targetEl = e.target || e.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), a(c).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", a.proxy(function (a) { this.eventsRouter(a) }, this)) }, e.prototype.onDragMove = function (a) { var c, e, g, h, i, j; this.state.isTouch && (this.state.isScrolling || (c = a.originalEvent || a || b.event, e = f(c).x, g = f(c).y, this.drag.currentX = e - this.drag.startX, this.drag.currentY = g - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (h = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), i = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), j = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, h + j), i + j)), (this.drag.distance > 8 || this.drag.distance < -8) && (c.preventDefault !== d ? c.preventDefault() : c.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX))) }, e.prototype.onDragEnd = function (b) { var d, e, f; if (this.state.isTouch) { if ("mouseup" === b.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, !1; this.drag.endTime = (new Date).getTime(), d = this.drag.endTime - this.drag.startTime, e = Math.abs(this.drag.distance), (e > 3 || d > 300) && this.removeClick(this.drag.targetEl), f = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(f), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(f) || this.transitionEnd(), this.drag.distance = 0, a(c).off(".owl.dragEvents") } }, e.prototype.removeClick = function (c) { this.drag.targetEl = c, a(c).on("click.preventClick", this.e._preventClick), b.setTimeout(function () { a(c).off("click.preventClick") }, 300) }, e.prototype.preventClick = function (b) { b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation && b.stopPropagation(), a(b.target).off("click.preventClick") }, e.prototype.getTransformProperty = function () { var a, c; return a = b.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), a = a.replace(/matrix(3d)?\(|\)/g, "").split(","), c = 16 === a.length, c !== !0 ? a[4] : a[12] }, e.prototype.closest = function (b) { var c = -1, d = 30, e = this.width(), f = this.coordinates(); return this.settings.freeDrag || a.each(f, a.proxy(function (a, g) { return b > g - d && g + d > b ? c = a : this.op(b, "<", g) && this.op(b, ">", f[a + 1] || g - e) && (c = "left" === this.state.direction ? a + 1 : a), -1 === c }, this)), this.settings.loop || (this.op(b, ">", f[this.minimum()]) ? c = b = this.minimum() : this.op(b, "<", f[this.maximum()]) && (c = b = this.maximum())), c }, e.prototype.animate = function (b) { this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({ transform: "translate3d(" + b + "px,0px, 0px)", transition: this.speed() / 1e3 + "s" }) : this.state.isTouch ? this.$stage.css({ left: b + "px" }) : this.$stage.animate({ left: b }, this.speed() / 1e3, this.settings.fallbackEasing, a.proxy(function () { this.state.inMotion && this.transitionEnd() }, this)) }, e.prototype.current = function (a) { if (a === d) return this._current; if (0 === this._items.length) return d; if (a = this.normalize(a), this._current !== a) { var b = this.trigger("change", { property: { name: "position", value: a } }); b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", { property: { name: "position", value: this._current } }) } return this._current }, e.prototype.invalidate = function (a) { this._invalidated[a] = !0 }, e.prototype.reset = function (a) { a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"])) }, e.prototype.normalize = function (b, c) { var e = c ? this._items.length : this._items.length + this._clones.length; return !a.isNumeric(b) || 1 > e ? d : b = this._clones.length ? (b % e + e) % e : Math.max(this.minimum(c), Math.min(this.maximum(c), b)) }, e.prototype.relative = function (a) { return a = this.normalize(a), a -= this._clones.length / 2, this.normalize(a, !0) }, e.prototype.maximum = function (a) { var b, c, d, e = 0, f = this.settings; if (a) return this._items.length - 1; if (!f.loop && f.center) b = this._items.length - 1; else if (f.loop || f.center) if (f.loop || f.center) b = this._items.length + f.items; else { if (!f.autoWidth && !f.merge) throw "Can not detect maximum absolute position."; for (revert = f.rtl ? 1 : -1, c = this.$stage.width() - this.$element.width() ; (d = this.coordinates(e)) && !(d * revert >= c) ;) b = ++e } else b = this._items.length - f.items; return b }, e.prototype.minimum = function (a) { return a ? 0 : this._clones.length / 2 }, e.prototype.items = function (a) { return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a]) }, e.prototype.mergers = function (a) { return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a]) }, e.prototype.clones = function (b) { var c = this._clones.length / 2, e = c + this._items.length, f = function (a) { return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2 }; return b === d ? a.map(this._clones, function (a, b) { return f(b) }) : a.map(this._clones, function (a, c) { return a === b ? f(c) : null }) }, e.prototype.speed = function (a) { return a !== d && (this._speed = a), this._speed }, e.prototype.coordinates = function (b) { var c = null; return b === d ? a.map(this._coordinates, a.proxy(function (a, b) { return this.coordinates(b) }, this)) : (this.settings.center ? (c = this._coordinates[b], c += (this.width() - c + (this._coordinates[b - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : c = this._coordinates[b - 1] || 0, c) }, e.prototype.duration = function (a, b, c) { return Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed) }, e.prototype.to = function (c, d) { if (this.settings.loop) { var e = c - this.relative(this.current()), f = this.current(), g = this.current(), h = this.current() + e, i = 0 > g - h ? !0 : !1, j = this._clones.length + this._items.length; h < this.settings.items && i === !1 ? (f = g + this._items.length, this.reset(f)) : h >= j - this.settings.items && i === !0 && (f = g - this._items.length, this.reset(f)), b.clearTimeout(this.e._goToLoop), this.e._goToLoop = b.setTimeout(a.proxy(function () { this.speed(this.duration(this.current(), f + e, d)), this.current(f + e), this.update() }, this), 30) } else this.speed(this.duration(this.current(), c, d)), this.current(c), this.update() }, e.prototype.next = function (a) { a = a || !1, this.to(this.relative(this.current()) + 1, a) }, e.prototype.prev = function (a) { a = a || !1, this.to(this.relative(this.current()) - 1, a) }, e.prototype.transitionEnd = function (a) { return a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, void this.trigger("translated")) }, e.prototype.viewport = function () { var d; if (this.options.responsiveBaseElement !== b) d = a(this.options.responsiveBaseElement).width(); else if (b.innerWidth) d = b.innerWidth; else { if (!c.documentElement || !c.documentElement.clientWidth) throw "Can not detect viewport width."; d = c.documentElement.clientWidth } return d }, e.prototype.replace = function (b) { this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () { return 1 === this.nodeType }).each(a.proxy(function (a, b) { b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1) }, this)), this.reset(a.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items") }, e.prototype.add = function (a, b) { b = b === d ? this._items.length : this.normalize(b, !0), this.trigger("add", { content: a, position: b }), 0 === this._items.length || b === this._items.length ? (this.$stage.append(a), this._items.push(a), this._mergers.push(1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[b].before(a), this._items.splice(b, 0, a), this._mergers.splice(b, 0, 1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", { content: a, position: b }) }, e.prototype.remove = function (a) { a = this.normalize(a, !0), a !== d && (this.trigger("remove", { content: this._items[a], position: a }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", { content: null, position: a })) }, e.prototype.addTriggerableEvents = function () { var b = a.proxy(function (b, c) { return a.proxy(function (a) { a.relatedTarget !== this && (this.suppress([c]), b.apply(this, [].slice.call(arguments, 1)), this.release([c])) }, this) }, this); a.each({ next: this.next, prev: this.prev, to: this.to, destroy: this.destroy, refresh: this.refresh, replace: this.replace, add: this.add, remove: this.remove }, a.proxy(function (a, c) { this.$element.on(a + ".owl.carousel", b(c, a + ".owl.carousel")) }, this)) }, e.prototype.watchVisibility = function () { function c(a) { return a.offsetWidth > 0 && a.offsetHeight > 0 } function d() { c(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), b.clearInterval(this.e._checkVisibile)) } c(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), b.clearInterval(this.e._checkVisibile), this.e._checkVisibile = b.setInterval(a.proxy(d, this), 500)) }, e.prototype.preloadAutoWidthImages = function (b) { var c, d, e, f; c = 0, d = this, b.each(function (g, h) { e = a(h), f = new Image, f.onload = function () { c++, e.attr("src", f.src), e.css("opacity", 1), c >= b.length && (d.state.imagesLoaded = !0, d.initialize()) }, f.src = e.attr("src") || e.attr("data-src") || e.attr("data-src-retina") }) }, e.prototype.destroy = function () { this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), this.settings.responsive !== !1 && a(b).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd); for (var d in this._plugins) this._plugins[d].destroy(); (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), a(c).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function () { }, this.$stage.off("dragstart", function () { return !1 })), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap() }, e.prototype.op = function (a, b, c) { var d = this.settings.rtl; switch (b) { case "<": return d ? a > c : c > a; case ">": return d ? c > a : a > c; case ">=": return d ? c >= a : a >= c; case "<=": return d ? a >= c : c >= a } }, e.prototype.on = function (a, b, c, d) { a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c) }, e.prototype.off = function (a, b, c, d) { a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c) }, e.prototype.trigger = function (b, c, d) { var e = { item: { count: this._items.length, index: this.current() } }, f = a.camelCase(a.grep(["on", b, d], function (a) { return a }).join("-").toLowerCase()), g = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({ relatedTarget: this }, e, c)); return this._supress[b] || (a.each(this._plugins, function (a, b) { b.onTrigger && b.onTrigger(g) }), this.$element.trigger(g), this.settings && "function" == typeof this.settings[f] && this.settings[f].apply(this, g)), g }, e.prototype.suppress = function (b) { a.each(b, a.proxy(function (a, b) { this._supress[b] = !0 }, this)) }, e.prototype.release = function (b) { a.each(b, a.proxy(function (a, b) { delete this._supress[b] }, this)) }, e.prototype.browserSupport = function () { if (this.support3d = j(), this.support3d) { this.transformVendor = i(); var a = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"]; this.transitionEndVendor = a[h()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : "" } this.state.orientation = b.orientation }, a.fn.owlCarousel = function (b) { return this.each(function () { a(this).data("owlCarousel") || a(this).data("owlCarousel", new e(this, b)) }) }, a.fn.owlCarousel.Constructor = e }(window.Zepto || window.jQuery, window, document), function (a, b) { var c = function (b) { this._core = b, this._loaded = [], this._handlers = { "initialized.owl.carousel change.owl.carousel": a.proxy(function (b) { if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) for (var c = this._core.settings, d = c.center && Math.ceil(c.items / 2) || c.items, e = c.center && -1 * d || 0, f = (b.property && b.property.value || this._core.current()) + e, g = this._core.clones().length, h = a.proxy(function (a, b) { this.load(b) }, this) ; e++ < d;) this.load(g / 2 + this._core.relative(f)), g && a.each(this._core.clones(this._core.relative(f++)), h) }, this) }, this._core.options = a.extend({}, c.Defaults, this._core.options), this._core.$element.on(this._handlers) }; c.Defaults = { lazyLoad: !1 }, c.prototype.load = function (c) { var d = this._core.$stage.children().eq(c), e = d && d.find(".owl-lazy"); !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) { var e, f = a(d), g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src"); this._core.trigger("load", { element: f, url: g }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () { f.css("opacity", 1), this._core.trigger("loaded", { element: f, url: g }, "lazy") }, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function () { f.css({ "background-image": "url(" + g + ")", opacity: "1" }), this._core.trigger("loaded", { element: f, url: g }, "lazy") }, this), e.src = g) }, this)), this._loaded.push(d.get(0))) }, c.prototype.destroy = function () { var a, b; for (a in this.handlers) this._core.$element.off(a, this.handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.Lazy = c }(window.Zepto || window.jQuery, window, document), function (a) { var b = function (c) { this._core = c, this._handlers = { "initialized.owl.carousel": a.proxy(function () { this._core.settings.autoHeight && this.update() }, this), "changed.owl.carousel": a.proxy(function (a) { this._core.settings.autoHeight && "position" == a.property.name && this.update() }, this), "loaded.owl.lazy": a.proxy(function (a) { this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update() }, this) }, this._core.options = a.extend({}, b.Defaults, this._core.options), this._core.$element.on(this._handlers) }; b.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }, b.prototype.update = function () { this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass) }, b.prototype.destroy = function () { var a, b; for (a in this._handlers) this._core.$element.off(a, this._handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = b }(window.Zepto || window.jQuery, window, document), function (a, b, c) { var d = function (b) { this._core = b, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = { "resize.owl.carousel": a.proxy(function (a) { this._core.settings.video && !this.isInFullScreen() && a.preventDefault() }, this), "refresh.owl.carousel changed.owl.carousel": a.proxy(function () { this._playing && this.stop() }, this), "prepared.owl.carousel": a.proxy(function (b) { var c = a(b.content).find(".owl-video"); c.length && (c.css("display", "none"), this.fetch(c, a(b.content))) }, this) }, this._core.options = a.extend({}, d.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) { this.play(a) }, this)) }; d.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }, d.prototype.fetch = function (a, b) { var c = a.attr("data-vimeo-id") ? "vimeo" : "youtube", d = a.attr("data-vimeo-id") || a.attr("data-youtube-id"), e = a.attr("data-width") || this._core.settings.videoWidth, f = a.attr("data-height") || this._core.settings.videoHeight, g = a.attr("href"); if (!g) throw new Error("Missing video URL."); if (d = g.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube"; else { if (!(d[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported."); c = "vimeo" } d = d[6], this._videos[g] = { type: c, id: d, width: e, height: f }, b.attr("data-video", g), this.thumbnail(a, this._videos[g]) }, d.prototype.thumbnail = function (b, c) { var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "", h = b.find("img"), i = "src", j = "", k = this._core.settings, l = function (a) { e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e) }; return b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length ? (l(h.attr(i)), h.remove(), !1) : void ("youtube" === c.type ? (f = "http://img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type && a.ajax({ type: "GET", url: "http://vimeo.com/api/v2/video/" + c.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (a) { f = a[0].thumbnail_large, l(f) } })) }, d.prototype.stop = function () { this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null }, d.prototype.play = function (b) { this._core.trigger("play", null, "video"), this._playing && this.stop(); var c, d, e = a(b.target || b.srcElement), f = e.closest("." + this._core.settings.itemClass), g = this._videos[f.attr("data-video")], h = g.width || "100%", i = g.height || this._core.$stage.height(); "youtube" === g.type ? c = '<iframe width="' + h + '" height="' + i + '" src="http://www.youtube.com/embed/' + g.id + "?autoplay=1&v=" + g.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === g.type && (c = '<iframe src="http://player.vimeo.com/video/' + g.id + '?autoplay=1" width="' + h + '" height="' + i + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), f.addClass("owl-video-playing"), this._playing = f, d = a('<div style="height:' + i + "px; width:" + h + 'px" class="owl-video-frame">' + c + "</div>"), e.after(d) }, d.prototype.isInFullScreen = function () { var d = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement; return d && a(d).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), d && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, !1) : this._playing && this._core.state.orientation !== b.orientation ? (this._core.state.orientation = b.orientation, !1) : !0 }, d.prototype.destroy = function () { var a, b; this._core.$element.off("click.owl.video"); for (a in this._handlers) this._core.$element.off(a, this._handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.Video = d }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = { "change.owl.carousel": a.proxy(function (a) { "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value) }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) { this.swapping = "translated" == a.type }, this), "translate.owl.carousel": a.proxy(function () { this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap() }, this) }, this.core.$element.on(this.handlers) }; e.Defaults = { animateOut: !1, animateIn: !1 }, e.prototype.swap = function () { if (1 === this.core.settings.items && this.core.support3d) { this.core.speed(0); var b, c = a.proxy(this.clear, this), d = this.core.$stage.children().eq(this.previous), e = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut; this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.css({ left: b + "px" }).addClass("animated owl-animated-out").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c)), f && e.addClass("animated owl-animated-in").addClass(f).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c)) } }, e.prototype.clear = function (b) { a(b.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd() }, e.prototype.destroy = function () { var a, b; for (a in this.handlers) this.core.$element.off(a, this.handlers[a]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null) }, a.fn.owlCarousel.Constructor.Plugins.Animate = e }(window.Zepto || window.jQuery, window, document), function (a, b, c) {
        var d = function (b) {
            this.core = b, this.core.options = a.extend({}, d.Defaults, this.core.options), this.handlers = {
                "translated.owl.carousel refreshed.owl.carousel": a.proxy(function () {
                    this.autoplay()
                }, this), "play.owl.autoplay": a.proxy(function (a, b, c) { this.play(b, c) }, this), "stop.owl.autoplay": a.proxy(function () { this.stop() }, this), "mouseover.owl.autoplay": a.proxy(function () { this.core.settings.autoplayHoverPause && this.pause() }, this), "mouseleave.owl.autoplay": a.proxy(function () { this.core.settings.autoplayHoverPause && this.autoplay() }, this)
            }, this.core.$element.on(this.handlers)
        }; d.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }, d.prototype.autoplay = function () { this.core.settings.autoplay && !this.core.state.videoPlay ? (b.clearInterval(this.interval), this.interval = b.setInterval(a.proxy(function () { this.play() }, this), this.core.settings.autoplayTimeout)) : b.clearInterval(this.interval) }, d.prototype.play = function () { return c.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void b.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed) }, d.prototype.stop = function () { b.clearInterval(this.interval) }, d.prototype.pause = function () { b.clearInterval(this.interval) }, d.prototype.destroy = function () { var a, c; b.clearInterval(this.interval); for (a in this.handlers) this.core.$element.off(a, this.handlers[a]); for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null) }, a.fn.owlCarousel.Constructor.Plugins.autoplay = d
    }(window.Zepto || window.jQuery, window, document), function (a) { "use strict"; var b = function (c) { this._core = c, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }, this._handlers = { "prepared.owl.carousel": a.proxy(function (b) { this._core.settings.dotsData && this._templates.push(a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot")) }, this), "add.owl.carousel": a.proxy(function (b) { this._core.settings.dotsData && this._templates.splice(b.position, 0, a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot")) }, this), "remove.owl.carousel prepared.owl.carousel": a.proxy(function (a) { this._core.settings.dotsData && this._templates.splice(a.position, 1) }, this), "change.owl.carousel": a.proxy(function (a) { if ("position" == a.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) { var b = this._core.current(), c = this._core.maximum(), d = this._core.minimum(); a.data = a.property.value > c ? b >= c ? d : c : a.property.value < d ? c : a.property.value } }, this), "changed.owl.carousel": a.proxy(function (a) { "position" == a.property.name && this.draw() }, this), "refreshed.owl.carousel": a.proxy(function () { this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation") }, this) }, this._core.options = a.extend({}, b.Defaults, this._core.options), this.$element.on(this._handlers) }; b.Defaults = { nav: !1, navRewind: !0, navText: ["prev", "next"], navSpeed: !1, navElement: "div", navContainer: !1, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: !0, dotsEach: !1, dotData: !1, dotsSpeed: !1, dotsContainer: !1, controlsClass: "owl-controls" }, b.prototype.initialize = function () { var b, c, d = this._core.settings; d.dotsData || (this._templates = [a("<div>").addClass(d.dotClass).append(a("<span>")).prop("outerHTML")]), d.navContainer && d.dotsContainer || (this._controls.$container = a("<div>").addClass(d.controlsClass).appendTo(this.$element)), this._controls.$indicators = d.dotsContainer ? a(d.dotsContainer) : a("<div>").hide().addClass(d.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", a.proxy(function (b) { var c = a(b.target).parent().is(this._controls.$indicators) ? a(b.target).index() : a(b.target).parent().index(); b.preventDefault(), this.to(c, d.dotsSpeed) }, this)), b = d.navContainer ? a(d.navContainer) : a("<div>").addClass(d.navContainerClass).prependTo(this._controls.$container), this._controls.$next = a("<" + d.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(d.navClass[0]).html(d.navText[0]).hide().prependTo(b).on("click", a.proxy(function () { this.prev(d.navSpeed) }, this)), this._controls.$next.addClass(d.navClass[1]).html(d.navText[1]).hide().appendTo(b).on("click", a.proxy(function () { this.next(d.navSpeed) }, this)); for (c in this._overrides) this._core[c] = a.proxy(this[c], this) }, b.prototype.destroy = function () { var a, b, c, d; for (a in this._handlers) this.$element.off(a, this._handlers[a]); for (b in this._controls) this._controls[b].remove(); for (d in this.overides) this._core[d] = this._overrides[d]; for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null) }, b.prototype.update = function () { var a, b, c, d = this._core.settings, e = this._core.clones().length / 2, f = e + this._core.items().length, g = d.center || d.autoWidth || d.dotData ? 1 : d.dotsEach || d.items; if ("page" !== d.slideBy && (d.slideBy = Math.min(d.slideBy, d.items)), d.dots || "page" == d.slideBy) for (this._pages = [], a = e, b = 0, c = 0; f > a; a++) (b >= g || 0 === b) && (this._pages.push({ start: a - e, end: a - e + g - 1 }), b = 0, ++c), b += this._core.mergers(this._core.relative(a)) }, b.prototype.draw = function () { var b, c, d = "", e = this._core.settings, f = (this._core.$stage.children(), this._core.relative(this._core.current())); if (!e.nav || e.loop || e.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= f), this._controls.$next.toggleClass("disabled", f >= this._core.maximum())), this._controls.$previous.toggle(e.nav), this._controls.$next.toggle(e.nav), e.dots) { if (b = this._pages.length - this._controls.$indicators.children().length, e.dotData && 0 !== b) { for (c = 0; c < this._controls.$indicators.children().length; c++) d += this._templates[this._core.relative(c)]; this._controls.$indicators.html(d) } else b > 0 ? (d = new Array(b + 1).join(this._templates[0]), this._controls.$indicators.append(d)) : 0 > b && this._controls.$indicators.children().slice(b).remove(); this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active") } this._controls.$indicators.toggle(e.dots) }, b.prototype.onTrigger = function (b) { var c = this._core.settings; b.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotData ? 1 : c.dotsEach || c.items) } }, b.prototype.current = function () { var b = this._core.relative(this._core.current()); return a.grep(this._pages, function (a) { return a.start <= b && a.end >= b }).pop() }, b.prototype.getPosition = function (b) { var c, d, e = this._core.settings; return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c }, b.prototype.next = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b) }, b.prototype.prev = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b) }, b.prototype.to = function (b, c, d) { var e; d ? a.proxy(this._overrides.to, this._core)(b, c) : (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) }, a.fn.owlCarousel.Constructor.Plugins.Navigation = b }(window.Zepto || window.jQuery, window, document), function (a, b) { "use strict"; var c = function (d) { this._core = d, this._hashes = {}, this.$element = this._core.$element, this._handlers = { "initialized.owl.carousel": a.proxy(function () { "URLHash" == this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation") }, this), "prepared.owl.carousel": a.proxy(function (b) { var c = a(b.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash"); this._hashes[c] = b.content }, this) }, this._core.options = a.extend({}, c.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function () { var a = b.location.hash.substring(1), c = this._core.$stage.children(), d = this._hashes[a] && c.index(this._hashes[a]) || 0; return a ? void this._core.to(d, !1, !0) : !1 }, this)) }; c.Defaults = { URLhashListener: !1 }, c.prototype.destroy = function () { var c, d; a(b).off("hashchange.owl.navigation"); for (c in this._handlers) this._core.$element.off(c, this._handlers[c]); for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null) }, a.fn.owlCarousel.Constructor.Plugins.Hash = c }(window.Zepto || window.jQuery, window, document);

    var aboutExists = document.getElementsByClassName("microbit-carousel");


    if (aboutExists) {
        $('.microbit-carousel').owlCarousel({
            loop: false,
            margin: 10,
            nav: false,
            URLhashListener: true,
            autoplayHoverPause: true,
            startPosition: 'front',
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }
        })
    }

    $('#accordion .panel-heading').click(function () {
        $(this).toggleClass('expanded');
        var accordionId = '#collapse' + $(this).find('h4').attr('id').substr(4);
        $(accordionId).toggle('fast');

    });

    if ($(".card__footer").is(":focus")) {
        //console.log("link focussed");
        $(this).find(".more-link").click();

    };

    //code to open cards on tabbed
    //this was made independent of the click function to ensure it would function correctly on multiple devices
    $(window).keyup(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13 && $("#loadMore:focus").length){
            //console.log("entered pressed");
            loadMore();
        }
        if (code == 9 && $('.card__footer:focus').length) {
            
            var card = $('.card__footer:focus').closest(".card");
            card.addClass('active');

            var supporting = card.find(".card__supporting");

            supporting.find(".card-link").attr('tabindex', '0');

            var close = supporting.find(".close-link");
            close.attr('tabindex', '0');

            close.focusout(function () {
                card.removeClass('active');
                close.attr('tabindex', '-1');
                supporting.find(".card-link").attr('tabindex', '-1');
            });
        }
        if (code == 9 && $('.clicker:focus').length) {
            var langMenu = $('.click-nav .js');
            $('.click-nav .js').click();
            var welsh = $('.last--lang');
            welsh.focusout(function () {
                
                    if ($('.click-nav .js ul').is(':visible')) {
                        $('.click-nav .js ul').slideToggle(200);
                        $('.clicker').removeClass('active');
                    }
                
            });
          };
    });

    $(document).on('click', '.more-filters', function (e) {
        e.preventDefault();
        $(this).toggleClass("shown");
        $(".temp").slideToggle();
        $(".temp").toggleClass("open");
        var icon 
    });

    $(document).on('click', '.mobile-filters', function (e) {
        e.preventDefault();
        $(this).toggleClass("shown");
        $(".mobile-filter-list").toggleClass("open");
        $(".mobile-filter-list").slideToggle();
    });


    $(window).resize(function () {

        if ($(window).width() < 992) {
            $(".mobile-filter-list.open").show();
            $(".temp.open").hide();
        }
        else {
            $(".mobile-filter-list.open").hide();
            $(".temp.open").show();
        }

    });

    //jQuery(function ($) {
    //    function fixDiv() {
    //        var $cache = $('.fixed-menu');
    //        if ($(window).scrollTop() > 100)
    //            $cache.css({
    //                'position': 'fixed',
    //                'top': '10px'
    //            });
    //        else
    //            $cache.css({
    //                'position': 'relative',
    //                'top': 'auto'
    //            });
    //    }
    //    $(window).scroll(fixDiv);
    //    fixDiv();
    //});

});
