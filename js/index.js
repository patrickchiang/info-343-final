$(function() {
	$('#tabs').tabs();
	// var height = window.screen.availHeight;
	// console.log(height);
	// $('.bench').css({
	// 	height: height
	// });

	/*
	tabClick();
	//Retrieve the data from the json file, render table
	$.getJSON("data/I.json", function(jsonData) {
	preprocess(jsonData);
	renderTable(instr_to_meds, instr_to_all, $('.instr-table'), "Instructor");
	renderTable(class_to_meds, class_to_all, $('.class-table'), "Course");
	$($('tbody').children()[1]).trigger('click');
	});*/

	// find and list all the courses
	populateClassesTable();
	$('.instr-tab').click(function(){
		if(!instrTabLoaded){
			populateInstrTable();
			instrTabLoaded = true;
		}
	});
	// get course ratings, list 'em all

	// find and list num of instructors

	// enrolled/surveyed do something with that

	// click handler: list all sections for course (instructors, quarter, section, rating)

	// click handler: list all questions for section

	// on tab click instructors

	// list all distinct instructors

	// click handler: show all courses/sections for instructor

	// click handler: list all questions for section

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
			template.attr("data-course", classes[i]);
			template.removeClass('template');
			container.append(template);
		}

		var rows = table.find('.merged-row').not('.template');
		var courseDept = new Array();
		var courseNum = new Array();
		for (var i = 0; i < rows.length; i++) {
			courseDept.push($(rows[i]).data("course").split(" ")[0]);
			courseNum.push($(rows[i]).data("course").split(" ")[1]);
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
	var table = $('.instr-table');
	var container = table.find('tbody');
	db("listprofs", null, null, null, null, null, null, function(data) {
		var instrs = JSON.parse(data);
		var instrNames = [];
		for (var i = 0; i < instrs.length; i++) {
			var template = table.find('.merged-row.template').clone();
			template.find(".table-name").html(instrs[i]);
			template.attr("data-instr", instrs[i]);
			instrNames.push(instrs[i]);
			template.removeClass('template');
			container.append(template);
		}

		var rows = table.find('.merged-row').not('.template');

		db("sumprofratingsarray", instrNames, null, null, null, null, null, function(data){
			var dataArray = $.parseJSON(data);
			var rows = $('.instr-table .merged-row').not('.template').find('.table-median');
			for(var i=0; i<rows.length; i++){
				$(rows[i]).html(parseFloat(dataArray[instrNames[i]]).toFixed(2))
			}
		});

		db("numclassarray", instrNames, null, null, null, null, null, function(data){
			var dataArray = $.parseJSON(data);
			var rows = $('.instr-table .merged-row').not('.template').find('.table-count');
			for(var i=0; i<rows.length; i++){
				$(rows[i]).html(parseFloat(dataArray[instrNames[i]]));
			}
		});
		// var instrNames = new Array();
		// for (var i = 0; i < rows.length; i++) {
		// 	instrNames.push($(rows[i]).data("instr"));
		// }


		// db("sumcoursescores", null, null, null, null, null, courseRows, function(scores) {
		// 	var scoreNum = JSON.parse(scores);
		// 	var bulkcounter = $(rows).find('.table-median');
		// 	for (var i = 0; i < bulkcounter.length; i++) {
		// 		$(bulkcounter[i]).html(parseFloat(scoreNum[i]).toFixed(2));
		// 	}
		// }); 


		// db("numprofsforsection", null, null, null, null, null, courseRows, function(instructors) {
		// 	var instructorNum = JSON.parse(instructors);
		// 	var bulkcounter = $(rows).find('.table-count');
		// 	for (var i = 0; i < bulkcounter.length; i++) {
		// 		$(bulkcounter[i]).html(instructorNum[i]);
		// 	}
		// });

		// $('#class-table .merged-row').click(courseRowClick);
	});
}

function courseRowClick(){
	$('.course-header').hide();
	$('.instr-header').show();
	$('.modal-name').hide();
	$('.modal-instr').show();
	var courseName = $(this).attr('data-course');
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
			temp.attr('data-enrolled')
			container.append(temp);
			(function(course, rowData, temp){
				temp.click(function(){
					courseModalRowClick(course, rowData)
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

function courseModalRowClick(course, rowData){
	var id = rowData.id;
	$('.main-type').html(course);
	$('.other-type').html(rowData.instructor);
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
		// var first_radio = container.find("input")[0];
		// $(first_radio).attr('checked', 'checked');
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


// var instr_to_all = {};
// //Instructor Name -> whole json class object
// var class_to_all = {};
// //Class Name -> whole json class object
// var instr_to_meds = {};
// //Instructor -> [med, med, med, med...]
// var class_to_meds = {};
// //Class -> [med, med, med, med...]
// var selectedRow;
// var selectedModalRow;

// function preprocess(jsonData) {
// 	for (var i = 0; i < jsonData.length; ++i) {
// 		var jsonObj = jsonData[i];

// 		var nameTokens = jsonObj.name.split(" ");
// 		var nameSansSect = "", section = nameTokens[nameTokens.length - 1];
// 		nameTokens.pop();
// 		for (var token = 0; token < nameTokens.length; ++token) {
// 			nameSansSect += nameTokens[token];
// 			if (token != nameTokens.length - 1) {
// 				nameSansSect += " ";
// 			}
// 		}
// 		jsonObj.name = nameSansSect;
// 		jsonObj.section = section;

// 		var classSum = 0, classCount = 0, instrSum = 0, instrCount = 0;
// 		var attrList = [["Amount learned:", "course"], ["The course as a whole:", "course"], ["The course content:", "course"], ["Instructor's contribution:", "instr"], ["Instructor's effectiveness:", "instr"], ["Instructor's interest:", "instr"], ["Grading Techniques:", "instr"]];

// 		//Add up medians, delete median from list, add median measures to
// 		for (var j = 0; j < attrList.length; ++j) {
// 			var attr = attrList[j];
// 			var attrName = attr[0], attrType = attr[1], value = jsonObj[attr[0]];
// 			if (value) {
// 				if (attrType == "course") {
// 					classSum += value[6];
// 					classCount++;
// 				} else {//attrType == instr
// 					instrSum += value[6];
// 					instrCount++;
// 				}
// 				// value.pop();
// 			}
// 		}
// 		var instrMedian = instrSum / instrCount;
// 		var classMedian = classSum / classCount;

// 		if (class_to_meds[jsonObj.name]) {
// 			class_to_meds[jsonObj.name].push(classMedian);
// 		} else {
// 			class_to_meds[jsonObj.name] = [classMedian];
// 		}
// 		if (instr_to_meds[jsonObj.instructor]) {
// 			instr_to_meds[jsonObj.instructor].push(instrMedian);
// 		} else {
// 			instr_to_meds[jsonObj.instructor] = [instrMedian];
// 		}
// 		if (instr_to_all[jsonObj.instructor]) {
// 			instr_to_all[jsonObj.instructor].push(jsonObj);
// 		} else {
// 			instr_to_all[jsonObj.instructor] = [jsonObj];
// 		}
// 		if (class_to_all[jsonObj.name]) {
// 			class_to_all[jsonObj.name].push(jsonObj);
// 		} else {
// 			class_to_all[jsonObj.name] = [jsonObj];
// 		}
// 	}
// }

// function renderTable(medianMap, mapToAll, table, type) {
// 	var template;
// 	var container = table.find('tbody');
// 	var index = 0;
// 	for (var medianKey in medianMap) {
// 		template = table.find('.merged-row.template').clone();
// 		template.find('.table-name').html(medianKey);
// 		var medianArr = medianMap[medianKey];
// 		var medianSum = 0, medianCount = 0;
// 		for (var i = 0; i < medianArr.length; ++i) {
// 			medianSum += medianArr[i];
// 			medianCount++;
// 		}
// 		var median = medianSum / medianCount;
// 		template.find('.table-median').html(median.toFixed(2));
// 		template.find('.table-count').html(medianCount);
// 		template.removeClass('template');
// 		(function(rowData, template) {
// 			template.click(function() {
// 				clickHandler(rowData, template, type);
// 			});
// 		})(mapToAll[medianKey], template);

// 		container.append(template);
// 		index++;
// 	}
// }

// function clickHandler(rowData, template, type) {
// 	if (selectedRow) {
// 		selectedRow.removeClass('selected');
// 	}
// 	selectedRow = template;
// 	template.addClass('selected');
// 	$('#rowModal').modal();
// 	drawModalTable(rowData, type);
// }

// function tabClick() {
// 	$('.ui-tabs-anchor').click(function() {
// 		var tabType = $(this).html();
// 		if (tabType == "Instructors") {
// 			$($('.instr-table').find('tbody').children()[1]).trigger('click');
// 		} else {
// 			$($('.class-table').find('tbody').children()[1]).trigger('click');
// 		}
// 	});
// }

// function drawModalTable(rowData, type) {
// 	var rowObj, template;
// 	var mainElt, otherElt, quarter, section;
// 	var container = $('.modal-table tbody');
// 	var savedTemplate = $(container.children()[0]);
// 	container.empty();
// 	container.append(savedTemplate);
// 	if (type == "Instructor") {
// 		$('.instr-header').hide();
// 		$('.course-header').show();
// 		$('.modal-instr').hide();
// 		$('.modal-name').show();
// 	} else {
// 		$('.course-header').hide();
// 		$('.instr-header').show();
// 		$('.modal-name').hide();
// 		$('.modal-instr').show();
// 	}
// 	for (var i = 0; i < rowData.length; ++i) {
// 		rowObj = rowData[i];
// 		template = container.find('.template').clone();
// 		if (type == "Course") {
// 			template.find('.modal-instr').html(rowObj.instructor);
// 		} else {
// 			template.find('.modal-name').html(rowObj.name);
// 		}
// 		template.find('.modal-qtr').html(rowObj.quarter);
// 		template.find('.modal-sect').html(rowObj.section);

// 		var medianSum = 0, medianCount = 0, key, propVal;
// 		for (key in rowObj) {
// 			propVal = rowObj[key];
// 			if ( typeof propVal == "object") {
// 				medianSum += propVal[propVal.length - 1];
// 				medianCount++;
// 				// propVal.pop();
// 			}
// 		}
// 		template.find('.modal-median').html((medianSum / medianCount).toFixed(2));
// 		template.removeClass('template');
// 		(function(data, type, clickedElt) {
// 			template.click(function() {
// 				modalClick(data, type, clickedElt);
// 			});
// 		})(rowObj, type, template);
// 		container.append(template);
// 		if (i == 0) {
// 			template.trigger('click');
// 		}
// 	}
// }

// function modalClick(data, type, selectedElt) {
// 	//Mark modal row as selected
// 	if (selectedModalRow) {
// 		selectedModalRow.removeClass('selected');
// 	}
// 	selectedModalRow = selectedElt;
// 	selectedElt.addClass('selected');

// 	//Fill in chart panel heading
// 	if (type == "Course") {
// 		$('.main-type').html(data.name);
// 		$('.other-type').html(data.instructor);
// 	} else {
// 		$('.main-type').html(data.instructor);
// 		$('.other-type').html(data.name);
// 	}
// 	$('.quarter').html(data.quarter);

// 	//Add radio selectors
// 	var container = $('.graph-selector');
// 	container.empty();
// 	var key, value;
// 	for (key in data) {
// 		value = data[key];
// 		if ( typeof value == "object") {
// 			var button = $(document.createElement('input'));
// 			var label = $(document.createElement('label'));
// 			label.html(key);
// 			button.attr('type', 'radio');
// 			button.attr('name', 'chart-select');
// 			button.attr('value', key);
// 			label.append(button);
// 			container.append(label);
// 		}
// 	}
// 	var first_radio = container.find("input")[0];
// 	$(first_radio).attr('checked', 'checked');
// 	$('.graph-selector input[name="chart-select"]').change(function() {
// 		renderCharts($(this).val(), data[$(this).val()]);
// 	});
// 	$('.graph-selector input[name="chart-select"]').trigger('change');
// }

// function renderCharts(chartType, chartData) {
// 	$('.median').html(chartData[chartData.length - 1]);
// 	var noMedianData = chartData.slice(0, chartData.length - 1);
// 	var data = {
// 		labels : ["Excellent", "Very Good", "Good", "Fair", "Poor", "Very Poor"],
// 		datasets : [{
// 			fillColor : "rgba(220,220,220,0.5)",
// 			strokeColor : "rgba(220,220,220,1)",
// 			data : noMedianData
// 		}]
// 	};
// 	var options = {
// 		scaleSteps : 20,
// 		scaleStepWidth : 5,
// 		scaleStartValue : 0,
// 		scaleOverride : true,
// 		scaleLabel : "<%=value + '%'%>"

// 		//Place additional graph options here
// 	};
// 	$('.display-chart').remove();
// 	$('.chart-container').append($(document.createElement('canvas')).attr({
// 		"class" : "display-chart",
// 		"id" : "display-chart",
// 		"height" : '350px',
// 		"width" : '450px'
// 	}));
// 	var context = $(".display-chart").get(0).getContext("2d");
// 	var barGraph = new Chart(context).Bar(data, options);
// }

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
