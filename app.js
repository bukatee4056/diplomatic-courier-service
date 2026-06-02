window.onload = function () {

  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  alert("JS LOADED");

  button.onclick = function () {

    alert("BUTTON CLICKED");

    result.innerHTML = "Button works. Input: " + input.value;

  };

};