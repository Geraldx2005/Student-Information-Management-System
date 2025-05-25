const navPanel = document.getElementById("navPanel");
const navHeader = document.querySelector(".nav-header");
// const deleteIcon = document.querySelector(".trash");
// const recycleIcon = document.querySelector(".recycleBtn");
const deletePopup = document.querySelector(".delete-popup");
const recyclePopup = document.querySelector(".recycle-popup");
const tableBody = document.querySelector(".table-body");

// Toggles the navigation panel when clicking the header.
navHeader.addEventListener("click", () => {
  navPanel.classList.toggle("collapsed");
});

// Toggles the delete popup when clicking the delete icon.
function showDeletepopup(event) {
  event.stopPropagation();
  deletePopup.classList.toggle("show");
}

// Toggles the recycle popup when clicking the recycle icon.
function showRecyclepopup(event) {
  event.stopPropagation();
  recyclePopup.classList.toggle("show");
}

// Hides the delete popup when clicking outside of it.
deletePopup.addEventListener("click", (event) => {
  if (event.target == deletePopup) {
    deletePopup.classList.remove("show");
  }
});

// Hides the recycle bin popup when clicking outside of it.
recyclePopup.addEventListener("click", (event) => {
  if (event.target == recyclePopup) {
    recyclePopup.classList.remove("show");
  }
});

// Removes the delete popup when clicking the conformation button.
function removePopup() {
  deletePopup.classList.remove("show");
}

// Removes the recycle bin popup when clicking the conformation button.
function removeRecyclePopup() {
  recyclePopup.classList.remove("show");
}

// Saving the student id in a variable for deleting.
let deleteId = null;

// Saveing the student id in a variable for restoring.
let recycleId = null;

// Save the items id in a variable when clicking the delete icon.
function saveDeleteId(id) {
  deleteId = id;
  console.log(deleteId);
}

// Save the items id in a variable when clicking the recycle icon.
function saveRecycleId(id) {
  recycleId = id;
  console.log(recycleId);
}

function confirmRecycle() {
  fetch(`/recycle/student/${recycleId}`, { method: "POST" })
    .then((response) => {
      if (response.ok) {
        console.log("Successfully recycled");
        let recycleElement = document.getElementById(recycleId);

        if (recycleElement) {
          recycleElement.remove();
        } else {
          console.error(`Element with ID ${recycleId} not found.`);
        }

        // Remove the item from the global items array
        window.__ITEMS__ = window.__ITEMS__.filter((item) => item._id !== recycleId);

        // Rebuild the rows (same as you did on page load)
        const updatedRows = window.__ITEMS__.map((s) => {
          return `
        <div class="table-row" id="${s._id}" onclick="window.open('/recycle/student/${s._id}', '_blank')">
      <div class="table-cell">${s.roll_number}</div>
      <div class="table-cell">${s.student_id}</div>
      <div class="table-cell">${s.batch}</div>
      <div class="table-cell">${s.student_name}</div>
      <div class="table-cell">${s.department}</div>
      <div class="table-cell action-buttons">
        <button style="padding-top: 4px;"  onclick="showRecyclepopup(event); saveRecycleId('${s._id}');">
        <i class="fa-solid fa-recycle fa-lg"></i>
        </button>
        <button class="trash" onclick="showDeletepopup(event); saveDeleteId('${s._id}');">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
          `;
        });

        // Update Clusterize
        clusterize.update(updatedRows);
      } else {
        console.error("Failed to recycle student");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// sends the delete request to the server, when clicking the delete button in the popup.
function confirmDelete() {
  fetch(`/recycle/student/${deleteId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Successfully deleted");
        let deleteElement = document.getElementById(deleteId);

        if (deleteElement) {
          deleteElement.remove();
        } else {
          console.error(`Element with ID ${deleteId} not found.`);
        }

        // Remove the item from the global items array
        window.__ITEMS__ = window.__ITEMS__.filter((item) => item._id !== deleteId);

        // Rebuild the rows (same as you did on page load)
        const updatedRows = window.__ITEMS__.map((s) => {
          return `
        <div class="table-row" id="${s._id}" onclick="window.open('/recycle/student/${s._id}', '_blank')">
      <div class="table-cell">${s.roll_number}</div>
      <div class="table-cell">${s.student_id}</div>
      <div class="table-cell">${s.batch}</div>
      <div class="table-cell">${s.student_name}</div>
      <div class="table-cell">${s.department}</div>
      <div class="table-cell action-buttons">
        <button style="padding-top: 4px;"  onclick="showRecyclepopup(event); saveRecycleId('${s._id}');">
        <i class="fa-solid fa-rotate-right"></i>
        </button>
        <button class="trash" onclick="showDeletepopup(event); saveDeleteId('${s._id}');">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>
    </div>
          `;
        });

        // Update Clusterize
        clusterize.update(updatedRows);
      } else {
        console.error("Failed to delete student");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// In the delete popup, when clicking the cancel button, it will set the deleteId to null.
function cancelDelete() {
  deleteId = null;
}

// In the recycle popup, when clicking the cancel button, it will set the recycleId to null.
function cancelRecycle() {
  recycleId = null;
}

// Define clusterize at a higher scope
let clusterize;

document.addEventListener("DOMContentLoaded", () => {
  clusterize = new Clusterize({
    rows: [],
    scrollId: "scrollArea",
    contentId: "contentArea",
    rows_in_block: 20, // default is 50
    blocks_in_cluster: 2, // default is 4
  });

  // Assuming your student names are passed as JSON in a script tag or fetched via AJAX
  const students = window.studentList;
  window.__ITEMS__ = students;

  if (!students || students.length === 0) {
    clusterize.update([`<div class="noData"> No students here... for now! </div>`]);
  } else {
    // Wrap the data processing in a small timeout to ensure loading state is visible
    const studentRows = students.map(
      (s) => `
        <div class="table-row" id="${s._id}" onclick="window.open('/recycle/student/${s._id}', '_blank')">
      <div class="table-cell">${s.roll_number}</div>
      <div class="table-cell">${s.student_id}</div>
      <div class="table-cell">${s.batch}</div>
      <div class="table-cell">${s.student_name}</div>
      <div class="table-cell">${s.department}</div>
      <div class="table-cell action-buttons">
        <button style="padding-top: 4px;" class="recycleBtn" onclick="showRecyclepopup(event); saveRecycleId('${s._id}');">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
        <button class="trash" onclick="showDeletepopup(event); saveDeleteId('${s._id}');">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
    `
    );

    clusterize.update(studentRows);
  }
});

// Logout route.
document.getElementById("logout").addEventListener("click", async () => {
  const res = await fetch("/logout", {
    method: "POST",
    credentials: "include", // to send cookies with the request
  });

  if (res.ok) {
    // Optional: redirect to login page
    window.location.href = "/login";
  } else {
    alert("Logout failed");
  }
});

// Refresh token function (to be called on every secure page).
// In every secure page's JS file or a shared auth.js
async function refreshToken() {
  console.log("The function is called");
  try {
    const res = await fetch("/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    console.log("Token refresh:", data.message);
  } catch (err) {
    console.error("Token refresh error:", err);
  }
}

// Run immediately on page load.
refreshToken();

// Then repeat every 14 minutes.
setInterval(refreshToken, 840000);
