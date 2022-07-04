function paint_chart_r(){
	d3.json("data/rcs.json").then(function(data){
		//console.log(data)
		list_values = data["Respuesta"]["Datos"]["Metricas"][0]["Datos"]
		dataset = []
		max_y = 0
		dict_x = {}


		list_values2 = data["Respuesta"]["Datos"]["Metricas"][1]["Datos"]
		dataset2 = []
		max_y2 = 0
		dict_x2 = {}
	

		for (i = 0; i < list_values.length; i++){
			x = i
			y = list_values[i]["Valor"]
			if (y > max_y){
				max_y = y
			}
			dataset.push({"y": y})
			dict_x[i] =  list_values[i]["Periodo"] + " - " +  list_values[i]["Agno"].toString()


			x2 = i
			y2 = list_values2[i]["Valor"]
			if (y2 > max_y2) {
				max_y2 = y2
			}
		dataset2.push({"y": y2})
			dict_x2[i] = list_values2[i]["Periodo"] + " - " +  list_values2[i]["Agno"].toString()


		}
	
	console.log(list_values2)
		drawn_chart_r(dataset,dataset2, max_y + 3, max_y2 + 3, dict_x, dict_x2)
	})
}



function drawn_chart_r(dataset, dataset2, max_y, max_y2, dict_x, dict_x2) {
	var valor = 0
	var dimensions = { width: 1300, height: 600 }
	var margin = { top: 50, right: 50, bottom: 150, left: 80 }
		, width = dimensions.width - margin.left - margin.right
		, height = dimensions.height - margin.top - margin.bottom

	var n = dataset.length

	var xScale = d3.scaleLinear()
		.domain([0, n - 1]) // input
		.range([0, width]) // output
	
	var xScale2 = d3.scaleLinear()
		.domain([0, n - 1]) // input
		.range([0, width]) // output

	var yScale = d3.scaleLinear()
		.domain([0, max_y]) // input 
		.range([height, 0]) // output
	
	var yScale2 = d3.scaleLinear()
		.domain([0, max_y2]) // input 
		.range([height, 0]) // output

	var line = d3.line()
		.x(function (d, i) { return xScale(i) }) // set the x values for the line generator
		.y(function (d) { return yScale(d.y) }) // set the y values for the line generator 
		.curve(d3.curveMonotoneX) // apply smoothing to the line
	
	
	
	var line2 = d3.line()
		.x(function (d, i) { return xScale2(i) }) // set the x values for the line generator
		.y(function (d) { return yScale2(d.y) }) // set the y values for the line generator 
		.curve(d3.curveMonotoneX) // apply smoothing to the line
	
	
	// append graph to #rcs
	var svg = d3.select("#rcs").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	
	var xAxis = d3.axisBottom(xScale).tickFormat(function (d) { return dict_x[d]; });

	
	var xAxis2 = d3.axisBottom(xScale).tickFormat(function (d2) { return dict_x2[d2]; });

	// 3. Call the x axis in a group tag
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.call(xAxis2)
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
		.attr("d", line) // 11. Calls the line generator 

	
	// 9. Append the path, bind the data, and call the line generator 
	svg.append("path")
		.datum(dataset2) // 10. Binds data to the line 
		.attr("class", "line2") // Assign a class for styling 
		.attr("d", line2); // 11. Calls the line generator

	// 12. Appends a circle for each datapoint 
	svg.selectAll(".dot")
		.data(dataset)
		.enter().append("circle") // Uses the enter().append() method
		.attr("class", "dot") // Assign a class for styling
		.attr("cx", function (d, i) { return xScale(i) })
		.attr("cy", function (d) { return yScale(d.y) })
		.attr("r", 5)
		.on("mouseover", function (d, x) { valor = "Mujeres en paro -", showData(this, d, x) })
		.on("mouseout", function () { hideData(), valor = "Mujeres en paro -" })
	
	svg.selectAll(".dot2")
		.data(dataset2)
		.enter().append("circle") // Uses the enter().append() method
		.attr("class", "dot2") // Assign a class for styling
		.attr("cx", function (d2, i2) { return xScale2(i2) })
		.attr("cy", function (d2) { return yScale2(d2.y) })
		.attr("r", 5)
		.on("mouseover", function (d2, x2) { valor = "Hombres en paro -", showData(this, d2, x2) })
		.on("mouseout", function () { hideData(), valor = "Hombres en paro -" })
	
	svg.append("svg:text")
		.attr("x", -190)
		.attr("y", -50)
		.attr("dy", ".1em")
		.attr("transform", "rotate(-90)")
		.text("Tasa (Unidades)")
	 

	svg.append("circle")
		.attr("class", "dot") // Assign a class for styling
		.attr("cx", 20)
		.attr("cy", 510)
		.attr("r", 10)
	
	svg.append("text")
		.attr("class", "dot") // Assign a class for styling
		.attr("x", 90)
		.attr("y", 515)
		.attr("text-anchor", "middle")
		.attr("font-weight", "bold")
		.style("font-size", "16px")
		.text("Mujeres en paro")
	
	
	svg.append("circle")
		.attr("class", "dot2") // Assign a class for styling
		.attr("cx", 20)
		.attr("cy", 485)
		.attr("r", 10)
	
	svg.append("text")
		.attr("class", "dot2") // Assign a class for styling
		.attr("x", 90)
		.attr("y", 490)
		.style("font-size", "16px")
		.attr("font-weight", "bold")
		.attr("text-anchor", "middle")
		.text("Hombres en paro")
	
	function showData(obj, d, x) {
		var coord = d3.mouse(obj)
		var infobox = d3.select("#rcs").append("div").attr("class", "infobox").attr("id", "infobox")
		
		infobox.style("left", (coord[0] + 100) + "px" )
		infobox.style("top", (coord[1] - 175) + "px")

		d3.select(".infobox").text(valor + dict_x[x] + ": " + d["y"])
		d3.select(".infobox").style("display", "visible")
		
	}

	function hideData() {
		d3.select(".infobox").remove()
	}
		
		
}

paint_chart_r()