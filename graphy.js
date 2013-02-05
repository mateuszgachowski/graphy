(function(window, document, $, undefined) {
	'use strict';
	
	
	$.fn.extend({
		graphy: function (customParams) {
			var defaults;
			var options;
			var chartData;
			var core;
			var degreeIterator;
			var deg;
			var percent;
			var tempValue;
			
			
			/**
			 * Default options to be extended by customParams
			 * @type {Object}
			 */
			defaults = {
				valueDataset: 'data-value',														// Attribute containing values based on which we'll be computing percentages
				titleDataset: 'data-title',														// Labels
				colors: ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8']	// Basic colors for pie chart
			};
			
			/**
			 * Options (defaults extended by customParams)
			 * @type {Object}
			 */
			options = $.extend({}, defaults, customParams);
			
			chartData = this.children('[%attribute]'.replace('%attribute', options.valueDataset));
			
			degreeIterator = 0;
			
			core = {
				fullValue					: 0,
				dataValues				: [],
				currentColorIndex	: 0,
				ieMatrixCount: function (deg) {
					var rad;
					var costheta;
					var sintheta;
					var a;
					var b;
					var c;
					var d;
					var tx;
					var ty;
					
				  // use parseFloat twice to kill exponential numbers and avoid things like 0.00000000
				  rad 		 = deg * (Math.PI / 180);
					costheta = parseFloat(parseFloat(Math.cos(rad)).toFixed(8));
		  		sintheta = parseFloat(parseFloat(Math.sin(rad)).toFixed(8));
						
					// collect all of the values  in our matrix
					a  = costheta,
					b  = sintheta,
					c  = -sintheta,
					d  = costheta,
					tx = 0,
					ty = 0;
					
					return 'progid:DXImageTransform.Microsoft.Matrix(M11=' + a + ', M12=' + c + ', M21=' + b + ', M22=' + d + ', sizingMethod=\'auto expand\')';		
				},
				dataStartStyles: function (value) {
					$(this).css({
						'-moz-transform'		: 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform'			: 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform'	: 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform'			: 'rotate(' + value + 'deg)', /* Opera */
						'transform'					: 'rotate(' + value + 'deg)',
						'-ms-filter'				: core.ieMatrixCount(value)
					});
					
					// @TODO: add here fixes for IE 7/8
				},
				dataValueStyles: function (value) {
					value += 1;
					if(value > 360) { value = 360 };
					
					$(this).children('.before').css({
						'-moz-transform'		: 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform'			: 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform'	: 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform'			: 'rotate(' + value + 'deg)', /* Opera */
						'transform'					: 'rotate(' + value + 'deg)',
						'-ms-filter'				: core.ieMatrixCount(value)
					});
				},
				dataAppendColors: function () {
					if(core.currentColorIndex === options.colors.length) {
						core.currentColorIndex = 0;
					}
					$(this).children().css({
						'background-color': options.colors[core.currentColorIndex]
					});

					core.currentColorIndex++;
				},
				countFullValue: function () {
					chartData.each(function (index) {		
						core.fullValue += ~~$(this).attr(options.valueDataset);
					});
				},
				createElements: function () {
					$(this).append('<div class="before">');
					$(this).append('<div class="after">');
				}
			};
			
			core.countFullValue();
			
			// @TODO: return this.each part is missing causing this plugin to not be chainable with other jQuery methods, e.g. $('body').graphy().hide().slideDown();
			
			
			chartData.each(function (index) {
				tempValue = (~~$(this).attr(options.valueDataset) / core.fullValue);
				deg 			= tempValue * 360;
				percent 	= tempValue * 100;

				core.createElements.call(this);
				core.dataAppendColors.call(this);
				core.dataStartStyles.call(this, degreeIterator);
				core.dataValueStyles.call(this, deg);
				
				if(percent>50) {
					$(this).addClass('big');
				}
				degreeIterator += deg;
			});
			
		}
	});
})(this, this.document, this.jQuery);
