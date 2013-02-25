/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, indent:2, latedef:true, newcap:true, noarg:true, noempty:true, nonew:true, quotmark:single, undef:true, unused:true, strict:true, trailing:true */

(function (window, document, $, undefined) {
  'use strict';


  $.fn.extend({
    /**
     * Graphy is a jQuery plugin/component which allows you to create easy pie charts
     *
     * Sample Usage:
     *
     *   // # HTML:
     *   // To be provided
     *
     *   // # JS:
     *   // To be provided
     *
     *
     * @chainable
     *
     * @param  {Object}  customParams  Plugin configuration, defaults to:
     *                                 {
     *                                   valueDataset : 'data-value',
     *                                   titleDataset : 'data-title',
     *                                   colors       : ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8', '#ff00ff'],
     *                                   canvasSize   : { width : 200, height : 200 }
     *                                 }
     * @return {Object}                jQuery collection of objects (chainable)
     */
    graphy: function (customParams) {
      var options;
      var chartData;
      var core;
      var degreeIterator;
      var deg;
      var percent;
      var tempValue;


      /**
       * Options (defaults extended by customParams)
       *
       * @type {Object}
       */
      options = $.extend({}, {
        valueDataset : 'data-value',                                            // Attribute containing values based on which we'll be computing percentages
        titleDataset : 'data-title',                                            // Labels
        colors       : ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8', '#ff00ff'], // Basic colors for pie chart
        canvasSize   : { width : 200, height : 200 }
      }, customParams);


      chartData = this.children('[%attribute]'.replace('%attribute', options.valueDataset));

      degreeIterator = 0;

      core = {
        fullValue         : 0,
        dataValues        : [],
        currentColorIndex : 0,
        sumTo: function (a, i) {
          var sum = 0;
          for (var j = 0; j < i; j++) {
            sum += a[j];
          }
          return sum;
        },
        degreesToRadians: function (degrees) {
          return (degrees * Math.PI / 180);
        },
        /* Canvas draw segment for IE fallback */
        drawSegment: function (canvas, context, i) {
          context.save();
          var centerX = Math.floor(canvas.width / 2);
          var centerY = Math.floor(canvas.height / 2);
          var radius = Math.floor(canvas.width / 2);

          var startingAngle = core.degreesToRadians(core.sumTo(core.dataValues, i) - 90);
          var arcSize = core.degreesToRadians(core.dataValues[i]);
          var endingAngle = startingAngle + arcSize;

          context.beginPath();
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
          context.closePath();

          context.fillStyle = options.colors[i];
          context.fill();

          context.restore();
        },
        drawCenterCircle: function (canvas, context) {
          context.save();
          var centerX = Math.floor(canvas.width / 2);
          var centerY = Math.floor(canvas.height / 2);
          var radius = Math.floor(70);

          var startingAngle = core.degreesToRadians(0);
          var arcSize = core.degreesToRadians(360);
          var endingAngle = startingAngle + arcSize;

          context.beginPath();
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
          context.closePath();

          context.fillStyle = $(this).children('.center').css('background-color');
          context.fill();

          context.restore();
        },
        ieFallback: function () {
          var canvas = $('<canvas id="canvas-fallback" width="%width" height="%height"></canvas>'.replace('%width', options.canvasSize.width).replace('%height', options.canvasSize.height));
          $('.graphy').prepend(canvas);

          canvas = canvas[0];

          // Explorer Canvas
          G_vmlCanvasManager.initElement(canvas);
          var context = canvas.getContext('2d');

          for (var i = 0; i < core.dataValues.length; i++) {
            core.drawSegment(canvas, context, i);
          }
          core.drawCenterCircle.call(this, canvas, context);
        },
        dataStartStyles: function (value) {
          //$(this).attr('style', '-ms-filter:'+core.ieMatrixCount(value));
          $(this).css({
            '-moz-transform'    : 'rotate(' + value + 'deg)', /* Firefox */
            '-ms-transform'     : 'rotate(' + value + 'deg)', /* IE */
            '-webkit-transform' : 'rotate(' + value + 'deg)', /* Safari and Chrome */
            '-o-transform'      : 'rotate(' + value + 'deg)', /* Opera */
            'transform'         : 'rotate(' + value + 'deg)'
          });

          // @TODO: add here fixes for IE 7/8
        },
        dataValueStyles: function (value) {
          value += 1;
          if (value > 360) { value = 360; }
          //$(this).children('.before').attr('style', '-ms-filter:'+core.ieMatrixCount(value));
          $(this).children('.before').css({
            '-moz-transform'    : 'rotate(' + value + 'deg)', /* Firefox */
            '-ms-transform'     : 'rotate(' + value + 'deg)', /* IE */
            '-webkit-transform' : 'rotate(' + value + 'deg)', /* Safari and Chrome */
            '-o-transform'      : 'rotate(' + value + 'deg)', /* Opera */
            'transform'         : 'rotate(' + value + 'deg)'
          });
        },
        dataAppendColors: function () {
          if (core.currentColorIndex === options.colors.length) {
            core.currentColorIndex = 0;
          }
          $(this).children().css({
            'background-color': options.colors[core.currentColorIndex]
          });

          core.currentColorIndex++;
        },
        countFullValue: function () {
          chartData.each(function () {
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


      chartData.each(function () {
        tempValue = (~~$(this).attr(options.valueDataset) / core.fullValue);
        deg       = tempValue * 360;
        percent   = tempValue * 100;

        core.createElements.call(this);
        core.dataAppendColors.call(this);
        core.dataStartStyles.call(this, degreeIterator);
        core.dataValueStyles.call(this, deg);

        core.dataValues.push(deg);

        if (percent > 50) {
          $(this).addClass('big');
        }
        degreeIterator += deg;
      });

      if (window.ie) {
        $(this).children('[class!="center"]').remove();
        core.ieFallback.call(this);
      }

    }
  });
})(this, this.document, this.jQuery);
