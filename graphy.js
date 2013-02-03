(function(window, document, $) {
	'use strict';
	
	
	$.fn.extend({
		graphy: function (customParams) {
			var defaults = {
				valueDataset: 'data-value',
				startDataset: 'data-start',
				titleDataset: 'data-title',
				colors: ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8']
			};
			
			var core = {
				fullValue: 0,
				dataValues: [],
				currentColorIndex: 0,
				dataStartStyles: function(object, value) {
					$(object).css({
						'-moz-transform': 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform': 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform': 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform': 'rotate(' + value + 'deg)', /* Opera */
						'transform': 'rotate(' + value + 'deg)'
					});
					
					// TODO: add here fixes for IE 7/8
				},
				dataValueStyles: function(object, value) {
					value = value + 1;
					if(value > 360) { value = 360 };
					
					$(object).children('.before').css({
						'-moz-transform': 'rotate(' + value + 'deg)', /* Firefox */
						'-ms-transform': 'rotate(' + value + 'deg)', /* IE */
						'-webkit-transform': 'rotate(' + value + 'deg)', /* Safari and Chrome */
						'-o-transform': 'rotate(' + value + 'deg)', /* Opera */
						'transform': 'rotate(' + value + 'deg)'
					});
				},
				dataAppendColors: function(object) {
					if(this.currentColorIndex === options.colors.length) {
						this.currentColorIndex = 0;
					}
					console.log(options.colors, this.currentColorIndex, options.colors.length);
					$(object).children().css({
						'background-color': options.colors[this.currentColorIndex]
					});

					this.currentColorIndex++;
				}
			};
			
			var options  = $.extend({}, defaults, customParams);
			
			console.log('Graphy initiated on element: ', this);
			var pieElements = this.children('[data-value]');
			
			console.log(
				$.makeArray(pieElements).reduce(function(prevValue, currentValue) {
					var prevObj;
					var currObj;
					if(typeof prevValue === 'object') {
						prevObj = ~~$(prevValue).attr(options.valueDataset);
					}
					else {
						prevObj = prevValue;
					}
					currObj = ~~$(currentValue).attr(options.valueDataset);
					return prevObj + currObj;
				}));
			var value;
			pieElements.each(function (index) {				
				if(value = ~~$(this).attr(options.valueDataset)) {
					$(this).append('<div class="before">');
					$(this).append('<div class="after">');
					core.dataAppendColors(this);
					core.fullValue += value;
				}
			});
			
			var iter = 0;
			pieElements.each(function (index) {
				if(value = ~~$(this).attr(options.valueDataset)) {
					var deg = (value/core.fullValue)*360;
					var percent = (value/core.fullValue)*100;
					if(percent>50) {
						$(this).addClass('big');
					}
					core.dataStartStyles(this, iter);
					core.dataValueStyles(this, deg)
					iter += deg;
				}
			});
			
		}
	});
})(window, document, jQuery);