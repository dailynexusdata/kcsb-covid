(async () => {
  const parseTime = d3.timeParse("%Y-%m-%d");
  function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const data = (
    await d3.csv(
      "data/variants.csv"
      // "https://raw.githubusercontent.com/dailynexusdata/kcsb-covid/main/data/variants.csv"
    )
  ).map(({ date, ...variants }) => {
    Object.entries(variants).forEach(([vr, val]) => {
      variants[vr] = Number(val);
    });
    return { date: parseTime(date), ...variants };
  });
  const variants = ["epsilon", "iota", "gamma", "delta", "alpha"];
  // const variants = shuffleArray(Object.keys(data[0]).slice(1));

  const size = {
    width: Math.min(600, window.innerWidth * 0.95),
    height: 400,
  };

  const margin = {
    top: 30,
    bottom: 40,
    left: 20,
    right: 20,
  };
  const svg = d3.select("#variantPlot");

  svg.attr("width", size.width).attr("height", size.height);

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margin.left, size.width - margin.right]);

  svg
    .append("g")
    .style("font-size", "12pt")
    .attr("transform", `translate(0, ${size.height - margin.bottom + 5})`)
    .call(d3.axisBottom().scale(x).ticks(6).tickFormat(d3.timeFormat("%b")));

  const y = d3
    .scaleLinear()
    .domain([0, 250])
    .range([size.height - margin.bottom, margin.top]);

  const horizLines = svg.append("g");

  y.ticks(5)
    .slice(1)
    .forEach((yVal, i) => {
      horizLines
        .append("text")
        .text(yVal + (yVal === 250 ? " Cases" : ""))
        .attr("fill", "#adadad")
        .attr("x", margin.left)
        .attr("y", y(yVal) - 5);

      horizLines
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", size.width - margin.right)
        .attr("y1", y(yVal))
        .attr("y2", y(yVal))
        .attr("stroke", "#d3d3d3")
        .attr("stroke-width", "0.5px");
    });

  const color = d3.scaleOrdinal().domain(variants).range(d3.schemeTableau10);

  const stackedData = d3.stack().offset(d3.stackOffsetNone).keys(variants)(
    data
  );

  const area = d3
    .area()
    .x((d) => x(d.data.date))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(d3.curveMonotoneX);

  svg
    .append("g")
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "variants")
    .attr("id", (d) => `variant-${d.key}`)
    .attr("fill-opacity", 1)
    .attr("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  const legend = d3
    .select("#variantLegend")
    .style("width", size.width)
    .style("display", "flex")
    .style("flex-wrap", "wrap");

  legend
    .selectAll("leg")
    .data(variants.sort())
    .enter()
    .append("div")
    .attr("class", "variantLegends")
    .html(
      (d) =>
        `<div style="display: flex; text-transform: capitalize;">
          <div style="width: 20px; height: 20px; margin-right: 3px;background-color: ${color(
            d
          )}"></div>
          ${d}
        </div>`
    )
    .style("padding", "5px")
    .style("user-select", "none")
    .style("-webkit-user-select", "none")
    .on("mouseover", function (event, d) {
      d3.selectAll(".variantLegends").style("opacity", 0.2);
      d3.selectAll(".variants").style("fill-opacity", 0.2);
      d3.select(this).style("opacity", 1);
      d3.select(`#variant-${d}`).style("fill-opacity", 1);
    })
    .on("mouseleave", () => {
      d3.selectAll(".variantLegends").style("opacity", 1);
      d3.selectAll(".variants").style("fill-opacity", 1);
    });
})();
