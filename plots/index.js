document.getElementById(
  "vacEmbed"
).innerText = `<style>@media (max-width: 580px){#vaccineIframe{height: 534px;}}@media (max-width: 407px){#vaccineIframe{height: 552px;}}@media (max-width: 390px){#vaccineIframe{height: 576px;}}</style> <iframe id="vaccineIframe" src="https://dailynexusdata.github.io/kcsb-covid/#vaccines" height="500px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;
document.getElementById(
  "varEmbed"
).innerText = `<iframe src="https://dailynexusdata.github.io/kcsb-covid/#variants" height="531px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;

document.getElementById(
  "ucsbEmbed"
).innerText = `<iframe src="https://dailynexusdata.github.io/kcsb-covid/#ucsbTesting" height="558px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;

const closeStuff = function (event) {
  const vacDiv = document.getElementById("vaccinePlot");
  if (!vacDiv.contains(event.target)) {
    closeVaccines();
  }
  const varDiv = document.getElementById("variantPlot");
  if (!varDiv.contains(event.target)) {
    closeVariants();
  }
  const ucsbDiv = document.getElementById("ucsbPlot");
  if (!ucsbDiv.contains(event.target)) {
    closeUCSB();
  }
};

document.addEventListener("click", closeStuff);
document.addEventListener("touchstart", closeStuff);
document.addEventListener("touchend", closeStuff);
document.addEventListener("touchcancel", closeStuff);
document.addEventListener("touchmove", closeStuff);
