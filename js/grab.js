// STEP 1: LOAD JQUERY
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

// WAIT A FEW SECONDS BEFORE COPY PASTING THE REST

// STEP 2: DONE
var json = [];

// Get links, remove irrelevant links
$("body > a").not(".navlink").each(function(iout) {
	var linkName = $(this).attr("href");

	// Paste pages to end of page
	$.get(linkName, function(data) {
		$("html").append("<div class=\"" + linkName.substring(2, linkName.length - 5) + "\">" + data + "</div>");
		// Get rows
		var classes = {};
		var pageDiv = "." + linkName.substring(2, linkName.length - 5);

		if (pageDiv.indexOf("&") != -1) {
			return;
		}

		if (pageDiv.indexOf("+") != -1) {
			return;
		}

		var rows = $(pageDiv + " table tbody tr");
		var className = linkName.substring(2, linkName.length - 5);

		classes.dept = className.split(/[0-9]+/)[0];
		classes.num = className.split(/[A-Z]+/)[1];
		classes.section = className.split(/[0-9]+/)[1];
		classes.name = classes.dept + " " + classes.num + classes.section;
		classes.instructor = $(pageDiv + " h2").html().split(" &nbsp;&nbsp;")[0];
		classes.quarter = $(pageDiv + " h2").html().split("&nbsp;&nbsp; ")[1];

		classes.surveyed = $(pageDiv + " caption").html().split('"')[1];
		classes.enrolled = $(pageDiv + " caption").html().split('"')[3];

		rows.each(function(index) {
			if (index > 0) {
				var item = $(this).html() + " td";
				var rowName = "";
				$(item).each(function(i2) {
					if (i2 == 0) {
						rowName = $($(item)[i2]).html().trim();
						classes[rowName] = [];
					} else if (i2 > 0 && i2 < 8) {
						classes[rowName].push(parseFloat($($(item)[i2]).html().trim()));
					}
				});
			}
		});
		json.push(classes);
	});
});
