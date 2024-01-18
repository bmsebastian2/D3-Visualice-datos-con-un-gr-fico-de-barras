// const agregarTitle = (elementSVG) => {
//   elementSVG
//     .append("text")
//     .attr("x", width / 2)
//     .attr("y", 0 - marginTop / 2)
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("text-decoration", "underline")
//     .text("Value vs Date Graph");
// };
// Declare the x (horizontal position) scale.

// // Declare the y (vertical position) scale.

const agregarXaxis = (elementSVG, h, p, x) => {
  elementSVG
    .append("g")
    .attr("transform", `translate(0,${h - p})`)
    .attr("id", "x-axis")
    .attr("class", "tick")
    .call(d3.axisBottom(x));
};
const agregarYaxis = (elementSVG, p, y) => {
  elementSVG
    .append("g")
    .attr("transform", `translate(${p},0)`)
    .attr("id", "y-axis")
    .attr("class", "tick")
    .call(d3.axisLeft(y));
};
async function fetchData() {
  try {
    const data = await fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );
    const resp = await data.json();
    return resp.data;
  } catch (error) {
    console.log("error", error);
  }
}
// const addRect = (elementSVG, arr) => {
//   elementSVG
//     .selectAll("rect")
//     .data(arr)
//     .enter()
//     .append("rect")
//     .attr("x", (d, i) => i * 5)
//     .attr("y", (element, i) => height - element[1])
//     .attr("width", 5)
//     .attr("height", (element, i) => element[1])
//     .attr("fill", "navy");
// };
document.addEventListener("DOMContentLoaded", () => {
  (() => {
    // let main = document.getElementById("title");
    // const svg = d3.create("svg").attr("width", width).attr("height", height);

    // Declare the chart dimensions and margins.
    console.log("HELLO");
    // Declare the chart dimensions and margins.

    fetchData()
      .then((resp) => {
        const width = 1200;
        const height = 500;
        const padding = 40;

        const x = d3
          .scaleTime()
          .domain([new Date(1946, 1, 1), new Date(d3.max(resp, (d) => d[0]))])
          .range([padding, width - padding]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(resp, (d) => d[1])])
          .range([height - padding, padding]);

        // Escala X
        const xScale = d3
          .scaleBand()
          .domain(resp.map((d) => d[0]))
          .range([padding, width - padding])
          .padding(0.1);

        // Escala Y
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(resp, (d) => d[1])])
          .range([height - padding, padding]);

        // Crear ejes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Crear contenedor SVG
        const svg = d3
          .select("#title")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
        // Crear contenedor para la información sobre herramientas
        const tooltipContainer = d3
          .select("body")
          .append("div")
          .attr("id", "tooltip") // Agregar el identificador al elemento tooltip
          .style("position", "absolute")
          .style("background-color", "#f9f9f9")
          .style("padding", "10px")
          .style("border", "1px solid #ccc")
          .style("display", "none");
        // Agregar ejes
        svg
          .append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${height - padding})`)
          .call(xAxis);

        svg
          .append("g")
          .attr("id", "y-axis")
          .attr("transform", `translate(${padding}, 0)`)
          .call(yAxis);
        svg
          .selectAll(".bar")
          .data(resp)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => xScale(d[0]))
          .attr("y", (d) => yScale(d[1]))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => height - padding - yScale(d[1]))
          .attr("data-date", (d) => d[0])
          .attr("data-gdp", (d) => d[1])
          .on("mouseover", mostrarTooltip)
          .on("mouseout", ocultarTooltip);

        // const svg = d3
        //   .select("#title")
        //   .append("svg")
        //   .attr("width", width)
        //   .attr("height", height);

        // agregarXaxis(svg, height, padding, x);
        // agregarYaxis(svg, padding, y);

        // svg
        //   .selectAll("rect")
        //   .data(resp)
        //   .enter()
        //   .append("rect")
        //   .attr("x", (data, i) => data[0])
        //   .attr("y", (data, i) => height - data[1])
        //   .attr("width", 5)
        //   .attr("height", (element, i) => height - element[1])
        //   .attr("fill", "navy")
        //   .attr("class", "bar");

        // Funciones para mostrar y ocultar la información sobre herramientas
        function mostrarTooltip(resp) {
          const tooltip = d3.select("#tooltip");
          tooltip
            .html(`Fecha: ${resp[0]}<br>GDP: ${resp[1]}`)
            .attr("data-date", resp[0])
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 5 + "px")
            .style("display", "block");
        }

        function ocultarTooltip() {
          const tooltip = d3.select("#tooltip");
          tooltip.style("display", "none");
        }
      })
      .catch((err) => console.log("Error en el fetch:", err));

    // agregarXaxis(svg);
    // agregarYaxis(svg);

    // main.appendChild(svg.node());
  })();
});
