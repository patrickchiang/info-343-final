$(function() {
	$('#tabs').tabs();

	// find and list all the courses
	populateClassesTable();
	$('.instr-tab').click(function(){
		if(!instrTabLoaded){
			populateInstrTable();
			instrTabLoaded = true;
		}
	});

});

var selectedRow, instrTabLoaded = false;

function populateClassesTable() {
	var table = $('.class-table');
	var container = table.find('tbody');

	db("listcourses", null, null, null, null, null, null, function(data) {
		var classes = JSON.parse(data);

		for (var i = 0; i < classes.length; i++) {
			var template = table.find('.merged-row.template').clone();
			template.find(".table-name").html(classes[i]);
			template.attr("data-name", classes[i]);
			template.removeClass('template');
			container.append(template);
		}

		var rows = table.find('.merged-row').not('.template');
		var courseDept = new Array();
		var courseNum = new Array();
		for (var i = 0; i < rows.length; i++) {
			courseDept.push($(rows[i]).data("name").split(" ")[0]);
			courseNum.push($(rows[i]).data("name").split(" ")[1]);
		}

		courseRows = {
			"dept" : courseDept,
			"num" : courseNum
		};


		db("sumcoursescores", null, null, null, null, null, courseRows, function(scores) {
			var scoreNum = JSON.parse(scores);
			var bulkcounter = $(rows).find('.table-median');
			for (var i = 0; i < bulkcounter.length; i++) {
				$(bulkcounter[i]).html(parseFloat(scoreNum[i]).toFixed(2));
			}
		}); 


		db("numprofsforsection", null, null, null, null, null, courseRows, function(instructors) {
			var instructorNum = JSON.parse(instructors);
			var bulkcounter = $(rows).find('.table-count');
			for (var i = 0; i < bulkcounter.length; i++) {
				$(bulkcounter[i]).html(instructorNum[i]);
			}
		});

		$('#class-table .merged-row').click(courseRowClick);
	});
}

function populateInstrTable(){
	var table = $('.instr-table');	//Table that distinguishes which tab it is
	var container = table.find('tbody');	//Container to append the templates to
	db("listprofs", null, null, null, null, null, null, function(data) {
		var instrs = JSON.parse(data);
		var instrNames = [];

		//For each instructor name, create & append template, add name to instrNames
		for (var i = 0; i < instrs.length; i++) {
			var template = table.find('.merged-row.template').clone();
			template.find(".table-name").html(instrs[i]);
			template.attr("data-name", instrs[i]);
			instrNames.push(instrs[i]);
			template.removeClass('template');
			container.append(template);
		}

		//All table rows
		var rows = table.find('.merged-row').not('.template');

		//Populate the rating column for professors
		db("sumprofratingsarray", instrNames, null, null, null, null, null, function(data){
			var dataArray = $.parseJSON(data);
			var containers = rows.find('.table-median');
			for(var i=0; i<containers.length; i++){
				$(containers[i]).html(parseFloat(dataArray[instrNames[i]]).toFixed(2))
			}
		});

		//Populate number of classes column
		db("numclassarray", instrNames, null, null, null, null, null, function(data){
			var dataArray = $.parseJSON(data);
			var containers = rows.find('.table-count');
			for(var i=0; i<rows.length; i++){
				$(containers[i]).html(parseFloat(dataArray[instrNames[i]]));
			}
		});
		$('#instr-table .merged-row').click(instrRowClick);
	});
}


function courseRowClick(){
	$('.course-header').hide();
	$('.instr-header').show();
	$('.modal-name').hide();
	$('.modal-instr').show();
	var courseName = $(this).attr('data-name');
	var courseDept = courseName.split(" ")[0];
	var courseNum = courseName.split(" ")[1];
	db("getsections", null, courseDept, courseNum, null, null, null, function(instructors){
		var instructorList = $.parseJSON(instructors),
		container = $('#modal-table tbody'), template = $('#modal-table .template');
		var savedTemplate = $(container.children()[0]);
		container.empty();
		container.append(savedTemplate);
		for(var i=0; i<instructorList.length; i++){
			temp = template.clone();
			rowData = instructorList[i];
			temp.find('.modal-instr').html(rowData.instructor);
			temp.find('.modal-qtr').html(rowData.quarter);
			temp.find('.modal-sect').html(rowData.section);
			temp.find('.modal-median').html((parseFloat(rowData.median)).toFixed(2));
			temp.removeClass('template');
			temp.attr('data-id', rowData.id);
			container.append(temp);
			(function(course, rowData, temp){
				temp.click(function(){
					modalRowClick("course", rowData);
					if(selectedRow){
						selectedRow.removeClass('selected');
					}
					selectedRow = temp;
					temp.addClass('selected');
				});
			})(courseName, rowData, temp);
			if(i==0){
				temp.trigger('click');
			}
		}
	});
}

