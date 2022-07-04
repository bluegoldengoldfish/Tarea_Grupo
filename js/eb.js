/*
* Autor: Edwin Barahona
* Matricula: 468137
*/

//Definicion del id del elemento que va a contener la visualizacion
const graf = d3.select("#graf_eb")

const margins = {
  top: 50,
  right: 20,
  bottom: 150,
  left: 105,
}
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 15

const ancho = anchoTotal - margins.right - margins.left
const alto = altoTotal - margins.top - margins.bottom

//Elemento principal svg
const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "graf")
  .attr("title" ,"sample title")

// barras de la grafica
svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", ancho)
  .attr("height", alto)
  .attr("transform", `translate(${margins.left}, ${margins.top})`)
  .classed("backdrop", true)

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const load = async () => {
  let data = await d3.csv("data/numero_de_activos_por_nivel_de_formacion.csv", d3.autoType)
  data.sort((a, b) => b.poblacion_activa - a.poblacion_activa)

  // Accessor
  const xAccessor = (d) => d.parametro
  const yAccessor = (d) => d.poblacion_activa

  // Escaladores
  const parametros = d3.map(data, (d) => d.parametro)
  const x = d3
    .scaleBand()
    .domain(parametros)
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([alto, 0])

  const rect = g
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(xAccessor(d)))
    .attr("y", (d) => y(yAccessor(d)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => alto - y(yAccessor(d)))

  const xAxis = d3.axisBottom(x)
  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)
    .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.25em")
      .attr("dy", ".4em")
      .attr("transform", function(d){
      return "rotate(-45)"
    })
  const yAxis = d3.axisLeft(y).ticks(5)
  const yAxisGroup = g.append("g").classed("axis", true).call(yAxis)
}

load()

//codigo para cargar los popover
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
