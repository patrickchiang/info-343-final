$(function() {
	$('#tabs').tabs();

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

		table.find('.merged-row').not('.template').each(function(i, e) {
			// db("sumcoursescores", null, $(e).data("course").split(" ")[0], $(e).data("course").split(" ")[1], null, null, null, function(scores) {
			// var scoreSum = JSON.parse(scores);
			// $(e).find('.table-median').html(scoreSum.median.toFixed(2));
			// });

		});

		var rows = table.find('.merged-row').not('.template');
		var courseDept = new Array();
		var courseNum = new Array();
		for (var i = 0; i < rows.length; i++) {
			courseDept.push(rows[i].data("course").split(" ")[0]);
			courseNum.push(rows[i].data("course").split(" ")[1]);
		}

		courseRows = {
			"dept" : courseDept,
			"num" : courseNum
		};

		db("numprofsforsection", null, null, null, null, null, courseRows, function(instructors) {
			var instuctorNum = JSON.parse(instructors);
			$(e).find('.table-count').html(instuctorNum["COUNT(DISTINCT instructor)"]);
		});

	});
}

var instr_to_all = {};
//Instructor Name -> whole json class object
var class_to_all = {};
//Class Name -> whole json class object
var instr_to_meds = {};
//Instructor -> [med, med, med, med...]
var class_to_meds = {};
//Class -> [med, med, med, med...]
var selectedRow;
var selectedModalRow;

function preprocess(jsonData) {
	for (var i = 0; i < jsonData.length; ++i) {
		var jsonObj = jsonData[i];

		var nameTokens = jsonObj.name.split(" ");
		var nameSansSect = "", section = nameTokens[nameTokens.length - 1];
		nameTokens.pop();
		for (var token = 0; token < nameTokens.length; ++token) {
			nameSansSect += nameTokens[token];
			if (token != nameTokens.length - 1) {
				nameSansSect += " ";
			}
		}
		jsonObj.name = nameSansSect;
		jsonObj.section = section;

		var classSum = 0, classCount = 0, instrSum = 0, instrCount = 0;
		var attrList = [["Amount learned:", "course"], ["The course as a whole:", "course"], ["The course content:", "course"], ["Instructor's contribution:", "instr"], ["Instructor's effectiveness:", "instr"], ["Instructor's interest:", "instr"], ["Grading Techniques:", "instr"]];

		//Add up medians, delete median from list, add median measures to
		for (var j = 0; j < attrList.length; ++j) {
			var attr = attrList[j];
			var attrName = attr[0], attrType = attr[1], value = jsonObj[attr[0]];
			if (value) {
				if (attrType == "course") {
					classSum += value[6];
					classCount++;
				} else {//attrType == instr
					instrSum += value[6];
					instrCount++;
				}
				// value.pop();
			}
		}
		var instrMedian = instrSum / instrCount;
		var classMedian = classSum / classCount;

		if (class_to_meds[jsonObj.name]) {
			class_to_meds[jsonObj.name].push(classMedian);
		} else {
			class_to_meds[jsonObj.name] = [classMedian];
		}
		if (instr_to_meds[jsonObj.instructor]) {
			instr_to_meds[jsonObj.instructor].push(instrMedian);
		} else {
			instr_to_meds[jsonObj.instructor] = [instrMedian];
		}
		if (instr_to_all[jsonObj.instructor]) {
			instr_to_all[jsonObj.instructor].push(jsonObj);
		} else {
			instr_to_all[jsonObj.instructor] = [jsonObj];
		}
		if (class_to_all[jsonObj.name]) {
			class_to_all[jsonObj.name].push(jsonObj);
		} else {
			class_to_all[jsonObj.name] = [jsonObj];
		}
	}
}

function renderTable(medianMap, mapToAll, table, type) {
	var template;
	var container = table.find('tbody');
	var index = 0;
	for (var medianKey in medianMap) {
		template = table.find('.merged-row.template').clone();
		template.find('.table-name').html(medianKey);
		var medianArr = medianMap[medianKey];
		var medianSum = 0, medianCount = 0;
		for (var i = 0; i < medianArr.length; ++i) {
			medianSum += medianArr[i];
			medianCount++;
		}
		var median = medianSum / medianCount;
		template.find('.table-median').html(median.toFixed(2));
		template.find('.table-count').html(medianCount);
		template.removeClass('template');
		(function(rowData, template) {
			template.click(function() {
				clickHandler(rowData, template, type);
			});
		})(mapToAll[medianKey], template);

		container.append(template);
		index++;
	}
}

