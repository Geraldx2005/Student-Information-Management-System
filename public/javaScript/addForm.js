// Navigation Panel collapse and expand.
const navPanel = document.getElementById("navPanel");
const navHeader = document.querySelector(".nav-header");
const logoutPopup = document.querySelector(".logout-popup");


// Navigation Panel collapse and expand.
navHeader.addEventListener("click", () => {
  navPanel.classList.toggle("collapsed");
});

// Toggles the logout popup when clicking the logout icon.
function showLogoutpopup(event) {
  event.stopPropagation();
  logoutPopup.classList.toggle("show");
}

// Hides the delete popup when clicking outside of it.
logoutPopup.addEventListener("click", (event) => {
  if (event.target == logoutPopup) {
    logoutPopup.classList.remove("show");
  }
});

// Removes the logout popup when clicking the conformation button.
function removeLogoutPopup() {
  logoutPopup.classList.remove("show");
}

document.getElementById('logout').addEventListener('click', async () => {
  const res = await fetch('/logout', {
    method: 'POST',
    credentials: 'include' // to send cookies with the request
  });

  if (res.ok) {
    window.location.href = '/login';
  } else {
    alert('Logout failed');
  }
});

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