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
      "https://raw.githubusercontent.com/dailynexusdata/kcsb-covid/main/data/variants.csv"
    )
  ).map(({ date, ...variants }) => {
    delete variants[""];
    Object.entries(variants).forEach(([vr, val]) => {
      variants[vr] = Number(val);
    });
    return { date: parseTime(date), ...variants };
  });
  console.log(data);
  const variants = [
    "epsilon",
    "iota",
    "no_interest",
    "gamma",
    "delta",
    "alpha",
  ]; //shuffleArray(Object.keys(data[0]).slice(1));
  console.log(variants);
  const size = {
    width: 600,
    height: 400,
  };

  const margin = {
    top: 30,
    bottom: 40,
    left: 10,
    right: 10,
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
    .attr("transform", `translate(0, ${size.height - margin.bottom})`)
    .call(d3.axisBottom().scale(x));

  const y = d3
    .scaleLinear()
    .domain([-40, 40])
    .range([size.height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal().domain(variants).range(d3.schemeDark2);

  const stackedData = d3
    .stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(variants)(data);

  const area = d3
    .area()
    .x((d) => x(d.data.date))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]));
  svg
    .append("g")
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "variants")
    .attr("fill-opacity", 1)
    .attr("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area)
    .on("mouseover", function (event, d) {
      console.log(d.key);
      d3.selectAll(".variants").attr("fill-opacity", 0.3);
      d3.select(this).attr("fill-opacity", 1);
    })
    .on("mouseleave", function (event, d) {
      d3.selectAll(".variants").attr("fill-opacity", 1);
    });
})();
