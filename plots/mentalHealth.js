(async () => {
  const container = d3
    .select("#kcsb-covid-mentalHealth-d3")
    .style("max-width", "600px")
    .style("margin", "0 10px");

  container
    .append("h1")
    .text("UC-Wide Mental Health 2019")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "18pt")
    .style("font-weight", "normal")
    .style("margin", 0);

  const plotArea = container.append("div");
  // .style("display", "flex")
  // .style("flex-wrap", "wrap")
  // .style("justify-content", "center");
  container
    .append("p")
    .text(
      "Survey from 9,715 undergraduate and 2,593 graduate students from 9/10 UC Campuses."
    )
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("margin", "5px 0 0 0");
  container
    .append("p")
    .text(
      "Source: University of California Graduate, Undergraduate and Equity Affairs"
    )
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("margin", "5px 0 0 0");
  const data = [
    {
      caption: "factors affecting performance",
      values: [
        { lab: "Stress", ugrad: 0.41, grad: 0.26 },
        { lab: "Anxiety", ugrad: 0.31, grad: 0.21 },
        { lab: "Sleep Difficulties", ugrad: 0.24, grad: 0.16 },
        { lab: "Depression", ugrad: 0.24, grad: 0.13 },
      ],
    },
    {
      caption: "challenges reported",
      values: [
        { lab: "Attempted suicide", ugrad: 0.023, grad: 0.012 },
        { lab: "Caused intentional self-harm", ugrad: 0.091, grad: 0.052 },
        { lab: "Considered suicide", ugrad: 0.15, grad: 0.078 },
        { lab: "Felt hopeless", ugrad: 0.64, grad: 0.34 },
        { lab: "Felt overwhelming anxiety", ugrad: 0.68, grad: 0.52 },
        { lab: "Felt lonely", ugrad: 0.74, grad: 0.62 },
        { lab: "Felt exhausted", ugrad: 0.88, grad: 0.86 },
        { lab: "Felt overwhelmed", ugrad: 0.9, grad: 0.87 },
      ],
    },
  ];

  const colors = {
    grad: "#edc949",
    ugrad: "#4e79a7",
  };

  const makePlot = (div, data, scaleExtent) => {
    const size = {
      width: Math.min(600, window.innerWidth - 40),
      height: data.values.length * 50,
    };
    const margin = {
      top: 15,
      left: 20,
      bottom: 60,
      right: 30,
    };

    div
      .append("h3")
      .text(data.caption)
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      .style("font-weight", "normal")
      .style("margin", 0)
      .style("text-transform", "capitalize");

    const svg = div
      .append("svg")
      .attr("width", size.width)
      .attr("height", size.height);

    const y = d3
      .scalePoint()
      .domain(data.values.map((d) => d.lab))
      .range([margin.top, size.height - margin.bottom]);

    const cats = svg
      .selectAll("cats")
      .data(data.values)
      .join("g")
      .attr("transform", (d) => `translate(0, ${y(d.lab)})`);

    const z = d3.scaleBand().domain(["ugrad", "grad"]).range([10, 35]);

    const x = d3
      .scaleLinear()
      .domain([0, scaleExtent.slice(-1)[0]])
      .range([margin.left, size.width - margin.right])
      .nice();

    cats
      .append("text")
      .text((d) => {
        return d.lab;
      })
      .attr("x", margin.left)
      .attr("y", 7)
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif");

    cats
      .selectAll("bars")
      .data((d) => [
        { which: "ugrad", val: d.ugrad },
        { which: "grad", val: d.grad },
      ])
      .enter()
      .append("rect")
      .attr("x", (d) => margin.left)
      .attr("y", (d) => z(d.which))
      .attr("height", 10)
      .attr("width", (d) => x(d.val) - x(0))
      .attr("fill", (d) => colors[d.which]);

    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .style("color", "#adadad")
      .attr("transform", `translate(0, ${size.height - margin.bottom / 2 + 5})`)
      .call(
        d3
          .axisBottom()
          .scale(x)
          .tickValues(scaleExtent)
          .tickFormat((d) => Math.round(d * 100) + "%")
      );
  };

  const makeAllPlots = () => {
    plotArea.selectAll("*").remove();

    const firstDiv = plotArea.append("div");
    makePlot(firstDiv, data[0], [0, 0.25, 0.5]);

    const secondDiv = plotArea.append("div");
    makePlot(secondDiv, data[1], [0, 0.5, 1]);
  };

  window.addEventListener("resize", () => {
    makeAllPlots();
  });

  makeAllPlots();
})();
