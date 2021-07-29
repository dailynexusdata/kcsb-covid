(async () => {
  const container = d3
    .select("#kcsb-covid-dropouts-d3")
    .style("margin", "0 10px");

  container
    .append("h1")
    .text(
      "Cancel / Lapse / Withdrawals Stay Constant In The Beginning Pandemic"
    )
    .style("max-width", "600px")
    .style("word-wrap", "break-word")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "22pt")
    .style("font-weight", "normal")
    .style("margin", 0);

  const plotArea = container
    .append("div")
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("justify-content", "center");
  container
    .append("p")
    .text(
      "Source: County of Santa Barbara Housing and Community Development Division"
    )
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("margin", "5px 0 0 0");
  const data = {
    ugrad: [
      [
        { year: 2019, quarter: "spring", pct: 0.022 },
        { year: 2020, quarter: "spring", pct: 0.022 },
      ],
      [
        { year: 2019, quarter: "fall", pct: 0.047 },
        { year: 2020, quarter: "fall", pct: 0.046 },
      ],
    ],
    grad: [
      [
        { year: 2019, quarter: "spring", pct: 0.01 },
        { year: 2020, quarter: "spring", pct: 0.008 },
      ],
      [
        { year: 2019, quarter: "fall", pct: 0.068 },
        { year: 2020, quarter: "fall", pct: 0.068 },
      ],
    ],
  };

  console.log(d3.scaleOrdinal(d3.schemeTableau10).range());

  const makePlot = (div, data, title) => {
    const size = {
      width: Math.min(250, window.innerWidth - 40),
      height: 200,
    };

    const margin = {
      top: 20,
      left: 45,
      bottom: 30,
      right: 45,
    };
    div
      .append("h3")
      .text(title)
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .style("font-weight", "normal")
      // .style("text-decoration", "underline")
      .style("margin", 0);

    const svg = div.append("svg");

    svg.attr("width", size.width).attr("height", size.height);

    const y = d3
      .scaleLinear()
      .domain([0, 0.08])
      .range([size.height - margin.bottom, margin.top]);

    const x = d3
      .scalePoint()
      .domain([2019, 2020])
      .range([margin.left, size.width - margin.right]);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.pct));

    const colors = {
      spring: "#59a14f",
      fall: "#9c755f",
    };

    svg
      .selectAll("lines")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d) => {
        console.log(line(d));
        return line(d);
      })
      .attr("stroke", (d) => colors[d[0].quarter])
      .attr("stroke-width", 2);

    svg
      .selectAll("endcircs")
      .data([...data[0], ...data[1]])
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.pct))
      .attr("fill", (d) => colors[d.quarter])
      .attr("r", 4);

    svg
      .selectAll("endlabs")
      .data([data[0][1], data[1][1]])
      .enter()
      .append("text")
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .text((d) => Math.round(d.pct * 1000) / 10 + "%")
      .attr("x", (d) => x(d.year))
      .attr("text-anchor", "middle")
      .attr("y", (d) => y(d.pct) - 5)
      .attr("fill", (d) => colors[d.quarter]);

    svg
      .selectAll("startlabs")
      .data([data[0][0], data[1][0]])
      .enter()
      .append("text")
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .text((d) => d.quarter[0].toUpperCase() + d.quarter.slice(1))
      .attr("x", (d) => x(d.year) - 5)
      .attr("y", (d) => y(d.pct) - 8)
      .attr("fill", (d) => colors[d.quarter]);
    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .style("color", "#adadad")
      .attr("transform", `translate(0, ${size.height - margin.bottom})`)
      .call(
        d3
          .axisBottom()
          .scale(x)
          .tickValues([2019, 2020])
          .tickFormat((d) => d)
      );
    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .style("color", "#adadad")
      .attr("transform", `translate(${margin.left - 10}, 0)`)
      .call(
        d3
          .axisLeft()
          .scale(y)
          .ticks(4)
          // .tickValues([2019, 2020])
          .tickFormat((d, i) => d * 100 + (i === 4 ? "%" : ""))
      );

    if (title === "Undergraduate") {
      svg
        .append("text")
        .text("First Quarter Online")
        .attr("x", 195)
        .attr("y", size.height - margin.bottom - 10)
        .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
        .style("font-size", "12pt")
        .style("font-weight", "bold")
        .attr("text-anchor", "end")
        .style("fill", colors.spring);
      svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "triangle2")
        .attr("refX", 4)
        .attr("refY", 2)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 4 0 0 2 4 4")
        .attr("fill", colors.spring);
      svg
        .append("path")
        .attr(
          "d",
          `M ${size.width - 40} ${y(0.016)} Q ${size.width - 35} ${y(0.01)}, ${
            size.width - 50
          } ${y(0.007)}`
        )
        .attr("fill", "none")
        .attr("stroke", colors.spring)
        .attr("stroke-width", 2)
        .attr("marker-start", "url(#triangle2)");
    }
  };

  const makeAllPlots = () => {
    plotArea.selectAll("*").remove();

    const ugradDiv = plotArea.append("div");
    makePlot(ugradDiv, data.ugrad, "Undergraduate");

    const gradDiv = plotArea.append("div");
    makePlot(gradDiv, data.grad, "Graduate");
  };

  window.addEventListener("resize", () => {
    makeAllPlots();
  });

  makeAllPlots();
})();
