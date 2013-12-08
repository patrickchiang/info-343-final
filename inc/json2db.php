<?php
	/*
	 MySQL database setup:
	 Execute the following SQL queries:

	 CREATE TABLE IF NOT EXISTS `courses` (
	 `id` int(11) NOT NULL AUTO_INCREMENT,
	 `dept` varchar(8) NOT NULL,
	 `num` varchar(4) NOT NULL,
	 `section` varchar(3) NOT NULL,
	 `instructor` varchar(30) NOT NULL,
	 `quarter` varchar(4) NOT NULL,
	 `surveyed` int(11) NOT NULL,
	 `enrolled` int(11) NOT NULL,
     `median` float, 
	 UNIQUE KEY `id` (`id`)
	 ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

	 CREATE TABLE IF NOT EXISTS `scores` (
	 `course_id` int(11) NOT NULL,
	 `question` varchar(50) NOT NULL,
	 `excellent` int(11) NOT NULL,
	 `verygood` int(11) NOT NULL,
	 `good` int(11) NOT NULL,
	 `fair` int(11) NOT NULL,
	 `poor` int(11) NOT NULL,
	 `verypoor` int(11) NOT NULL,
	 `median` float NOT NULL
	 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

	 */

	$string = file_get_contents("../data/I.json");
	$json = json_decode($string, true);
    
    echo $string;

	try {
		// connect to mysql don't hack me thanks
		$host = "localhost";
		$dbname = "pchiang_uvaluate";
		$user = "pchiang_uvaluate";
		$pass = "info343final";
		$dbh = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
		
		foreach ($json as $row) {
			// for the courses
			$dept = $row[dept];
			$num = $row[num];
			$section = $row[section];
			$instructor = $row[instructor];
			$quarter = $row[quarter];
			$surveyed = $row[surveyed];
			$enrolled = $row[enrolled];

			$stmt = $dbh->prepare("INSERT INTO `courses` (`dept`, `num`, `section`, `instructor`, `quarter`, `surveyed`, `enrolled`) VALUES ('$dept', '$num', '$section', '$instructor', '$quarter', '$surveyed', '$enrolled');");
			$stmt->execute();

			$id = $dbh->lastInsertId();

			$median = 0;
			$i = 0;

			// for the scores
			foreach ($row as $key => $info) {
				if (is_array($info)) {
					$stmt = $dbh->prepare("INSERT INTO scores (course_id, question, excellent, verygood, good, fair, poor, verypoor, median) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);");

					$stmt->bindParam(1, $id);
					$stmt->bindParam(2, $key);
					$stmt->bindParam(3, $info[0]);
					$stmt->bindParam(4, $info[1]);
					$stmt->bindParam(5, $info[2]);
					$stmt->bindParam(6, $info[3]);
					$stmt->bindParam(7, $info[4]);
					$stmt->bindParam(8, $info[5]);
					$stmt->bindParam(9, $info[6]);
                                        
					$median += $info[6];
					$i++;

					$stmt->execute();
				}
			}
                        
            $avg = $median / $i;
                        
			$stmt = $dbh->prepare("UPDATE courses SET median=$avg WHERE id=$id");
			$stmt->execute();
		}

		$dbh = null;
	} catch(PDOException $e) {
		echo $e->getMessage();
	}
?>