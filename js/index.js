var ctx = $("#display-chart").get(0).getContext("2d");

// var jsonData = 
// $.getJSON("data/I.json",function(data){
//    console.log(this.ctx);
//    return data;
// });
// console.log(jsonData);

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