<?php

    
    
	try {
		// connect to mysql don't hack me thanks
		$host = "localhost";
		$dbname = "pchiang_uvaluate";
		$user = "pchiang_uvaluate";
		$pass = "info343final";
		$dbh = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
        
		$dbh = null;
	} catch(PDOException $e) {
		echo $e->getMessage();
	}
?>