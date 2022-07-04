
// Leer datos del dataset
function leer_datos_mg(){

	d3.json("data/mg.json").then(function(data){

		list_values = data["Respuesta"]["Datos"]["Metricas"][0]["Datos"]
		dataset = []
		max_y = 0
		min_y = list_values[0]["Valor"]
		dict_x = {}

		// Encontrar el mínimo del gráfico

		for (j = 0; j < list_values.length; j++){
			y = list_values[j]["Valor"]
			if (y < min_y){
				min_y = y
			}

		}

		// Encontrar el máximo del gráfico

		for (i = 0; i < list_values.length; i++){
			x = i
			y = list_values[i]["Valor"]
			if (y > max_y){
				max_y = y
			}

			dataset.push({"y": y})
			dict_x[i] = list_values[i]["Periodo"] + " - " +  list_values[i]["Agno"].toString()
		
		}

		
		// Se crea una función para definir las caracteristicas del gráfico
		graficar_mg(dataset, max_y + 10, min_y - 100, dict_x)
	
		
	})
}


function graficar_mg(dataset, max_y, min_y, dict_x){

	// Se establecen las dimensiones del gráfico
	var dimensions = {width: 1300, height: 500}
	var margin = {top: 50, right: 50, bottom: 80, left: 80}
	  , width = dimensions.width - margin.left - margin.right
	  , height = dimensions.height - margin.top - margin.bottom

	// # de puntos del gráfico
	 var n = dataset.length

	// Escalar el eje x
	var xScale = d3.scaleLinear()
		.domain([0, n-1]) // input
		.range([0, width]) // output

	// Se escala el eje y
	var yScale = d3.scaleLinear()
		.domain([min_y, max_y]) // input 
		.range([height, 0]) // output 

	// Se genera el gráfico de lineas
	var line = d3.line()
		.x(function(d, i) { return xScale(i) }) 
		.y(function(d) { return yScale(d.y) }) 
		.curve(d3.curveMonotoneY) 
	// d3.curveMonotoneX

	var svg = d3.select("#mg").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var xAxis = d3.axisBottom(xScale).tickFormat(function(d){ return dict_x[d];});
	
	
	// Definir atributos del gráfico

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-40)");

	
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale)); 


	svg.append("path")
		.datum(dataset) 
		.attr("class", "line") 
		.attr("d", line);

	 
	svg.selectAll(".dot")
		.data(dataset)
	  	.enter().append("circle") 
		.attr("class", "dot")
		.attr("cx", function(d, i) { return xScale(i) })
		.attr("cy", function(d) { return yScale(d.y) })
		.attr("r", 5)
		.on("mouseover", function(d, x) {showData(this, d, x)})
		.on("mouseout", function(){ hideData()})
	
	
	 svg.append("svg:text")
		.attr("x", -200)
		.attr("y", -50)
		.attr("dy", ".1em")
		.attr("transform", "rotate(-90)")
		.text("# de personas (miles)")
	 
	
	function showData(obj, d, x) {
		var coord = d3.mouse(obj)
		var infobox = d3.select("#mg").append("div").attr("class", "infobox").attr("id", "infobox")
		
		infobox.style("left", (coord[0] + 100) + "px" )
		infobox.style("top", (coord[1] - 175) + "px")
		d3.select(".infobox").text(dict_x[x] + ": " + d["y"])
		d3.select(".infobox").style("display", "visible")
	}

	function hideData() {
		d3.select(".infobox").remove()
	}
		
		
}

leer_datos_mg()