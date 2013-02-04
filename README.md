graphy
======

Graphy is a jQuery plugin/component which allows you to create easy pie charts.

Instalation:
------------

* Requires jQuery

<pre><link href="style.css" rel="stylesheet"></pre> in your head tag
<pre><script src="graphy.js"></script></pre> in your head tag (or at the bottom of the site)


How to run:
-----------

Running *graphy* is very simple, you just need to create an element which will contain all the data, and then init it!

Example (fifty-fifty):
<pre>
<!-- Create the main element - the ID is not nessesary or can be various, but the class *must be* .graphy -->
<div id="graphy" class="graphy">
  <!-- insert data values, for this example 300 and 300, which gives us 50%:50% -->
  <div data-value="300"></div>
  <div data-value="300"></div>
</div>

<script>
  $(document).ready(function() {
    /* Graphy init on the #graphy element */
  	$('#graphy').graphy();
	});
</script>
</pre>

Thats all!

Options:
--------

Graphy takes some options when initialized:
* (string) valueDataset [default: 'data-value']
* (string) titleDataset [default: null] (not yet supported)
* (array) colors        [default: ['#fd795b', '#bcf1ed', '#fdedd0', '#b76eb8']]

Example:
<pre>
  $('#graphy').graphy({
      colors: ['red', 'blue', 'green', 'yellow'],
      valueDataset: 'data-mywhatever',
      titleDataset: 'data-mysupertitle'
    });
</pre>