function instrRowClick(){
	$('.instr-header').hide();
	$('.course-header').show();
	$('.modal-instr').hide();
	$('.modal-name').show();
	var instrName = $(this).attr('data-name');
	db("getsectionsbyprof", instrName, null, null, null, null, null, function(data){
		var courseList = $.parseJSON(data),
		container = $('#modal-table tbody'), template = $('#modal-table .template');
		var savedTemplate = $(container.children()[0]);
		container.empty();
		container.append(savedTemplate);
		for(var i=0; i<courseList.length; i++){
			temp = template.clone();
			rowData = courseList[i];
			temp.find('.modal-name').html(rowData.dept + " " + rowData.num);
			temp.find('.modal-qtr').html(rowData.quarter);
			temp.find('.modal-sect').html(rowData.section);
			temp.find('.modal-median').html((parseFloat(rowData.median)).toFixed(2));
			temp.removeClass('template');
			temp.attr('data-id', rowData.id);
			container.append(temp);
			(function(instr, rowData, temp){
				temp.click(function(){
					modalRowClick("instructor", rowData);
					if(selectedRow){
						selectedRow.removeClass('selected');
					}
					selectedRow = temp;
					temp.addClass('selected');
				});
			})(instrName, rowData, temp);
			if(i==0){
				temp.trigger('click');
			}
		}
	});
}

// function courseModalRowClick(course, rowData){
// 	var id = rowData.id;
// 	$('.main-type').html(course);
// 	$('.other-type').html(rowData.instructor);
// 	$('.quarter').html("Quarter: " + rowData.quarter);
// 	$('.section').html("Section: " + rowData.section);
// 	$('.surveyed').html("Surveyed: " + db("getsectionssurveyed", null, null, null, id, null, null, function(data){
// 		return $.parseJSON(data)[0];
// 	}));
// 	$('.enrolled').html("Enrolled: " + db("getsectionsenrolled", null, null, null, id, null, null, function(data){
// 		return $.parseJSON(data)[0];
// 	}));
// 	db("getscoresforsection", null, null, null, id, null, null, function(scores){
// 		var scoresJSON = $.parseJSON(scores);
// 		var container = $('.graph-selector');
// 		container.empty();
// 		var button, label, question, data = {};
// 		for(var i=0; i<scoresJSON.length; i++){
// 			button = $(document.createElement('input'));
// 			label = $(document.createElement('label'));
// 			question = scoresJSON[i].question;
// 			if(question == "Instuctor's interest:"){
// 				label.html("Instructor's interest:");
// 			}
// 			else{
// 				label.html(question);
// 			}
// 			button.attr('type', 'radio');
// 			button.attr('name', 'chart-select');
// 			button.attr('value', question);
// 			button.attr('data-name', question);
// 			label.append(button);
// 			data[question] = scoresJSON[i];
// 			container.append(label);
// 		}
// 		$('.graph-selector input[name="chart-select"]').change(function() {
// 			renderCharts(data[$(this).val()]);
// 		});
// 		$($('.graph-selector > label')[0]).trigger('click');
// 	});
// }

// function instrModalRowClick(instr, rowData){
// 	var id = rowData.id;
// 	$('.main-type').html(rowData.instructor);
// 	$('.other-type').html(rowData.dept + " " + rowData.num);
// 	$('.quarter').html("Quarter: " + rowData.quarter);
// 	$('.section').html("Section: " + rowData.section);
// 	$('.surveyed').html("Surveyed: " + db("getsectionssurveyed", null, null, null, id, null, null, function(data){
// 		return $.parseJSON(data)[0];
// 	}));
// 	$('.enrolled').html("Enrolled: " + db("getsectionsenrolled", null, null, null, id, null, null, function(data){
// 		return $.parseJSON(data)[0];
// 	}));
// 	db("getscoresforsection", null, null, null, id, null, null, function(scores){
// 		var scoresJSON = $.parseJSON(scores);
// 		var container = $('.graph-selector');
// 		container.empty();
// 		var button, label, question, data = {};
// 		for(var i=0; i<scoresJSON.length; i++){
// 			button = $(document.createElement('input'));
// 			label = $(document.createElement('label'));
// 			question = scoresJSON[i].question;
// 			if(question == "Instuctor's interest:"){
// 				label.html("Instructor's interest:");
// 			}
// 			else{
// 				label.html(question);
// 			}
// 			button.attr('type', 'radio');
// 			button.attr('name', 'chart-select');
// 			button.attr('value', question);
// 			button.attr('data-name', question);
// 			label.append(button);
// 			data[question] = scoresJSON[i];
// 			container.append(label);
// 		}
// 		$('.graph-selector input[name="chart-select"]').change(function() {
// 			renderCharts(data[$(this).val()]);
// 		});
// 		$($('.graph-selector > label')[0]).trigger('click');
// 	});
// }

