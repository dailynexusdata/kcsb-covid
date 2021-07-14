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
  const vacDiv = document.getElementById("vaccines");
  if (!vacDiv.contains(event.target)) {
    closeVaccines();
  }
  const varDiv = document.getElementById("variants");
  if (!varDiv.contains(event.target)) {
    closeVariants();
  }
  const ucsbDiv = document.getElementById("ucsbTesting");
  if (!ucsbDiv.contains(event.target)) {
    closeUCSB();
  }
};

window.addEventListener("click", closeStuff);
window.addEventListener("touchstart", closeStuff);
window.addEventListener("touchmove", closeStuff);
