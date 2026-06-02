window.addEventListener("load", function () {

  const button = document.querySelector("button");

  button.addEventListener("click", function () {

    const trackingNumber =
      document.querySelector("input").value.trim();

    const result =
      document.getElementById("result");

    if (trackingNumber === "DCS123456") {

      result.innerHTML = `
        <h3>Status: In Transit</h3>
        <p><strong>Location:</strong> Cairo, Egypt</p>
        <p><strong>Destination:</strong> Lagos, Nigeria</p>
        <p><strong>ETA:</strong> June 10, 2026</p>
      `;

    } else {

      result.innerHTML =
        "<p>Tracking number not found.</p>";

    }

  });

});