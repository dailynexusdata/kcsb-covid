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
  const variants = ["epsilon", "alpha", "delta", "iota", "gamma"];

  const color = d3
    .scaleOrdinal()
    .domain(variants)
    .range(["#4e79a7", "#59a14f", "#76b7b2", "#f28e2c", "#e15759"]);

  window.addEventListener("resize", () => {
    makePlot();
  });

  const makePlot = () => {
    const size = {
      width: Math.min(600, window.innerWidth * 0.95),
      height: 400,
    };

    const margin = {
      top: 40,
      bottom: 40,
      left: window.innerWidth > 500 ? 60 : 40,
      right: window.innerWidth > 500 ? 60 : 40,
    };
    const svg = d3.select("#variantPlot");

    svg.selectAll("*").remove();

    svg.attr("width", size.width).attr("height", size.height);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, size.width - margin.right]);

    svg
      .append("g")
      .style("font-size", "12pt")
      .attr("transform", `translate(0, ${size.height - margin.bottom + 5})`)
      .call(
        d3
          .axisBottom()
          .scale(x)
          // .ticks(window.innerWidth > 400 ? 6 : 4)
          .tickValues(
            data
              .map(({ date }, i) =>
                window.innerWidth > 400 ? date : i % 2 == 1 ? null : date
              )
              .filter((d) => d !== null)
          )
          .tickFormat((d) => {
            const t = d3.timeFormat("%b")(d);

            return t === "Jan" ? t + "'21" : t;
          })
      );

    const y = d3
      .scaleLinear()
      // .domain([0, 250])
      .range([size.height - margin.bottom, margin.top]);

    const horizLines = svg.append("g");

    y.ticks(5)
      // .slice(1)
      .forEach((yVal, i) => {
        horizLines
          .append("text")
          .text(yVal * 100 + (yVal === 1 ? "%" : ""))
          .attr("fill", "#adadad")
          .attr("x", 0)
          .attr("y", y(yVal) - 5);

        horizLines
          .append("line")
          .attr("x1", 0)
          .attr("x2", size.width)
          .attr("y1", y(yVal))
          .attr("y2", y(yVal))
          .attr("stroke", "#d3d3d3")
          .attr("stroke-width", "0.5px");
      });

    // const stackedData = d3.stack().offset(d3.stackOffsetNone).keys(variants)(
    //   data
    // );
    const dataNormalized = data.map((d) => {
      const output = { date: d.date };

      let tot = 0;
      variants.forEach((v) => {
        tot += d[v];
      });

      variants.forEach((v) => {
        output[v] = d[v] / tot;
      });

      return output;
    });

    const stackedData = d3.stack().keys(variants)(dataNormalized);

    // const separatedData = {};
    // dataNormalized.forEach((d) => {
    //   variants.forEach((v) => {
    //     if (d[v] === 0) {
    //       return;
    //     }

    //     if (Object.keys(separatedData).includes(v)) {
    //       separatedData[v].push({ name: v, date: d.date, pct: d[v] });
    //     } else {
    //       separatedData[v] = [{ name: v, date: d.date, pct: d[v] }];
    //     }
    //   });
    // });

    const rectWidth =
      (size.width - margin.left - margin.right) /
      (window.innerWidth > 500 ? 12 : 10);

    console.log(dataNormalized);

    svg
      .append("g")
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      // .append("path")
      // .attr("class", "variants")
      // .attr("id", (d) => `variant-${d.key}`)
      // .attr("fill-opacity", 0.7)
      // .attr("fill", function (d) {
      //   return color(d.key);
      // })
      // .attr("d", area)
      .append("g")
      .attr("class", "variants")
      .attr("id", (d) => `variant-${d.key}`)
      .attr("fill", function (d) {
        return color(d.key);
      })
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d[1]))
      .attr("x", (d) => x(d.data.date) - rectWidth / 2)
      .attr("width", rectWidth)
      .attr("height", (d) => y(d[0]) - y(d[1]));

    svg
      .append("g")
      .selectAll(".variantOverlay")
      .data(data.map(({ date }) => date))
      .enter()
      .append("rect")
      .attr("y", y(1))
      .attr("x", (d) => x(d) - rectWidth / 2)
      .attr("width", rectWidth)
      .attr("height", y(0) - y(1))
      .attr("fill-opacity", 0)
      .on("mouseover", (_, d) => {
        console.log(data.find(({ date }) => date === d));
      });
    // const variantLine = d3
    //   .line()
    //   .y((d) => y(d.pct))
    //   .x((d) => x(d.date));

    // console.log(Object.values(separatedData));
    // svg
    //   .append("g")
    //   .selectAll(".variantLines")
    //   .data(Object.values(separatedData))
    //   .enter()
    //   .append("path")
    //   .attr("d", (d) => {
    //     console.log(d);
    //     return variantLine(d);
    //   })
    //   .attr("fill", "none")
    //   .attr("stroke", (d) => color(d[0].name))
    //   .attr("stroke-width", 5);

    const legend = d3
      .select("#variantLegend")
      .style("width", size.width)
      .style("display", "flex")
      .style("flex-wrap", "wrap");

    legend.selectAll("*").remove();

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
      .on("mouseover touchstart", function (event, d) {
        d3.selectAll(".variantLegends").style("opacity", 0.2);
        d3.selectAll(".variants").style("fill-opacity", 0.2);
        d3.select(this).style("opacity", 1);
        d3.select(`#variant-${d}`).style("fill-opacity", 1);

        const varData = stackedData
          .find((v) => v.key === d)
          .filter(([a, b]) => a !== b);

        svg
          .selectAll(".points")
          .data(varData)
          .enter()
          .append("circle")
          .attr("class", "points")
          .attr("cx", (d) => x(d.data.date))
          .attr("cy", (v) => y(v[1]))
          .attr("r", 4);
        svg
          .selectAll(".pointLabels")
          .data(varData)
          .enter()
          .append("text")
          .attr("class", "pointLabels")
          .attr("x", (d) => x(d.data.date))
          .attr("y", (v) => y(v[1]) - 8)
          .text((v) => Math.round((v[1] - v[0]) * 100) + "%")
          .attr("text-anchor", "middle");
      })
      .on("mouseleave touchend touchcancel", () => {
        d3.selectAll(".variantLegends").style("opacity", 1);
        d3.selectAll(".variants").style("fill-opacity", 1);
        d3.selectAll(".points").remove();
        d3.selectAll(".pointLabels").remove();
      });
  };

  makePlot();
})();
