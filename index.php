<?php
include("inc/common.php");
startHead();
?>
<!-- Put any script and stylesheets unique to this page's header below here -->
	<link rel="stylesheet" href="css/index.css">
	<link rel="shortcut icon" href="img/icon.png">
<!-- Put any script and stylesheets unique to this page's header above here -->
<?php endHead(); ?>
	<!-- Everything below here is INSIDE the body tag -->

<div class="main-col">
	<div id="tabs">
		<img src="img/logo.png" alt="Uvaluate" class="logo">

		<ul>
			<li><a href="#class-table" class='class-tab'>Classes</a></li>
			<li><a href="#instr-table" class='instr-tab'>Instructors</a></li>
		</ul>

		<div class='class-table' id="class-table">
			<table class="table table-hover table-striped">
			  <thead>
			  	<tr>
			  		<td><a href="#" rel="tooltip" title="Course ID of given course. Click on course you want to evaluate and discover information about the course">Course Name</a></td>
			  		<td><a href="#" rel="tooltip" title="All the professors' ratings that teach under this course divded by 5"> Overall (X.XX/5) </a></td>
			  		<td>Number of Instructors</td>
			  	</tr>
			  </thead>
			  <tbody>
			  	<tr class='merged-row template' data-target="#rowModal" data-toggle="modal">
			  		<td class='table-name'></td>
			  		<td class='table-median'></td>
			  		<td class='table-count'></td>
			  	</tr>
			  </tbody>
			</table>
		</div>
		<div class='instr-table' id="instr-table">
			<table class="table table-hover table-striped">
			  <thead>
			  	<tr>
			  		<td><a href="#" rel="tooltip" title="Course ID of given course. Click on course you want to evaluate and discover information about the course">Instructor </a></td>
			  		<td><a href="#" rel="tooltip" title="All the class ratings that the professor teaches divided by 5"> Overall (X.XX/5) </a></td>
			  		<td>Number of Classes</td>
			  	</tr>
			  </thead>
			  <tbody>
			  	<tr class='merged-row template' data-target="#rowModal" data-toggle="modal">
			  		<td class='table-name'></td>
			  		<td class='table-median'></td>
			  		<td class='table-count'></td>
			  	</tr>
			  </tbody>
			</table>
		</div>
	</div>
	<!-- Everything above here is INSIDE the body tag -->


	<div class="modal fade" id="rowModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	      </div>
	      <div class="modal-body">
	    		<div class='panel panel-primary info'>
						<div class="panel-heading">
	  	        <h2 class="main-type"></h2>
			      </div>
			      <div class="panel-body">
			      	<div class='modal-table' id="modal-table">
								<table class="table table-hover table-striped">
								  <thead>
								  	<tr>
								  		<td class="instr-header">Instructor</td>
								  		<td class="course-header">Class</td>
								  		<td>Quarter</td>
								  		<td>Section</td>
								  		<td>Overall (X.XX/5)</td>
								  	</tr>
								  </thead>
								  <tbody>
								  	<tr class='merged-row template'>
								  		<td class='modal-instr'></td>
								  		<td class='modal-name'></td>
								  		<td class='modal-qtr'></td>
								  		<td class='modal-sect'></td>
								  		<td class='modal-median'></td>
								  	</tr>
								  </tbody>
								</table>
							</div>
						</div>
					</div>
					<div class='panel panel-primary graph'>
						<div class='panel-heading'>
							<h2 class="other-type"></h2>
					        <h3 class="quarter"></h3>
					        <h3 class="section"></h3>
					        <h3 class="surveyed"></h3>
					        <h3 class="enrolled"></h3>
					        <h3 class="median"></h3>
						</div>
						<div class='panel-body'>
							<div class='chart-container'>
								
							</div>
							<div class='graph-selector'></div>
						</div>
					</div>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
</div>

<img src="img/bench2.jpg" alt="benches" class="bench"/>

<?php startFooter();?>
<!-- Put any script and stylesheets unique to this page's footer below here -->
	<script type="text/javascript" src="js/index.js"></script>
<!-- Put any script and stylesheets unique to this page's footer above here -->
<?php endFooter();?>

<!-- <div class='col-md-6'>
	<div class='panel panel-primary'>
		<div class="panel-heading">
			<h2 class='class-name'></h2>
			<h3 class='instructor'></h3>
			<h3 class='quarter'></h3>
		</div>
		<div class="panel-body">
			<canvas id="display-chart" width="400" height="400"></canvas>
			<div class='graph-selector'></div>
		 </div>
	</div>
</div> -->
