document.getElementById(
  "vacEmbed"
).innerText = ` <style>@media (max-width: 580px){#vaccineIframe{height: 539px;}}@media (max-width: 407px){#vaccineIframe{height: 557px;}}@media (max-width: 390px){#vaccineIframe{height: 581px;}}</style> <iframe id="vaccineIframe" src="https://dailynexusdata.github.io/kcsb-covid/vaccines" height="505px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;
document.getElementById(
  "varEmbed"
).innerText = ` <style>@media (max-width: 568px){#variantsIframe{height: 577px;}}@media (max-width: 400px){#variantsIframe{height: 620px;}}</style><iframe id="variantsIframe" src="https://dailynexusdata.github.io/kcsb-covid/variants" height="528px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;

document.getElementById(
  "ucsbEmbed"
).innerText = ` <style>@media (max-width: 475px){#ucsbIframe{height: 535px;}}@media (max-width: 370px){#ucsbIframe{height: 550px;}}</style><iframe id="ucsbIframe" src="https://dailynexusdata.github.io/kcsb-covid/ucsbTesting" height="488px" width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;

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
  const ucsbDiv = document.getElementById("kcsb-covid-houselessness-d3");
  // if (!ucsbDiv.contains(event.target)) {
  // closeUCSB();
  // }
};

document.addEventListener("click", closeStuff);
document.addEventListener("touchstart", closeStuff);
document.addEventListener("touchend", closeStuff);
document.addEventListener("touchcancel", closeStuff);
document.addEventListener("touchmove", closeStuff);
