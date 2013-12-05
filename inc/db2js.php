<?php
    $query = $_GET['query'];

    if (isset($_GET['prof'])) {
        $prof = $_GET['prof'];
    } else {
        $prof = "";
    }

    if (isset($_GET['dept'])) {
        $dept = $_GET['dept'];
    } else {
        $dept = "";
    }

    if (isset($_GET['num'])) {
        $num = $_GET['num'];
    } else {
        $num = "";
    }

    if (isset($_GET['cid'])) {
        $cid = $_GET['cid'];
    } else {
        $cid = "";
    }

    if (isset($_GET['section'])) {
        $section = $_GET['section'];
    } else {
        $section = "";
    }

    if (isset($_POST['dept'])) {
        $bulk_dept = $_POST['dept'];
    } else {
        $bulk_dept = "";
    }

    if (isset($_POST['num'])) {
        $bulk_num = $_POST['num'];
    } else {
        $bulk_num = "";
    }

    try {
        // connect to mysql don't hack me thanks
        $host = "localhost";
        $dbname = "pchiang_uvaluate";
        $user = "pchiang_uvaluate";
        $pass = "info343final";
        $dbh = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);

        if ($query == "listcourses") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=listcourses
            $stmt = $dbh->query('SELECT DISTINCT dept, num FROM courses');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $allcourses = array();
            while ($row = $stmt->fetch()) {
                $allcourses[] = $row['dept'] . " " . $row['num'];
            }
            echo json_encode($allcourses);
        }

        if ($query == "listprofs") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=listprofs
            $stmt = $dbh->query('SELECT DISTINCT instructor FROM courses WHERE instructor <> " Unspecified" ORDER BY instructor ASC');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $instuctors = array();
            while ($row = $stmt->fetch()) {
                $instuctors[] = $row['instructor'];
            }
            echo json_encode($instuctors);
        }

        if ($query == "numprofsforsection") {
            $query_num = "";

            for ($i = 0; $i < count($bulk_dept); $i++) {
                $query_num .= 'SELECT COUNT(DISTINCT instructor) FROM courses WHERE dept = "' . $bulk_dept[$i] . '" AND num = "' . $bulk_num[$i] . '"';
                $query_num .= ' UNION ALL ';
            }

            $query_num = substr($query_num, 0, strlen($query_num) - 11);

            $stmt = $dbh->query($query_num);
            $stmt->setFetchMode(PDO::FETCH_ASSOC);

            $bulk_instructions = array();
            while ($row = $stmt->fetch()) {
                $bulk_instructions[] = $row['COUNT(DISTINCT instructor)'];
            }
            echo json_encode($bulk_instructions);
        }

        if ($query == "numclass") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=numclass&prof=Michael%20Eisenberg
            $stmt = $dbh->query('SELECT * FROM courses WHERE instructor LIKE "' . $prof . '"');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $numclasses = 0;
            while ($row = $stmt->fetch()) {
                $numclasses++;
            }
            echo $numclasses;
        }

        if ($query == "sumcoursescores") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=sumcoursescores&dept=INFO&num=200
            // This gives you estimated number of people who voted for each category

            if ($bulk_dept != "") {
                $query_num = "";

                for ($i = 0; $i < count($bulk_dept); $i++) {
                    $query_num .= 'SELECT SUM(s.median * c.surveyed) / SUM(c.surveyed) AS median FROM courses c JOIN scores s ON c.id = s.course_id WHERE c.dept = "' . $bulk_dept[$i] . '" AND c.num = "' . $bulk_num[$i] . '"';
                    $query_num .= ' UNION ALL ';
                }

                $query_num = substr($query_num, 0, strlen($query_num) - 11);
                
                $stmt = $dbh->query($query_num);
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $scores = array();
                while ($row = $stmt->fetch()) {
                    $scores[] = $row["median"];
                }
                echo json_encode($scores);

                die();
            }

            $stmt = $dbh->query('SELECT c.surveyed, s.excellent, s.verygood, s.good, s.fair, s.poor, s.verypoor, s.median FROM courses c JOIN scores s ON c.id = s.course_id WHERE c.dept = "' . $dept . '" AND c.num = "' . $num . '"');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $scores = array("surveyed" => 0, "excellent" => 0, "verygood" => 0, "good" => 0, "fair" => 0, "poor" => 0, "verypoor" => 0, "median" => 0);
            while ($row = $stmt->fetch()) {
                $scores["surveyed"] += $row["surveyed"];
                $scores["excellent"] += round($row["surveyed"] * $row["excellent"] / 100);
                $scores["verygood"] += round($row["surveyed"] * $row["verygood"] / 100);
                $scores["good"] += round($row["surveyed"] * $row["good"] / 100);
                $scores["fair"] += round($row["surveyed"] * $row["fair"] / 100);
                $scores["poor"] += round($row["surveyed"] * $row["poor"] / 100);
                $scores["verypoor"] += round($row["surveyed"] * $row["verypoor"] / 100);
                $scores["median"] += $row["surveyed"] * $row["median"];
            }
            $scores["median"] /= $scores["surveyed"];
            echo json_encode($scores);
        }

        if ($query == "getsections") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=getsections&dept=INFO&num=200
            // use "id" to get details on each section
            $stmt = $dbh->query('SELECT id, instructor, quarter, section, median FROM courses WHERE dept = "' . $dept . '" AND num = "' . $num . '"');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $sections = array();
            while ($row = $stmt->fetch()) {
                $sections[] = $row;
            }
            echo json_encode($sections);
        }

        if ($query == "getscoresforsection") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=getscoresforsection&cid=142
            // Use getsections to get cid, then get scores using this query
            $stmt = $dbh->query('SELECT * FROM scores WHERE course_id = "' . $cid . '"');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $scores = array();
            while ($row = $stmt->fetch()) {
                $scores[] = $row;
            }
            echo json_encode($scores);
        }

        if ($query == "getspecificcourseratings") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=getspecificcourseratings&dept=INFO&num=200
            // This gives you course ratings, specific to course questions, excludes prof questions
            $stmt = $dbh->query('SELECT s.question, c.surveyed, s.excellent, s.verygood, s.good, s.fair, s.poor, s.verypoor, s.median FROM courses c JOIN scores s ON c.id = s.course_id WHERE c.dept = "' . $dept . '" AND c.num = "' . $num . '" AND (s.question LIKE "%course%" OR s.question LIKE "%learn%" OR s.question LIKE "%section%")');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $ratings = array();
            while ($row = $stmt->fetch()) {
                $ratings[] = $row;
            }
            echo json_encode($ratings);
        }

        if ($query == "getspecificsectionratings") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=getspecificsectionratings&cid=142
            // Same as above, except with cid
            $stmt = $dbh->query('SELECT s.question, c.surveyed, s.excellent, s.verygood, s.good, s.fair, s.poor, s.verypoor, s.median FROM courses c JOIN scores s ON c.id = s.course_id WHERE s.course_id = "' . $cid . '" AND (s.question LIKE "%course%" OR s.question LIKE "%learn%" OR s.question LIKE "%section%")');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $ratings = array();
            while ($row = $stmt->fetch()) {
                $ratings[] = $row;
            }
            echo json_encode($ratings);
        }

        if ($query == "getspecificprofratings") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=getspecificprofratings&prof=Michael%20Eisenberg
            // This gives you course ratings, specific to course questions, excludes prof questions
            $stmt = $dbh->query('SELECT s.question, c.surveyed, s.excellent, s.verygood, s.good, s.fair, s.poor, s.verypoor, s.median FROM courses c JOIN scores s ON c.id = s.course_id WHERE c.instructor = "' . $prof . '" AND (s.question LIKE "%instructor%" OR s.question LIKE "%grad%")');
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $ratings = array();
            while ($row = $stmt->fetch()) {
                $ratings[] = $row;
            }
            echo json_encode($ratings);
        }

        if ($query == "sumprofratings") {
            // Example: http://webhost.ischool.uw.edu/~pchiang/info-343-final/inc/db2js.php?query=sumprofratings&prof=Michael%20Eisenberg
            // Sum up ratings for all questions relevant to the instructor
            $stmt = $dbh->query('SELECT s.question, c.surveyed, s.excellent, s.verygood, s.good, s.fair, s.poor, s.verypoor, s.median FROM courses c JOIN scores s ON c.id = s.course_id WHERE c.instructor = "' . $prof . '" AND (s.question LIKE "%instructor%" OR s.question LIKE "%grad%")');
            $scores = array("surveyed" => 0, "excellent" => 0, "verygood" => 0, "good" => 0, "fair" => 0, "poor" => 0, "verypoor" => 0);
            while ($row = $stmt->fetch()) {
                $scores["surveyed"] += $row["surveyed"];
                $scores["excellent"] += round($row["surveyed"] * $row["excellent"] / 100);
                $scores["verygood"] += round($row["surveyed"] * $row["verygood"] / 100);
                $scores["good"] += round($row["surveyed"] * $row["good"] / 100);
                $scores["fair"] += round($row["surveyed"] * $row["fair"] / 100);
                $scores["poor"] += round($row["surveyed"] * $row["poor"] / 100);
                $scores["verypoor"] += round($row["surveyed"] * $row["verypoor"] / 100);
            }
            echo json_encode($scores);
        }

        $dbh = null;
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
?>