function modalRowClick(type, rowData){
	var id = rowData.id;
	if(type=="instructor"){
		$('.main-type').html(rowData.instructor);
		$('.other-type').html(rowData.dept + " " + rowData.num);
	} else{
		$('.main-type').html(rowData.dept + " " + rowData.num);
		$('.other-type').html(rowData.instructor);
	}
	$('.quarter').html("Quarter: " + rowData.quarter);
	$('.section').html("Section: " + rowData.section);
	$('.surveyed').html("Surveyed: " + db("getsectionssurveyed", null, null, null, id, null, null, function(data){
		return $.parseJSON(data)[0];
	}));
	$('.enrolled').html("Enrolled: " + db("getsectionsenrolled", null, null, null, id, null, null, function(data){
		return $.parseJSON(data)[0];
	}));
	db("getscoresforsection", null, null, null, id, null, null, function(scores){
		var scoresJSON = $.parseJSON(scores);
		var container = $('.graph-selector');
		container.empty();
		var button, label, question, data = {};
		for(var i=0; i<scoresJSON.length; i++){
			button = $(document.createElement('input'));
			label = $(document.createElement('label'));
			question = scoresJSON[i].question;
			if(question == "Instuctor's interest:"){
				label.html("Instructor's interest:");
			}
			else{
				label.html(question);
			}
			button.attr('type', 'radio');
			button.attr('name', 'chart-select');
			button.attr('value', question);
			button.attr('data-name', question);
			label.append(button);
			data[question] = scoresJSON[i];
			container.append(label);
		}
		$('.graph-selector input[name="chart-select"]').change(function() {
			renderCharts(data[$(this).val()]);
		});
		$($('.graph-selector > label')[0]).trigger('click');
	});
}

function renderCharts(chartData) {
	$('.median').html("Overall: " + (parseFloat(chartData.median)).toFixed(2));
	var targetData = {}, key;
	for(key in chartData){
		if(key!="course_id" && key!= "question" && key!= "median"){
			targetData[key] = chartData[key];
		}
	}
	var labels = [], data = [];
	var abbrevToCamel = {
		"excellent" : "Excellent",
		"verygood" : "Very Good",
		"good" : "Good",
		"fair" : "Fair",
		"poor" : "Poor",
		"verypoor" : "Very Poor"
	};
	var statName;
	for(statName in targetData){
		labels.push(abbrevToCamel[statName]);
		data.push(targetData[statName]);
	}
	var data = {
		labels : labels,
		datasets : [{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			data : data
		}]
	};

	var options = {
		scaleSteps : 20,
		scaleStepWidth : 5,
		scaleStartValue : 0,
		scaleOverride : true,
		scaleLabel : "<%=value + '%'%>"
		//Place additional graph options here
	};

	$('.display-chart').remove();
	$('.chart-container').append($(document.createElement('canvas')).attr({
		"class" : "display-chart",
		"id" : "display-chart",
		"height" : '350px',
		"width" : '450px'
	}));
	var context = $(".display-chart").get(0).getContext("2d");
	var barGraph = new Chart(context).Bar(data, options);
}

function db(query, prof, dept, num, cid, section, bulk_classes, callback) {
	var getString = "?query=" + query;
	if (prof) {
		getString += "&prof=" + prof;
	}
	if (dept) {
		getString += "&dept=" + dept;
	}
	if (num) {
		getString += "&num=" + num;
	}
	if (cid) {
		getString += "&cid=" + cid;
	}
	if (section) {
		getString += "&section=" + section;
	}

	if (bulk_classes) {
		$.ajax({
			type : "POST",
			url : "inc/db2js.php" + getString,
			data : {
				dept : bulk_classes["dept"],
				num : bulk_classes["num"]
			},
			success : function(data) {
				callback(data);
			}
		});
	} else {
		$.ajax("inc/db2js.php" + getString).done(function(data) {
			callback(data);
		});
	}
}
