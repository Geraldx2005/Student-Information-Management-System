let transportMode = document.querySelector(".transportMode");
let vehicleType = document.querySelector(".vehicleType");
let transportDiv = document.querySelector(".transportDiv");
let transportInner1 = document.querySelector(".transportInner1");
let transportInner2 = document.querySelector(".transportInner2");
let transportInner3 = document.querySelector(".transportInner3");
let transportInner4 = document.querySelector(".transportInner4");

// Navigation Panel collapse and expand.
const navPanel = document.getElementById("navPanel");
const navHeader = document.querySelector(".nav-header");


// Transport Mode and Vehicle Type
transportMode.addEventListener("change", () => {
  if (transportMode.value == "Own transport") {
    transportInner2.style.display = "flex";
    transportInner2.classList.add("rounded-bottom")
    transportInner1.classList.remove("rounded-bottom")
    transportDiv.style.gridRow = "span 2";
  } else {
    transportInner2.style.display = "none";
  }

  if (transportMode.value == "College transport") {
    transportInner4.style.display = "flex";
    transportInner3.style.display = "none";
    transportInner4.classList.add("rounded-bottom");
    transportInner1.classList.remove("rounded-bottom")
    transportDiv.style.gridRow = "span 2";

  } else {
    transportInner4.style.display = "none";
  }
});

vehicleType.addEventListener("change", () => {
  if (vehicleType.value == "Motor cycle") {
    transportInner3.style.display = "flex";
    transportInner2.classList.remove("rounded-bottom");
    transportInner3.classList.add("rounded-bottom");
    transportDiv.style.gridRow = "span 3";
} else {
    transportInner3.style.display = "none";
    transportInner2.classList.add("rounded-bottom");
    transportDiv.style.gridRow = "span 2";
  }
});

// Navigation Panel collapse and expand.
navHeader.addEventListener("click", () => {
  navPanel.classList.toggle("collapsed");
});

// Function to get a specific cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

// Refresh token function (to be called on every secure page).
// In every secure page's JS file or a shared auth.js
async function refreshToken() {
  try {
    const res = await fetch('/refresh-token', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    console.log('Token refresh:', data.message);
  } catch (err) {
    console.error('Token refresh error:', err);
  }
}

// Run immediately on page load
refreshToken();

// Then repeat every 14 minutes.
setInterval(refreshToken, 840000);