const closeUCSB = () => {
  d3.select("#ucsbLine").attr("stroke-opacity", 1);
  d3.select("#ucsbLineLab").attr("fill-opacity", 1);
  d3.selectAll(".ucsbHoverArea").remove();
};

(async () => {
  const parseTime = d3.timeParse("%m/%d/%Y");

  window.addEventListener("resize", () => {
    makePlot();
  });

  const data = (
    await d3.csv(
      "https://raw.githubusercontent.com/dailynexusdata/kcsb-covid/main/data/ucsbData.csv"
    )
  ).map(({ date, count_average }) => {
    return {
      date: parseTime(date),
      avg: +count_average,
    };
  });

  console.log(data);

  const makePlot = () => {
    const size = {
      width: Math.min(600, window.innerWidth) - 40,
      height: 400,
    };

    const margin = {
      top: 30,
      bottom: 40,
      left: 15,
      right: 15,
    };

    const container = d3
      .select("#ucsbPlot")
      .style("position", "relative")
      .style("width", "100%")
      .style("height", size.height + "px")
      .style("display", "flex")
      .style("justify-content", "center");

    container.selectAll("*").remove();
    const svg = container
      .append("div")
      .style("position", "absolute")
      .append("svg");

    svg.attr("width", size.width).attr("height", size.height);
    const x = d3
      .scaleTime()
      .domain([data[0].date, data[data.length - 1].date])
      .range([margin.left, size.width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.avg))
      .range([size.height - margin.bottom, margin.top]);

    const axis = svg.append("g");
    y.ticks(5)
      // .slice(1)
      .forEach((yVal, i) => {
        axis
          .append("text")
          .text(yVal + (i === 3 ? " tests" : ""))
          .attr("fill", "#adadad")
          .attr("x", size.width - margin.right)
          .attr("y", y(yVal) + (window.innerWidth < 400 ? 18 : -5))
          .attr("text-anchor", "end");
        axis
          .append("line")
          .attr("x1", margin.left)
          .attr("x2", size.width - margin.right)
          .attr("y1", y(yVal))
          .attr("y2", y(yVal))
          .attr("stroke", "#d3d3d3")
          .attr("stroke-width", "0.5px");
      });

    svg
      .append("g")
      .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
      .style("font-size", "12pt")
      .attr("transform", `translate(0, ${size.height - margin.bottom})`)
      .call(
        d3
          .axisBottom()
          .scale(x)
          //   .ticks(6)
          .tickFormat((d, i) => {
            const t = d3.timeFormat("%b")(d);
            if (window.innerWidth < 500 && i % 2 === 0) {
              return "";
            }
            return t === "Jan" ? t + "'21" : t;
          })
      );

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.avg));

    svg
      .datum(data)
      .append("path")
      .attr("d", line)
      .attr("id", "ucsbLine")
      .attr("stroke", "#4E79A7")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    svg
      .append("text")
      .text("7-day Average")
      .attr("id", "ucsbLineLab")
      .attr("fill", "#4E79A7")
      .attr("x", x(new Date(2020, 12, 30)))
      .attr("y", y(205))
      .attr("font-weight", "bold");
    const createLine = (d) => {
      svg.selectAll(".ucsbHoverArea").remove();
      const hoverArea = svg.append("g").attr("class", "ucsbHoverArea");
      hoverArea
        .append("line")
        .attr("x1", x(d.date))
        .attr("x2", x(d.date))
        .attr("y1", y(0))
        .attr("y2", y(d.avg))
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .style("stroke-dasharray", "3, 3");
      hoverArea
        .append("circle")
        .attr("cx", x(d.date))
        .attr("cy", y(d.avg))
        .attr("r", 3)
        .attr("stroke-width", 2)
        .attr("stroke", "black");
      hoverArea
        .append("text")
        .text(d3.timeFormat("%m/%d/%Y")(d.date))
        .attr("x", x(d.date) + (x(d.date) > size.width / 2 ? -5 : 5))
        .attr("y", size.height - margin.bottom - 7)
        .attr("text-anchor", x(d.date) > size.width / 2 ? "end" : "start")
        .attr("alignment-baseline", "middle");
      hoverArea
        .append("text")
        .text(Math.round(d.avg * 100) / 100 + " tests")
        .attr("x", x(d.date) + (x(d.date) > size.width / 2 ? -5 : 5))
        .attr("y", y(d.avg))
        .attr("text-anchor", x(d.date) > size.width / 2 ? "end" : "start")
        .attr("alignment-baseline", "middle");
    };
    svg.on("mousemove touchaout", (event) => {
      d3.select("#ucsbLine").attr("stroke-opacity", 0.3);
      d3.select("#ucsbLineLab").attr("fill-opacity", 0.3);
      const mouseX = d3.pointer(event)[0];

      const xVal = x.invert(mouseX);

      // ill make a better thing later
      const closestPoint = data.reduce((best, curr) => {
        if (
          Math.abs(best.date.getTime() - xVal.getTime()) <
          Math.abs(curr.date.getTime() - xVal.getTime())
        ) {
          return best;
        }
        return curr;
      });
      createLine(closestPoint);
    });

    svg.on("mouseleave touchend touchcancel", () => {
      closeUCSB();
    });
  };

  makePlot();
})();
