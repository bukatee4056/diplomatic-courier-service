window.addEventListener("DOMContentLoaded", () => {

  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  console.log("DOM READY");

  if (!button || !input || !result) {
    console.log("Missing elements:", { button, input, result });
    return;
  }

  button.addEventListener("click", () => {

    console.log("BUTTON WORKING");

    result.innerHTML = "Button works: " + input.value;

  });

});