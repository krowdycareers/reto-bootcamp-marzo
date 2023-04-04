const btnScripting = document.getElementById("btnPaginar");
const btnMessage = document.getElementById("message");
const content = document.querySelector(".content");
var byCity;
var byCityRow;
var h3;
var div1;
var div2;

btnScripting.addEventListener("click", async () => {
  const port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "start" , data: {}, status_: "start"});
  // port.onMessage.addListener(async ({ data }) => {
  //   btnMessage.innerText = data;
  // });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // btnMessage.innerText = JSON.stringify(request.data,null, 2);

    const nroJobBySalary = request.data;
    for (const keyJob in nroJobBySalary) {
      const salary = nroJobBySalary[keyJob];
      byCity = document.createElement("div");
      h3 = document.createElement("h3");
      h3.textContent = keyJob;
      byCityContent = document.createElement("div");
      byCity.appendChild(h3);
      
      for (const keySalary in salary) {
          const nroJob = salary[keySalary];

          byCityRow = document.createElement("div");
          div1 = document.createElement("div");
          div2 = document.createElement("div");
          div1.textContent = keySalary;
          div2.textContent = nroJob;

          byCityRow.appendChild(div1);
          byCityRow.appendChild(div2);

          byCityRow.style.display = "flex";
          byCityRow.style.justifyContent = "space-between";
          byCityContent.appendChild(byCityRow);
      }
      byCity.appendChild(byCityContent);
      content.appendChild(byCity);
    }
    sendResponse("Listo");
  });
});