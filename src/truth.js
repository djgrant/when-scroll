'use strict';

var ELEMENT_NODE = window.Node ? Node.ELEMENT_NODE : 1;

function Truth(type, distance, el) {
	this.type = type;
	this.distance = parseScrollDistance(distance);

	if (el && el.nodeType === ELEMENT_NODE) {
		this.el = el;
	}

	this._check = checks[this.type];

	if (typeof this._check !== 'function') {
		throw new Error(this.type + ' check not found');
	}

	this.multiple = this._check.multiple || false;
}

Truth.prototype.isTrue = function truthIsTrue(scrollTop) {
	return this._check(scrollTop);
};

module.exports = Truth;

var checks = {};

checks.below = function belowCheck(scrollTop) {
	return this.distance <= scrollTop;
};

checks.above = function aboveCheck(scrollTop) {
	return this.distance >= scrollTop;
};

checks.within = function withinCheck() {
	var viewportOffset = this.el.getBoundingClientRect().top;
	var windowHeight = window.innerHeight || document.documentElement.clientHeight;
	return viewportOffset - windowHeight < this.distance;
};

checks.every = function everyCheck(scrollTop) {
	if (!this._lastFiredAt) {
		this._lastFiredAt = 0;
	}

	if (Math.abs(this._lastFiredAt - scrollTop) >= this.distance) {
		this._lastFiredAt = scrollTop;
		return true;
	} else {
		return false;
	}
};
checks.every.multiple = true;

/**
 * Converts a string into a number of pixels. Currently only supports pixels.
 *
 * @todo: Support more than pixels!
 *
 * @param {string} distance The distance down the page in pixels.
 * @returns {Number} The distance down the page in pixels.
 */
function parseScrollDistance(distance) {
	return parseInt(distance);
}