function clickHandler(rowData, template, type) {
	if (selectedRow) {
		selectedRow.removeClass('selected');
	}
	selectedRow = template;
	template.addClass('selected');
	$('#rowModal').modal();
	drawModalTable(rowData, type);
}

function tabClick() {
	$('.ui-tabs-anchor').click(function() {
		var tabType = $(this).html();
		if (tabType == "Instructors") {
			$($('.instr-table').find('tbody').children()[1]).trigger('click');
		} else {
			$($('.class-table').find('tbody').children()[1]).trigger('click');
		}
	});
}

function drawModalTable(rowData, type) {
	var rowObj, template;
	var mainElt, otherElt, quarter, section;
	var container = $('.modal-table tbody');
	var savedTemplate = $(container.children()[0]);
	container.empty();
	container.append(savedTemplate);
	if (type == "Instructor") {
		$('.instr-header').hide();
		$('.course-header').show();
		$('.modal-instr').hide();
		$('.modal-name').show();
	} else {
		$('.course-header').hide();
		$('.instr-header').show();
		$('.modal-name').hide();
		$('.modal-instr').show();
	}
	for (var i = 0; i < rowData.length; ++i) {
		rowObj = rowData[i];
		template = container.find('.template').clone();
		if (type == "Course") {
			template.find('.modal-instr').html(rowObj.instructor);
		} else {
			template.find('.modal-name').html(rowObj.name);
		}
		template.find('.modal-qtr').html(rowObj.quarter);
		template.find('.modal-sect').html(rowObj.section);

		var medianSum = 0, medianCount = 0, key, propVal;
		for (key in rowObj) {
			propVal = rowObj[key];
			if ( typeof propVal == "object") {
				medianSum += propVal[propVal.length - 1];
				medianCount++;
				// propVal.pop();
			}
		}
		template.find('.modal-median').html((medianSum / medianCount).toFixed(2));
		template.removeClass('template');
		(function(data, type, clickedElt) {
			template.click(function() {
				modalClick(data, type, clickedElt);
			});
		})(rowObj, type, template);
		container.append(template);
		if (i == 0) {
			template.trigger('click');
		}
	}
}

function modalClick(data, type, selectedElt) {
	//Mark modal row as selected
	if (selectedModalRow) {
		selectedModalRow.removeClass('selected');
	}
	selectedModalRow = selectedElt;
	selectedElt.addClass('selected');

	//Fill in chart panel heading
	if (type == "Course") {
		$('.main-type').html(data.name);
		$('.other-type').html(data.instructor);
	} else {
		$('.main-type').html(data.instructor);
		$('.other-type').html(data.name);
	}
	$('.quarter').html(data.quarter);

	//Add radio selectors
	var container = $('.graph-selector');
	container.empty();
	var key, value;
	for (key in data) {
		value = data[key];
		if ( typeof value == "object") {
			var button = $(document.createElement('input'));
			var label = $(document.createElement('label'));
			label.html(key);
			button.attr('type', 'radio');
			button.attr('name', 'chart-select');
			button.attr('value', key);
			label.append(button);
			container.append(label);
		}
	}
	var first_radio = container.find("input")[0];
	$(first_radio).attr('checked', 'checked');
	$('.graph-selector input[name="chart-select"]').change(function() {
		renderCharts($(this).val(), data[$(this).val()]);
	});
	$('.graph-selector input[name="chart-select"]').trigger('change');
}

function renderCharts(chartType, chartData) {
	$('.median').html(chartData[chartData.length - 1]);
	var noMedianData = chartData.slice(0, chartData.length - 1);
	var data = {
		labels : ["Excellent", "Very Good", "Good", "Fair", "Poor", "Very Poor"],
		datasets : [{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			data : noMedianData
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
		$.post("inc/db2js.php" + getString, bulk_classes, function(data) {
			console.log(data);
		});
	}

	$.ajax("inc/db2js.php" + getString).done(function(data) {
		console.log(data);
		callback(data);
	});
}
