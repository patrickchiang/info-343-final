<?php
include("inc/common.php");
startHead();
?>
<!-- Put any script and stylesheets unique to this page's header below here -->
	<link rel="stylesheet" href="css/index.css">
<!-- Put any script and stylesheets unique to this page's header above here -->
<?php endHead(); ?>

<!-- Everything below here is INSIDE the body tag -->
<div class='panel'>
	<canvas id="display-chart" width="400" height="400">
		<h2 class='class-name'></h2>
		<h3 class='instructor'></h3>
		<h3 class='quarter'></h3>
	</canvas>
</div>
<!-- Everything above here is INSIDE the body tag -->

<?php startFooter();?>
<!-- Put any script and stylesheets unique to this page's footer below here -->
	<script type="text/javascript" src="js/index.js"></script>
<!-- Put any script and stylesheets unique to this page's footer above here -->
<?php endFooter();?>