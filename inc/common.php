<!-- This file provides php functions to allow other pages to use common code and 
	still be able to include files specific to each page -->

<?php
function startHead(){?>
<!DOCTYPE html>
<html>
<head>
	 <meta charset="UTF-8">
        <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.min.css">
        <!-- <link rel="shortcut icon" href=""> -->
        <!-- Title, individual js and css will be added here by each individual page -->
<?
}

function endHead(){?>
	</head>
	<body>
<?php
}

function startFooter(){?>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="lib/Chart.js-master/Chart.min.js"></script>
	<script type="text/javascript" src="https://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="https://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
<?php
}

function endFooter(){?>
	</body>
</html>
<?php 
} 
?>