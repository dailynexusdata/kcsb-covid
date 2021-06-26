(async () => {
  // we have to convert the string data into a date object,
  // this gets really annoying in js across different browsers,
  // i think using this d3 function is the easiest way:
  const parseTime = d3.timeParse("%Y-%m-%d");

  // read in the data and then convert numbers to numbers, date to date
  // things to look at:
  // 1. the original csv file
  // 2. log just the (await d3.csv(...)) part to see how that function works
  // 3. make sure you're familiar with map (and the other functional js functions)
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

  // Size is the total size of the plot, axis etc
  // I like to set it up in a single object, other people just leave individual
  // variables of height, width, it doesn't really matter
  const size = {
    width: 600,
    height: 400,
  };

  // margin is the space left for axis labels and such
  // again, other people will have variables like marginTop, marginBottom, etc...
  const margin = {
    top: 30,
    bottom: 40,
    left: 10,
    right: 10,
  };

  // in the html file, you'll see an svg I've left for the plot
  // with the id "vaccinePlot", we need this constant so that
  // d3 can start appending objects inside
  const svg = d3.select("#vaccinePlot");

  // this sets the size of the svg.
  // I also like to set the css size especially at the end so that way
  // it looks smoother on load
  //
  // Open the inspect tools on your browser by right clicking and view the html
  // You should see that the svg now has a width and height value in the tags
  svg.attr("width", size.width).attr("height", size.height);

  // this is our x axis that calculates the pixel position of a particular time
  // we set the domain [startDate, endDate] and the range,
  // the pixel values that they should map to.
  // x is just a function, we pass in a date and get a pixel position, and you can see
  // from the range that we account for the margins
  const x = d3
    .scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([margin.left, size.width - margin.right]);

  // making the x axis actually show up with ticks and labels is a bit more difficult
  // this isn't important to memorize, just copy over from previous projects,
  // the important thing is that we use axisBottom and pass in our scale (x)
  // Since we call "append", you should now see a <g> tag inside of our svg
  svg
    .append("g")
    .style("font-size", "12pt")
    .attr("transform", `translate(0, ${size.height - margin.bottom})`)
    .call(d3.axisBottom().scale(x).ticks(5).tickFormat(d3.timeFormat("%B")));

  // we need to setup our y scale aswell. since we want values increasing from
  // bottom to top, the range may look reversed from what you might expect
  const y = d3
    .scaleLinear()
    .domain([0, 0.6])
    .range([size.height - margin.bottom, margin.top]);

  // I like making custom y axis with text and lines,
  // first setup a group for all of this stuff to go in
  const horizLines = svg.append("g");

  // y.ticks(5) returns a nice array of evenly spaced values covering our scale's range
  // TODO: log y.ticks(5) to see what it returns,
  // I don't want a label for 0, so I use slice to remove that
  // forEach is the same as map except it doesn't return a value - part of functional js
  y.ticks(5)
    .slice(1)
    .forEach((yVal) => {
      // TODO: log yVal to see what is being passed in each iteration

      // make the text labels:
      // notice "text" has a .text, also an x and y attribute
      // I use the y() scale function to align the text correctly, (and subtract 5 so it doesn't overlap with line)
      horizLines
        .append("text")
        .text(`${yVal * 100}%`)
        .attr("x", margin.left)
        .attr("y", y(yVal) - 5);

      // make the horizontal line spanning entire plot:
      // notice line has an (x1, y1) and (x2, y2) for the line's endpoints
      // I also set the color (with stroke) and stroke size
      // TODO: play around with the attribute values
      horizLines
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", size.width - margin.right)
        .attr("y1", y(yVal))
        .attr("y2", y(yVal))
        .attr("stroke", "gray")
        .attr("stroke-width", "0.5px");
    });

  // we can use d3.area() to make a nice area plot
  // this setup takes an x value and then the lower ylimit (y0) and upper limit (y1)
  // these take in either values or functions, I pass in functions to call the axis we setup above
  // and use the correct data value
  const singleArea = d3
    .area()
    .x((d) => x(d.date))
    .y0((d) => y(d.fullPct))
    .y1((d) => y(d.singlePct));

  // singleArea is just a function, and we have to use d3 to make the actual visual
  // we attach our data with datum() and then make the path and call our Area function
  svg
    .append("g")
    .datum(data)
    .append("path")
    .attr("d", singleArea)
    .attr("fill", "red");

  // TODO:
  // make the full Area starting at 0 (.y0(0)) and the height as .fullPct using our y scale
  // const fullArea = d3.area();
  // svg.append("g").datum(data).append("path").attr("d", fullArea);
})();
