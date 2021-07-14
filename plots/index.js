document.getElementById("vacEmbed").innerText = `
<style>
                @media (max-width: 400px) {
                    #vaccineIframe {
                        height: 638px;
                    }
                }
            </style>
            <iframe id="vaccineIframe" src="https://dailynexusdata.github.io/kcsb-covid/#vaccines" height="558px"
                width="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0"></iframe>`;
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
document.addEventListener("focusout", closeStuff);
