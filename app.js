window.onload = function () {

  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  button.onclick = function () {

    const value = input.value.trim();

    if (!value) {
      alert("Enter tracking number");
      return;
    }

    result.innerHTML = `
      <h3>Tracking Number: ${value}</h3>
      <p>Status system is now working</p>
    `;
  };

};