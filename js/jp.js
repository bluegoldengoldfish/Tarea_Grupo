function paint_chart_jp(){
	d3.json("data/jp.json").then(function(data){
		//console.log(data)
		list_values = data["Respuesta"]["Datos"]["Metricas"][0]["Datos"]
		dataset = []
		max_y = 0
		dict_x = {}
		for (i = 0; i < list_values.length; i++){
			x = i
			y = list_values[i]["Valor"]
			if (y > max_y){
				max_y = y
			}
			dataset.push({"y": y})
			dict_x[i] = list_values[i]["Periodo"] + " - " +  list_values[i]["Agno"].toString()
		}
		
		// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
		// var dataset = d3.range(52).map(function(d) { return {"y": d3.randomUniform(1)() } })
		// console.log(dataset)
		
		drawn_chart_jp(dataset, max_y + 10, dict_x)
	})
}



function drawn_chart_jp(dataset, max_y, dict_x){
	// var dimensions = {width: window.innerWidth, height: window.innerHeight};
	var dimensions = {width: 1300, height: 600}
	var margin = {top: 50, right: 50, bottom: 80, left: 80}
	  , width = dimensions.width - margin.left - margin.right
	  , height = dimensions.height - margin.top - margin.bottom

	// The number of datapoints
	 var n = dataset.length

	// 5. X scale will use the index of our data
	var xScale = d3.scaleLinear()
		.domain([0, n-1]) // input
		.range([0, width]) // output

	// 6. Y scale will use the randomly generate number 
	var yScale = d3.scaleLinear()
		.domain([0, max_y]) // input 
		.range([height, 0]) // output 

	// 7. d3's line generator
	var line = d3.line()
		.x(function(d, i) { return xScale(i) }) // set the x values for the line generator
		.y(function(d) { return yScale(d.y) }) // set the y values for the line generator 
		.curve(d3.curveMonotoneX) // apply smoothing to the line

	// 1. Add the SVG to the page and employ #2
	var svg = d3.select("#jp").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	
	var xAxis = d3.axisBottom(xScale).tickFormat(function(d){ return dict_x[d];});
	
	
	// 3. Call the x axis in a group tag
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-40)");

	// 4. Call the y axis in a group tag
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

	// 9. Append the path, bind the data, and call the line generator 
	svg.append("path")
		.datum(dataset) // 10. Binds data to the line 
		.attr("class", "line") // Assign a class for styling 
		.attr("d", line); // 11. Calls the line generator 

	// 12. Appends a circle for each datapoint 
	svg.selectAll(".dot")
		.data(dataset)
	  .enter().append("circle") // Uses the enter().append() method
		.attr("class", "dot") // Assign a class for styling
		.attr("cx", function(d, i) { return xScale(i) })
		.attr("cy", function(d) { return yScale(d.y) })
		.attr("r", 5)
		.on("mouseover", function(d, x) { showData(this, d, x)})
		.on("mouseout", function(){ hideData()})
	
	 //graph.append("svg:path").attr("d", line(data));
	 svg.append("svg:text")
	 .attr("x", -200)
	 .attr("y", -50)
	 .attr("dy", ".1em")
	 .attr("transform", "rotate(-90)")
	 .text("N° de ocupados (miles)")
	
	function showData(obj, d, x) {
		var coord = d3.mouse(obj)
		var infobox = d3.select("#jp").append("div").attr("class", "infobox").attr("id", "infobox")
		
		infobox.style("left", (coord[0] + 100) + "px" )
		infobox.style("top", (coord[1] - 175) + "px")
		d3.select(".infobox").text(dict_x[x] + ": " + d["y"])
		d3.select(".infobox").style("display", "visible")
	}

	function hideData() {
		d3.select(".infobox").remove()
	}
		
		
}

paint_chart_jp()