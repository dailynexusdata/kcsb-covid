(async () => {
  const container = d3
    .select("#kcsb-covid-dropouts1-d3")
    .style("margin", "0 10px");

  container
    .append("h1")
    .html(
      "Cancels/<wbr>Lapses/<wbr>Withdrawals Stay Constant in the Beginning of the Pandemic"
    )
    .style("max-width", "600px")
    .style("word-wrap", "break-word")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "18pt")
    .style("font-weight", "normal")
    .style("margin", 0);

  const plotArea = container
    .append("div")
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("justify-content", "center");
  container
    .append("p")
    .text("Source: UCSB Office of Public Affairs and Communications")
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
  const colors = {
    Graduate: "#edc949",
    Undergraduate: "#4e79a7",
  };

  const makePlot = (div, data, title) => {
    const size = {
      width: Math.min(250, window.innerWidth - 40),
      height: 200,
    };

    const margin = {
      top: 20,
      left: 15,
      bottom: 10,
      right: 25,
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
      .scalePoint()
      .domain(["spring", "fall", ""])
      .range([margin.top, size.height]);

    const z = d3.scaleLinear().domain([2020, 2019]).range([40, 20]);

    const x = d3
      .scaleLinear()
      .domain([0, 0.07])
      .range([40 + margin.left, size.width - margin.right]);

    const quarters = svg
      .selectAll("areas")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0, ${y(d[0].quarter)})`);

    quarters
      .append("text")
      .text((t) => {
        const txt = t[0].quarter;
        return txt[0].toUpperCase() + txt.slice(1);
      })
      .attr("x", margin.left)
      .attr("y", 0)
      .style("font-weight", "lighter")
      .style("font-size", "12pt")
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif");

    const years = quarters
      .selectAll("bars")
      .data((d) => d)
      .join("g");

    years
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d) => z(d.year) - 10)
      .attr("height", 10)
      .attr("width", (d) => x(d.pct) - x(0))
      .attr("fill", colors[title]);
    // .attr("fill-opacity", 0.2);

    years
      .append("text")
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .attr("y", (d) => z(d.year))
      .attr("x", margin.left)
      .text((t) => t.year);

    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .style("color", "#adadad")
      .attr("transform", `translate(0, ${size.height - margin.bottom * 4.5})`)
      .call(
        d3
          .axisBottom()
          .scale(x)
          .tickValues([0, 0.035, 0.07])
          .tickFormat((d) => Math.round(d * 1000) / 10 + "%")
      );
    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .style("color", "#adadad")
      .attr(
        "transform",
        `translate(0, ${size.height / 2 - margin.bottom * 3.5})`
      )
      .call(
        d3
          .axisBottom()
          .scale(x)
          .tickValues([0, 0.035, 0.07])
          .tickFormat((d) => Math.round(d * 1000) / 10 + "%")
      );

    if (title === "Graduate") {
      // svg
      //   .append("text")
      //   .text("First Quarter Online")
      //   .attr("x", x(0.015))
      //   .attr("y", size.height / 4 - 20)
      //   .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      //   .style("font-size", "12pt")
      //   .style("font-weight", "bold")
      //   .style("fill", colors.Graduate);
      // svg
      //   .append("svg:defs")
      //   .append("svg:marker")
      //   .attr("id", "triangle1")
      //   .attr("refX", 4)
      //   .attr("refY", 2)
      //   .attr("markerWidth", 4)
      //   .attr("markerHeight", 4)
      //   .attr("orient", "auto")
      //   .append("path")
      //   .attr("d", "M 4 0 0 2 4 4")
      //   .attr("fill", colors.Graduate);
      // svg
      //   .append("path")
      //   .attr("d", `M ${x(0.015) - 5} 54 Q ${x(0.025)} 50, ${x(0.02)} 35`)
      //   .attr("fill", "none")
      //   .attr("stroke", colors.Graduate)
      //   .attr("stroke-width", 2)
      //   .attr("marker-start", "url(#triangle1)");
    } else if (title === "Undergraduate") {
      svg
        .append("text")
        .text("First Quarter")
        .attr("x", x(0.07))
        .attr("y", size.height / 4 - 20)
        .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
        .style("font-size", "12pt")
        .style("font-weight", "bold")
        .attr("text-anchor", "end")
        .style("fill", colors.Undergraduate);
      svg
        .append("text")
        .text("Online")
        .attr("x", x(0.07))
        .attr("y", size.height / 4 - 5)
        .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
        .style("font-size", "12pt")
        .style("font-weight", "bold")
        .attr("text-anchor", "end")
        .style("fill", colors.Undergraduate);
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
        .attr("fill", colors.Undergraduate);
      svg
        .append("path")
        .attr("d", `M ${x(0.028)} 53 Q ${x(0.035)} 50, ${x(0.033)} 35`)
        .attr("fill", "none")
        .attr("stroke", colors.Undergraduate)
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
