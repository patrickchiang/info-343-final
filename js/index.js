$(function(){
	//Retrieve the data from the json file, render table
	$.getJSON("data/I.json",function(jsonData){
		renderTable(jsonData);
	});

	//When the images have loaded, activate the first row
	$(window).ready(function(){
		$('.class-table tbody > .class-row:nth-child(2)').trigger('click');
	});
});

var selectedElt;

//jsonData: the array of json objects retrieved from the file
function renderTable(jsonData){
 	//Element to append each row to
 	var tbody = $('.class-table tbody');

	var classObj, //An object representing evaluations for a certain class
		template; //Row template to be copied and cloned

	renderDefaultChart(jsonData); //Draws the default chart for the row

	for(var i=0; i<jsonData.length; ++i){
		classObj = jsonData[i];
		template = $('.class-row.template').clone();
		template.find('.table-name').html(classObj.name);
		template.find('.table-instr').html(classObj.instructor);
		template.find('.table-qtr').html(classObj.quarter);
		template.find('.table-median');
		template.removeClass('template');
		if(i==0){
			template.addClass('selected');
			selectedElt = template;
		}
		
		var medianSum = 0, medianCount = 0;
		for(key in classObj){
			if(typeof classObj[key] == "object"){
				var statsLength = classObj[key].length;
				medianSum += classObj[key][statsLength-1]
				medianCount++;
			}
		}
		template.find('.table-median').html((medianSum/medianCount).toFixed(2));

		tbody.append(template);
		(function(jsonObj){
			template.click(function(){
				selectedElt.removeClass('selected');
				var medianSum = 0,
					medianCount = 0;
				selectedElt = $(this);
				$(this).addClass('selected');
				var info = {}, stats = {};
				for(key in jsonObj){
					if(typeof jsonObj[key] == "object"){
						stats[key] = jsonObj[key];
						stats[key].pop();
					} else{
						info[key] = jsonObj[key];
					}
				}
				info['median'] = medianSum/medianCount;
				renderCharts(info, stats, key);
			});
		})(classObj);
	}
}

function renderCharts(info, stats, selected){
	$('.class-name').html(info.name);
	$('.instructor').html(info.instructor);
	$('.quarter').html(info.quarter);

	//Add radio buttons
	var container = $('.graph-selector');
	container.empty();
	for(var chart in stats){
		var chartData = stats[chart];
		var button = $(document.createElement('input'));
		var label = $(document.createElement('label'));
		label.html(chart);
		button.attr('type', 'radio');
		button.attr('name', 'chart-select');
		button.attr('value', chart);
		label.append(button);
		container.append(label);
	}
	$('.graph-selector input[value="'  + selected + '"]').attr('checked', 'checked');
	$('input[name="chart-select"]').change(function(){
		renderCharts(info, stats, $(this).val());
	});

	var data = {
		labels: ["Excellent", "Very Good", "Good", "Fair", "Poor", "Very Poor"],
		datasets: [{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			data: stats[selected]
		}]
	}
	var options = {
		scaleSteps : 20,
		scaleStepWidth : 5,
		scaleStartValue : 0,
		scaleOverride : true,
		scaleLabel : "<%=value + '%'%>"

		//Place additional graph options here
	}
	$('#display-chart').remove();
	$('.panel').append($(document.createElement('canvas')).attr({
		"id": "display-chart",
		"height": '350px',
		"width": '550px'
	}));
	var context =  $("#display-chart").get(0).getContext("2d");
	var barGraph = new Chart(context).Bar(data, options);
}

function renderDefaultChart(jsonData){
	var defaultElement = jsonData[0],
		medianSum = 0, medianCount = 0;
	var defaultInfo = {}, defaultStats = {};

	//Render the charts for the first element in the row
	if(defaultElement){
		for(key in defaultElement){
			if(typeof defaultElement[key] == "object"){
				defaultStats[key] = defaultElement[key];
				defaultStats[key].pop();
			} else{
				defaultInfo[key] = defaultElement[key];
			}
		}
		defaultInfo['median'] = medianSum / medianCount;
		renderCharts(defaultInfo, defaultStats, key);
	} else alert("No data loaded");
}

// var datasets;

// var data = {
// 	labels : ["January","February","March","April","May","June","July"],
// 	datasets : [
// 		{
// 			fillColor : "rgba(220,220,220,0.5)",
// 			strokeColor : "rgba(220,220,220,1)",
// 			data : [65,59,90,81,56,55,40]
// 		},
// 		{
// 			fillColor : "rgba(151,187,205,0.5)",
// 			strokeColor : "rgba(151,187,205,1)",
// 			data : [28,48,40,19,96,27,100]
// 		}
// 	]
// };

// var options = {

// };

// var barGraph = new Chart(ctx).Bar(data,options);