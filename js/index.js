var ctx = $("#display-chart").get(0).getContext("2d");


$.getJSON("data/I.json",function(jsonData){
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
	}
});

var datasets;

var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			data : [65,59,90,81,56,55,40]
		},
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			data : [28,48,40,19,96,27,100]
		}
	]
};

var options = {

};

var barGraph = new Chart(ctx).Bar(data,options);