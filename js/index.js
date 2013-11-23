$(function(){
	$.getJSON("data/I.json",function(jsonData){
		renderTable(jsonData);
	});
});


function renderTable(jsonData){
 	var tbody = $('.class-table tbody');
	var classObj, template;
	for(var i=0; i<jsonData.length; ++i){
		classObj = jsonData[i];
		template = $('.class-row.template').clone();
		template.find('.table-name').html(classObj.name);
		template.find('.table-instr').html(classObj.instructor);
		template.find('.table-qtr').html(classObj.quarter);
		template.removeClass('template');
		tbody.append(template);
		(function(jsonObj){
			template.click(function(){
				var info = {}, stats = {};
				for(key in jsonObj){
					if(typeof jsonObj[key] == "object"){
						stats[key] = jsonObj[key];
					} else{
						info[key] = jsonObj[key];
					}
				}
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
		labels: ["Excellent", "Very Good", "Good", "Fair", "Poor", "Very Poor", "Median"],
		datasets: [{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			data: stats[selected]
		}]
	}
	var options = {
		//Place additional graph options here
	}
	$('#display-chart').remove();
	$('.panel').append($(document.createElement('canvas')).attr({
		"id": "display-chart",
		"width": "400px",
		"height": "400px"
	}));
	var context =  $("#display-chart").get(0).getContext("2d");
	var barGraph = new Chart(context).Bar(data, options);
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