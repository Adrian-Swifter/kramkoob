const inputElem = document.getElementById("input_elem");
const saveBtn = document.getElementById("input_btn");
const saveURL = document.getElementById("save_url");
const linksContainer = document.getElementById("links");
let links = [];

let linksFromLS = JSON.parse(localStorage.getItem("links"));

if (linksFromLS) {
  links = linksFromLS;
  render(links);
}

linksContainer.addEventListener("click", function (e) {
  if (e.target && e.target.className === "deleteLink") {
    links.splice(e.target.previousElementSibling.dataset.index, 1);
    localStorage.setItem("links", JSON.stringify(links));
    render(links);
  } else if (e.target && e.target.parentElement.className === "incognito") {
    console.log(e.target.parentElement.nextElementSibling.href);
    chrome.windows.getAll(
      { populate: false, windowTypes: ["normal"] },
      function (windows) {
        for (let w of windows) {
          if (w.incognito) {
            chrome.tabs.create({
              url: e.target.parentElement.nextElementSibling.href,
              windowId: w.id,
            });
            return;
          }
        }
        chrome.windows.create({
          url: e.target.parentElement.nextElementSibling.href,
          incognito: true,
        });
      }
    );
  }
});

document.addEventListener(
  "mouseenter",
  function (e) {
    if (e.target && e.target.className === "deleteLink") {
      e.target.previousElementSibling.style.border = "2px dashed red";
    }
  },
  true
);

document.addEventListener(
  "mouseleave",
  function (e) {
    if (e.target && e.target.className === "deleteLink") {
      e.target.previousElementSibling.style.border = "2px solid transparent";
    }
  },
  true
);

saveBtn.addEventListener("click", function () {
  if (inputElem.value === "") {
    error.innerText = "Input value can't be empty!";
  } else {
    links.push(btoa(inputElem.value));
    localStorage.setItem("links", JSON.stringify(links));
    inputElem.value = "";
    render(links);
    error.innerText = "";
  }
});

saveURL.addEventListener("click", function () {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      links.push(btoa(tabs[0].url));
      localStorage.setItem("links", JSON.stringify(links));
      render(links);
      error.innerText = "";
    }
  );
});

function render(linksToRender) {
  let lis = "";

  linksToRender.forEach((link, index) => {
    lis += `<li><span class="link-wrapper" data-index="${index}">
    <button class="incognito" title="Open in a new incognito window"><img src="images/incognito.png"></button>
    <a class="link" href="${atob(
      link
    )}" target="_blank" title="Open in a new tab">${atob(
      link
    )}</a></span><button class="deleteLink" title="Delete this link">X</button></li>`;
  });

  linksContainer.innerHTML = lis;
}
