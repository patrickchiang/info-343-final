<?php
include("inc/common.php");
startHead();
?>
<!-- Put any script and stylesheets unique to this page's header below here -->
	<link rel="stylesheet" href="css/index.css">
<!-- Put any script and stylesheets unique to this page's header above here -->
<?php endHead(); ?>

<div class='class-table'>
	<table class="table table-hover table-striped">
	  <thead>
	  	<tr>
	  		<td>Course Name</td>
	  		<td>Instructor</td>
	  		<td>Quarter</td>
	  	</tr>
	  </thead>
	  <tbody>
	  	<tr class='class-row template'>
	  		<td class='table-name'></td>
	  		<td class='table-instr'></td>
	  		<td class='table-qtr'></td>
	  	</tr>
	  </tbody>
	</table>
</div>

<!-- Everything below here is INSIDE the body tag -->
<div class='panel'>
	<h2 class='class-name'></h2>
	<h3 class='instructor'></h3>
	<h3 class='quarter'></h3>
	<canvas id="display-chart" width="400" height="400"></canvas>
	<div class='graph-selector'></div>
</div>
<!-- Everything above here is INSIDE the body tag -->

<?php startFooter();?>
<!-- Put any script and stylesheets unique to this page's footer below here -->
	<script type="text/javascript" src="js/index.js"></script>
<!-- Put any script and stylesheets unique to this page's footer above here -->
<?php endFooter();?>