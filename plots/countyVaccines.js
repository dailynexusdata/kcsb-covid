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

  const color = {
    Partial: "#E15759",
    Full: "#4E79A7",
  };

  const size = {
    width: Math.min(600, window.innerWidth * 0.95),
    height: 400,
  };

  const margin = {
    top: 30,
    bottom: 40,
    left: 5,
    right: 50,
  };

  const svg = d3.select("#vaccinePlot");

  svg.attr("width", size.width).attr("height", size.height);

  const x = d3
    .scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([margin.left, size.width - margin.right]);

  svg
    .append("g")
    .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif")
    .style("font-size", "12pt")
    .attr("transform", `translate(0, ${size.height - margin.bottom + 5})`)
    .call(d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%B")));

  const y = d3
    .scaleLinear()
    .domain([0, 0.6])
    .range([size.height - margin.bottom, margin.top]);

  const horizLines = svg.append("g");

  y.ticks(5)
    .slice(1)
    .forEach((yVal, i) => {
      horizLines
        .append("text")
        .text(`${yVal * 100}%${i === 5 ? " of Total County Population" : ""}`)
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

  const singleArea = d3
    .area()
    .x((d) => x(d.date))
    .y0((d) => y(d.fullPct))
    .y1((d) => y(d.singlePct));

  const singleLine = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.singlePct));
  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", singleArea)
    .attr("class", "vaccineArea")
    .attr("id", "vaccine-partial")
    .attr("fill", color.Partial)
    .attr("fill-opacity", 0.5);

  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("class", "vaccineLine")
    .attr("id", "vaccineLine-partial")
    .attr("d", singleLine)
    .attr("stroke", color.Partial)
    .attr("stroke-width", 5)
    .attr("fill", "none");

  const fullArea = d3
    .area()
    .x((d) => x(d.date))
    .y0(y(0))
    .y1((d) => y(d.fullPct));

  const fullLine = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.fullPct));

  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", fullArea)
    .attr("class", "vaccineArea")
    .attr("id", "vaccine-full")
    .attr("fill", color.Full)
    .attr("fill-opacity", 0.5);

  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", fullLine)
    .attr("class", "vaccineLine")
    .attr("id", "vaccineLine-full")
    .attr("stroke", color.Full)
    .attr("stroke-width", 5)
    .attr("fill", "none");

  const endText = (xPos, text, yPos, color, lab) => {
    svg
      .append("text")
      .attr("class", "vaccineEndLabel")
      .attr("id", `endLabel-${lab}`)
      .text(Math.round(text * 100) + "%")
      .attr("x", x(xPos) + 5)
      .attr("y", y(yPos))
      .attr("fill", color)
      .style("font-size", "16pt")
      .style("font-weight", "bold")
      .style("alignment-baseline", "middle");
  };

  const lastData = data[data.length - 1];
  console.log(lastData);
  endText(
    lastData.date,
    lastData.singlePct,
    lastData.singlePct,
    color.Partial,
    "partial"
  );
  endText(
    lastData.date,
    lastData.fullPct,
    lastData.fullPct,
    color.Full,
    "full"
  );
  // endText(
  //   lastData.date,
  //   lastData.singlePct - lastData.fullPct,
  //   (lastData.fullPct + lastData.singlePct) / 2,
  //   "#adadad"
  // );

  const legend = d3.select("#vaccineLegend").style("width", size.width);

  legend
    .append("p")
    .style("display", "black")
    .style("line-height", "18pt")
    .html(
      `County Percentage of<span class='squares'></span>and<span class='squares'></span>including adults and children.`
    );

  legend
    .selectAll(".squares")
    .data(["Partial", "Full"])
    .style("text-transform", "capitalize")
    .style("text-decoration", "underline")
    .style("text-decoration-color", (d) => color[d])
    .style("text-decoration-thickness", "0.4em")
    .attr("class", "vaccineLegends")
    .text((d) => `${d}${d === "Full" ? "" : "l"}y Vaccinated`)
    .style("padding", "5px")
    .style("-webkit-user-select", "none")
    .style("user-select", "none")
    .on("mouseover", function (event, d) {
      d3.selectAll(".vaccineLegends").style("opacity", 0.2);
      d3.selectAll(".vaccineLine").style("stroke-width", 0);
      d3.selectAll(".vaccineEndLabel").style("fill-opacity", 0.2);

      if (d.toLowerCase() === "partial") {
        d3.selectAll(".vaccineArea").style("fill", color.Partial);
        d3.selectAll(".vaccineEndLabel").style("fill-opacity", 0);
      } else {
        d3.selectAll(".vaccineArea").style("fill-opacity", 0.2);
      }

      d3.select(this).style("opacity", 1);
      d3.select(`#vaccine-${d.toLowerCase()}`).style("fill-opacity", 0.5);
      d3.select(`#vaccineLine-${d.toLowerCase()}`).style("stroke-width", 5);
      d3.select(`#endLabel-${d.toLowerCase()}`).style("fill-opacity", 1);
    })
    .on("mouseleave", (_, d) => {
      if (d.toLowerCase() === "partial") {
        d3.selectAll("#vaccine-full").style("fill", color.Full);
      }

      d3.selectAll(".vaccineLegends").style("opacity", 1);
      d3.selectAll(".vaccineLine").style("stroke-width", 5);
      d3.selectAll(".vaccineEndLabel").style("fill-opacity", 1);
      d3.selectAll(".vaccineArea").style("fill-opacity", 0.5);
    });

  // svg.on("mousemove", function (event) {
  //   const mouse = d3.pointer(event);

  //   const date = x.invert(mouse[0]);
  //   const bisect = d3.bisector((d) => d.date).right;
  //   const idx = bisect(d.values, date);

  //   console.log(idx);
  // });
})();
