(async () => {
  //https://experience.arcgis.com/experience/030e625c69a04378b2756de161f82ef6
  // Variant Surveillance
  const parseTime = d3.timeParse("%Y-%m-%d");

  const data = (
    await d3.csv(
      "https://raw.githubusercontent.com/dailynexusdata/kcsb-covid/main/data/county_vaccines.csv"
    )
  ).map(({ date, fullPct, singlePct }) => {
    return {
      date: parseTime(date),
      fullPct: Number(fullPct),
      singlePct: Number(singlePct),
    };
  });
  const size = {
    width: Math.min(600, window.innerWidth * 0.95),
    height: 400,
  };

  const margin = {
    top: 30,
    bottom: 40,
    left: 10,
    right: 10,
  };

  const svg = d3.select("#vaccinePlot");

  svg.attr("width", size.width).attr("height", size.height);

  const x = d3
    .scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([margin.left, size.width - margin.right]);

  svg
    .append("g")
    .style("font-size", "12pt")
    .attr("transform", `translate(0, ${size.height - margin.bottom})`)
    .call(d3.axisBottom().scale(x).ticks(5).tickFormat(d3.timeFormat("%B")));

  const y = d3
    .scaleLinear()
    .domain([0, 0.6])
    .range([size.height - margin.bottom, margin.top]);

  const horizLines = svg.append("g");

  y.ticks(5)
    .slice(1)
    .forEach((yVal) => {
      horizLines
        .append("text")
        .text(`${yVal * 100}%`)
        .attr("x", margin.left)
        .attr("y", y(yVal) - 5);

      horizLines
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", size.width - margin.right)
        .attr("y1", y(yVal))
        .attr("y2", y(yVal))
        .attr("stroke", "gray")
        .attr("stroke-width", "0.5px");
    });

  const singleArea = d3
    .area()
    .x((d) => x(d.date))
    .y0((d) => y(d.fullPct))
    .y1((d) => y(d.singlePct));

  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", singleArea)
    .attr("class", "vaccineArea")
    .attr("id", "vaccine-partial")
    .attr("fill", "#E15759");

  const fullArea = d3
    .area()
    .x((d) => x(d.date))
    .y0(y(0))
    .y1((d) => y(d.fullPct));

  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", fullArea)
    .attr("class", "vaccineArea")
    .attr("id", "vaccine-full")
    .attr("fill", "#4E79A7");

  const color = {
    Partial: "#E15759",
    Full: "#4E79A7",
  };

  const legend = d3
    .select("#vaccineLegend")
    .style("width", size.width)
    .style("display", "flex")
    .style("flex-wrap", "wrap");

  legend
    .selectAll("squares")
    .data(["Partial", "Full"])
    .enter()
    .append("div")
    .attr("class", "vaccineLegends")
    .html(
      (d) =>
        `<div style="display: flex; text-transform: capitalize">
          <div style="width: 20px; height: 20px; margin-right: 3px;background-color: ${color[d]}"></div>
          ${d}
        </div>`
    )
    .style("padding", "5px")
    .style("user-select", "none")
    .on("mouseover", function (event, d) {
      d3.selectAll(".vaccineLegends").style("opacity", 0.2);
      d3.selectAll(".vaccineArea").style("fill-opacity", 0.2);
      d3.select(this).style("opacity", 1);
      d3.select(`#vaccine-${d.toLowerCase()}`).style("fill-opacity", 1);
    })
    .on("mouseleave", () => {
      d3.selectAll(".vaccineLegends").style("opacity", 1);
      d3.selectAll(".vaccineArea").style("fill-opacity", 1);
    });
})();
