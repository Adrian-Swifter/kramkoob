const clickBtn = document.getElementById("click-btn");
const checkBtn = document.getElementById("check-btn");
const passwordChange = document.getElementById("password-change");
const clickButtons = document.getElementById("click-buttons");
const container = document.getElementById("container");
const error = document.getElementById("error");
const passwordChanged = document.getElementById("password-changed");
const popup = document.getElementsByClassName("popup")[0];

const start = new Date().getTime();
let passwordArray = [];
let isPasswordChange = false;

if (
  localStorage.getItem("kramkoob") !== null &&
  document.body.className === "popup"
) {
  passwordChange.style.display = "none";
  clickButtons.style.display = "flex";
}

passwordChange.addEventListener("click", function () {
  isPasswordChange = true;
  clickButtons.style.display = "flex";
});

clickBtn.addEventListener("click", function () {
  passwordArray.push(new Date().getTime() - start);
});

checkBtn.addEventListener("click", function () {
  let trimmed = passwordArray.map((val) => val - passwordArray[0]);
  if (isPasswordChange) {
    localStorage.setItem("kramkoob", JSON.stringify(trimmed));
    passwordChanged.innerText = "Password successfully changed!";
  }
  validate(trimmed);

  passwordArray.length = 0;
  isPasswordChange = false;
  passwordChange.style.display = "none";
});

function validate(arr) {
  const currentPassword = JSON.parse(localStorage.getItem("kramkoob"));

  let counter = 0;

  currentPassword.forEach((num, index) => {
    if (num - 100 > arr[index] || num + 100 < arr[index]) {
      counter++;
    }
  });

  if (currentPassword.length !== arr.length) {
    error.innerText = "The number of clicks doesn't match!";
  } else if (counter > 0) {
    if (counter === 1) {
      error.innerText = `${counter} click is out of bounds!`;
    } else {
      error.innerText = `${counter} clicks is out of bounds!`;
    }
  } else {
    if (container) {
      container.style.display = "block";
    }

    clickButtons.style.display = "none";
    if (popup) {
      popup.style.minWidth = "400px";
    }

    if (error) {
      error.innerText = "";
    }
  }
}
