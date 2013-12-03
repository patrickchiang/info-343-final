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

<div class="texture">
	<img src="img/logo.png" alt="Uvaluate" class="logo"/>

	<div id="tabs">
		<ul>
			<li><a href="#class-tab">Classes</a></li>
			<li><a href="#instr-tab">Instructors</a></li>
		</ul>
		<div class='class-table' id="class-tab">
			<table class="table table-hover table-striped">
			  <thead>
			  	<tr>
			  		<td>Course Name</td>
			  		<td>Overall (X.XX/5)</td>
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
		<div class='instr-table' id="instr-tab">
			<table class="table table-hover table-striped">
			  <thead>
			  	<tr>
			  		<td>Instructor</td>
			  		<td>Overall (X.XX/5)</td>
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
			      	<div class='modal-table' id="modal-tab">
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
			        <h3 class="median"></h3>
						</div>
						<div class='panel-body'>
							<div class='chart-container'>
								<canvas id="display-chart" class="display-chart" width="450" height="350"></canvas>
							</div>
							<div class='graph-selector'></div>
						</div>
					</div>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
</div>

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