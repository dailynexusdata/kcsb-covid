(async () => {
  const container = d3
    .select("#kcsb-covid-mentalHealth-d3")
    .style("max-width", "600px")
    .style("margin", "0 10px");

  container
    .append("h1")
    .text("US Wide Mental Health Survey - Spring 2021")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "18pt")
    .style("letter-spacing", "normal")
    .style("margin", "0 0 10px 0");

  const plotArea = container
    .append("div")
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("justify-content", "center");
  container
    .append("p")
    .text("Survey from 96,489 students across 137 schools in the US.")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("letter-spacing", "normal")
    .style("margin", "5px 0 0 0")
    .style("line-height", "18px");
  container
    .append("p")
    .text(
      "Source: American College Health Association Spring 2021 National College Health Assessment."
    )
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("letter-spacing", "normal")
    .style("margin", "5px 0 0 0")
    .style("line-height", "18px");
  const data = [
    {
      caption: "% Students with mental health diagnoses within the last year",
      values: [
        { lab: "ADD/ADHD", ugrad: 0.089 * 0.651, grad: 0.086 * 0.691 },
        {
          lab: "Alcohol or Drug-Related Abuse",
          ugrad: 0.014 * 0.38,
          grad: 0.017 * 0.382,
        },
        { lab: "Anxiety", ugrad: 0.289 * 0.724, grad: 0.296 * 0.747 },
        { lab: "Depression", ugrad: 0.234 * 0.721, grad: 0.237 * 0.706 },
        { lab: "Eating Disorders", ugrad: 0.05 * 0.52, grad: 0.047 * 0.416 },
        {
          lab: "OCD, Body Dysmorphia, Hoarding",
          ugrad: 0.048 * 0.618,
          grad: 0.04 * 0.602,
        },
        { lab: "PTSD", ugrad: 0.067 * 0.694, grad: 0.072 * 0.659 },
        {
          lab: "Schizophrenia",
          ugrad: 0.003 * 0.583,
          grad: 0.002 * 0.468,
        },
        {
          lab: "Tourette's",
          ugrad: 0.003 * 0.395,
          grad: 0.003 * 0.348,
        },
      ],
    },
    {
      caption: "Stress level",
      values: [
        { lab: "No Stress", ugrad: 0.012, grad: 0.013 },
        { lab: "Low", ugrad: 0.171, grad: 0.202 },
        { lab: "Moderate", ugrad: 0.482, grad: 0.479 },
        { lab: "High", ugrad: 0.336, grad: 0.306 },
      ],
    },
    {
      caption: "Got enough sleep to feel rested",
      values: [
        { lab: "0 days out of the week", ugrad: 0.199, grad: 0.058 },
        { lab: "1-2 days", ugrad: 0.373, grad: 0.256 },
        { lab: "3-5 days", ugrad: 0.327, grad: 0.409 },
        { lab: "6-7 days", ugrad: 0.101, grad: 0.277 },
      ],
    },
  ];

  console.log(data);

  const colors = {
    grad: "#edc949",
    ugrad: "#4e79a7",
  };

  const makePlot = (div, data, scaleExtent) => {
    const size = {
      width: 270,
      height: data.values.length * 50,
    };
    const margin = {
      top: 15,
      left: 20,
      bottom: 60,
      right: 45,
    };

    div
      .append("h3")
      .text(data.caption)
      .style("width", size.width + "px")
      .style("letter-spacing", "normal")
      .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
      // .style("font-weight", "normal")
      .style("margin", 0)
      // .style("text-transform", "capitalize")
      .style("word-wrap", "break-word");

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
      .attr("y", 6.5)
      .style("letter-spacing", "normal")
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

    cats
      .append("text")
      .attr("x", (d) => x(d.ugrad) + 1)
      .attr("y", z("ugrad") + 10)
      .text((d) => Math.round(d.ugrad * 1000) / 10)
      .style("font-size", "10pt")
      .style("letter-spacing", "normal")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .attr("fill", colors["ugrad"]);
    // .style("font-weight", "bold");

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

    if (scaleExtent[2] === 0.2) {
      svg
        .append("text")
        .attr("fill", colors.ugrad)
        .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
        .style("font-weight", "bold")
        .text("Undergrads")
        .attr("x", x(0.2))
        .attr("text-anchor", "end")
        .attr("y", 20);
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
        .attr("fill", colors.ugrad);
      svg
        .append("path")
        .attr("d", `M ${x(0.09) + 5} 32 Q ${x(0.12)} 35, ${x(0.16) - 5} 25`)
        .attr("fill", "none")
        .attr("stroke", colors.ugrad)
        .attr("stroke-width", 2)
        .attr("marker-start", "url(#triangle2)");
    } else if (data.caption === "Stress Level") {
      svg
        .append("text")
        .attr("fill", colors.grad)
        .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
        .style("font-weight", "bold")
        .text("Grads")
        .attr("x", x(0.3))
        .attr("text-anchor", "start")
        .attr("y", 70);

      svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "triangle1")
        .attr("refX", 4)
        .attr("refY", 2)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 4 0 0 2 4 4")
        .attr("fill", colors.grad);
      svg
        .append("path")
        .attr("d", `M ${x(0.23)} 85 Q ${x(0.27)} 86, ${x(0.33)} 75`)
        .attr("fill", "none")
        .attr("stroke", colors.grad)
        .attr("stroke-width", 2)
        .attr("marker-start", "url(#triangle1)");
    }
  };

  const makeAllPlots = () => {
    plotArea.selectAll("*").remove();

    const firstDiv = plotArea.append("div").style("margin", "0 20px");
    makePlot(firstDiv, data[0], [0, 0.1, 0.2]);

    const nestedDiv = plotArea.append("div").style("margin", "8px");

    const secondDiv = nestedDiv.append("div").style("margin-bottom", "8px");
    makePlot(secondDiv, data[1], [0, 0.25, 0.5]);

    const thirdDiv = nestedDiv.append("div");
    makePlot(thirdDiv, data[2], [0, 0.25, 0.5]);
  };

  makeAllPlots();
})();
