(async () => {
  const data = await d3.json("data/ivPlaces.json");
  console.log(data);

  //   const container = d3.select("#kcsb-covid-houselessness-d3");

  const simpleMap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  );
  window.addEventListener("resize", () => {
    makePlot();
  });

  const container = d3
    .select("#kcsb-covid-houselessness-d3")
    .style("max-width", "600px")
    .style("margin", "0 10px");

  container
    .append("h1")
    .text("Houselessness in I.V. Throughout the Pandemic")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "18pt")
    .style("font-weight", "normal")
    .style("margin", 0);

  container
    .append("p")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .text(
      "The Continuum of Care data estimates that over 100 persons have resided in Isla Vista during the pandemic."
    )
    .style("margin", 0);

  const mapContainer = container
    .append("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("width", "100%")
    .append("div")
    .attr("id", "houselessness-map");

  container
    .append("p")
    .text(
      "Source: County of Santa Barbara Housing and Community Development Division"
    )
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("margin", "5px 0 0 0");
  const makePlot = () => {
    const size = {
      height: 400,
      width: Math.min(window.innerWidth - 40, 600),
    };
    mapContainer
      .style("height", size.height + "px")
      .style("width", size.width + "px")
      .style("position", "relative");

    const map = L.map("houselessness-map", {
      zoomControl: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
    }).setView([34.412, -119.862], 15);
    map.addLayer(simpleMap);
    L.svg().addTo(map);
    const overlay = d3
      .select(map.getPanes().overlayPane)
      .attr("pointer-events", "auto");

    const colors = d3.scaleOrdinal().range([
      "#76b7b2",
      // "#e15759",
      "#9c755f",
      "#59a14f",
      // "#edc949",
      // "#ff9da7",
      "#4e79a7",
      "#af7aa1",
      "#f28e2c",
    ]);

    const svg = overlay
      .select("svg")
      .attr("height", size.height)
      .attr("width", size.width)
      .style("height", size.height + "px")
      .style("width", size.width + "px")
      .attr("viewBox", null)
      .style("transform", null)
      .attr("pointer-events", "visible")
      .style("pointer-events", "visible");

    const getLatLng = ({ lat, lng }) => {
      const ll = new L.latLng(lat, lng);
      return map.latLngToLayerPoint(ll);
    };

    const line = d3
      .line()
      .x((d) => getLatLng(d).x)
      .y((d) => getLatLng(d).y);

    const placesOutline = svg
      .selectAll("ivplacesOutline")
      .data(Object.entries(data))
      .join("g")
      .attr("fill", (_, i) => colors(i))
      .on("mouseenter mousemove touchstart", (event, d) => {
        const [mouseX, mouseY] = d3.pointer(event);

        d3.selectAll(".tooltipHouselessness").remove();
        d3.selectAll("[class^='houselessPlaceArea']").attr("fill-opacity", 0.3);
        d3.select("text.houselessPlaceArea" + d[0]).attr("fill-opacity", 1);
        d3.select("path.houselessPlaceArea" + d[0]).attr("fill-opacity", 0.7);

        const tooltip = mapContainer
          .append("div")
          .attr("class", "tooltipHouselessness")
          .style("position", "absolute")
          .style("z-index", 1000)
          .style("top", mouseY + 5 + "px")
          .style("left", mouseX + 5 + "px")
          .style("background-color", "white")
          .style("padding", "0 10px")
          .style("border", "0.5px solid #adadad88")
          .style("border-radius", "10px")
          .style("max-width", "175px");

        tooltip.append("h3").text(d[1].name).style("margin", "0 5px 0 0");
        tooltip
          .append("hr")
          .style("margin", 0)
          .style("border", "1px solid #adadad88");
        tooltip.append("p").html(d[1].text).style("margin", 0);
      })
      .on("mouseleave touchend", () => {
        d3.selectAll("text[class^='houselessPlaceArea']").attr(
          "fill-opacity",
          1
        );
        d3.selectAll("path[class^='houselessPlaceArea']").attr(
          "fill-opacity",
          0.7
        );
        d3.selectAll(".tooltipHouselessness").remove();
      });

    placesOutline
      .append("path")
      .attr("d", (d) => line(d[1].area))
      .attr("fill-opacity", 0.7)
      .attr("class", (d) => "houselessPlaceArea" + d[0])
      .style("pointer-events", "visible")
      .raise();

    placesOutline
      .append("text")
      .attr("class", (d) => "houselessPlaceArea" + d[0])
      .text((k) => k[1].name)
      .attr("x", (d) => getLatLng(d[1].textLoc).x)
      .attr("y", (d) => getLatLng(d[1].textLoc).y)
      .style("user-select", "none")
      .style("-moz-user-select", "none")
      .style("-webkit-user-select", "none")
      .style("font-weight", "bold")
      .style("font-size", "12pt");
  };

  makePlot();
})();
