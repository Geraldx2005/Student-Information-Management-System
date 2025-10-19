const navPanel = document.getElementById("navPanel");
const navHeader = document.querySelector(".nav-header");
const deleteIcon = document.querySelector(".trash");
const deletePopup = document.querySelector(".delete-popup");
const logoutPopup = document.querySelector(".logout-popup");
const tableBody = document.querySelector(".table-body");
const downloadSelector = document.getElementById('downloadSelector');
const triggerBtn = downloadSelector.querySelector('.download-selector__trigger');

// Toggle dropdown on click
triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadSelector.classList.toggle('download-selector--active');
    
    // Rotate chevron icon
    const icon = triggerBtn.querySelector('.download-selector__trigger-icon');
    if (downloadSelector.classList.contains('download-selector--active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    downloadSelector.classList.remove('download-selector--active');
    const icon = triggerBtn.querySelector('.download-selector__trigger-icon');
    icon.style.transform = 'rotate(0deg)';
});

// Prevent dropdown from closing when clicking inside
downloadSelector.querySelector('.download-selector__menu').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Toggles the navigation panel when clicking the header.
navHeader.addEventListener("click", () => {
  navPanel.classList.toggle("collapsed");
});

// Toggles the delete popup when clicking the delete icon.
function showDeletepopup(event) {
  event.stopPropagation();
  deletePopup.classList.toggle("show");
}

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

// Triggers the edit page when clicking the edit icon.
function showEditPage(event, studentId) {
  event.stopPropagation(); // prevents parent click
  console.log("edit clicked:", studentId);
  
  // Open the edit page in a new tab
  window.location.href = `/form/edit/${studentId}`;
}


// Hides the delete popup when clicking outside of it.
deletePopup.addEventListener("click", (event) => {
  if (event.target == deletePopup) {
    deletePopup.classList.remove("show");
  }
});

// Removes the delete popup when clicking the conformation button.
function removePopup() {
  deletePopup.classList.remove("show");
}

// Saveing the student id in a variable.
let deleteId = null;

// Save the items id in a variable when clicking the delete icon.
function saveDeleteId(id) {
  deleteId = id;
  console.log(deleteId);
}

// sends the delete request to the server, when clicking the delete button in the popup.
function confirmDelete() {
  fetch(`/studentslist/student/${deleteId}`, {
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
        window.__ITEMS__ = window.__ITEMS__.filter(
          (item) => item._id !== deleteId
        );

        // Rebuild the rows (same as you did on page load)
        const updatedRows = window.__ITEMS__.map((s) => {
          return `
        <div class="table-row" id="${s._id}" onclick="window.open('/studentsliat/student/${s._id}', '_blank')">
      <div class="table-cell">${s.rollNumber}</div>
      <div class="table-cell">${s.studentId}</div>
      <div class="table-cell">${s.batch}</div>
      <div class="table-cell">${s.name}</div>
      <div class="table-cell">${s.department}</div>
      <div class="table-cell action-buttons">
        <button class="edit" onclick="showEditPage(event, '${s._id}');">
          <i class="fa-solid fa-pen-to-square"></i>
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

// Define clusterize at a higher scope
let clusterize;

document.addEventListener("DOMContentLoaded", () => {
  clusterize = new Clusterize({
    rows: [],
    scrollId: "scrollArea",
    contentId: "contentArea",
    rows_in_block: 20,         // default is 50
    blocks_in_cluster: 2       // default is 4
  });

  // Assuming your student names are passed as JSON in a script tag or fetched via AJAX
  const students = window.studentList;
  window.__ITEMS__ = students;

  if (!students || students.length === 0) {
    clusterize.update([
      `<div class="noData"> No students here... for now! </div>`,
    ]);
  } else {
    // Wrap the data processing in a small timeout to ensure loading state is visible
    const studentRows = students.map(
      (s) => `
        <div class="table-row" id="${s._id}" onclick="window.open('/studentslist/student/${s._id}', '_blank')">
      <div class="table-cell">${s.rollNumber}</div>
      <div class="table-cell">${s.studentId}</div>
      <div class="table-cell">${s.batch}</div>
      <div class="table-cell">${s.name}</div>
      <div class="table-cell">${s.department}</div>
      <div class="table-cell action-buttons">
        <button class="edit" onclick="showEditPage(event, '${s._id}');">
          <i class="fa-solid fa-pen-to-square"></i>
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

document.getElementById("downloadPDF").addEventListener("click", async (e) => {
  // Close the dropdown after 1 second
  setTimeout(() => {
    const dropdown = document.getElementById("downloadSelector");
    dropdown.classList.remove("download-selector--active");
    const icon = dropdown.querySelector('.download-selector__trigger-icon');
    icon.style.transform = 'rotate(0deg)';
  }, 1000);
  
  const button = document.getElementById("downloadPDF");
  // Prevent multiple clicks
  if (button.dataset.clicked === "true") return;
  button.dataset.clicked = "true";

  // Makes the download button clickable again after 2 seconds
  setTimeout(() => {
    button.dataset.clicked = "false";
    button.classList.remove("no-click");
  }, 2000);

  const originalText = button.innerHTML;
  try {
    // Set loading state with spinner
    button.classList.add("loading");
    button.disabled = true;
    button.innerHTML = `Downloading...`;

    // Force a reflow to ensure loading state is visible
    button.offsetHeight;
    
    if (typeof window.jspdf === "undefined") {
      throw new Error("jsPDF library not loaded");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Image and header layout configuration
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.width;
    const imageWidth = 170; // Width of the image in mm
    const imageHeight = 20; // Height of the image in mm

    try {
      // Center the image by calculating the x position
      const xPosition = (pageWidth - imageWidth) / 2;
      doc.addImage("/assets/list-heading.png", "PNG", xPosition, 8, imageWidth, imageHeight );
    } catch (imgError) {
      console.warn("Failed to add logo:", imgError);
      doc.text(
        "Jayaraj Annapackiam CSI College of Engineering, Nazareth",
        pageWidth / 2,
        marginTop + imageHeight / 2,
        { align: "center" }
      );
    }

    // Rest of the content
    doc.setFontSize(14);
    doc.text("Students List", 15, marginTop + 25);
    doc.setFontSize(12);
    doc.text(
      `${new Date().toLocaleDateString()}`,
      pageWidth - 15,
      marginTop + 25,
      { align: "right" }
    );

    const students = window.__ITEMS__;
    const rows = students.map((s) => [
      s.rollNumber,
      s.studentId,
      s.batch,
      s.name,
      s.department,
    ]);

    // Configure table
    doc.autoTable({
      head: [["Roll No", "Student ID", "Batch", "Name", "Department"]],
      body: rows,
      startY: marginTop + 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: false
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: "auto" },
        4: { cellWidth: 55 },
      },
    });

    const filename = `department_list_${new Date().toISOString().slice(0, 10)}.pdf`;

    // Add small delay to ensure file is generated
    await new Promise((resolve) => setTimeout(resolve, 500));
    doc.save(filename);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Reset button state
    button.classList.remove("loading");
    button.disabled = false;
    button.innerHTML = originalText;
  }
});


// EventListener which triggers the excel sheet generation.
document.getElementById("downloadXLS").addEventListener("click", async () => {
    // Close the dropdown after 1 second
    setTimeout(() => {
      const dropdown = document.getElementById("downloadSelector");
      dropdown.classList.remove("download-selector--active");
      const icon = dropdown.querySelector('.download-selector__trigger-icon');
      icon.style.transform = 'rotate(0deg)';
    }, 1000);
  
  const button = document.getElementById("downloadXLS");
    // Prevent multiple clicks
    if (button.dataset.clicked === "true") return;
    button.dataset.clicked = "true";

    // Makes the download button clickable again after 2 seconds
    setTimeout(() => {
      button.dataset.clicked = "false";
      button.classList.remove("no-click");
    }, 2000);

  const originalText = button.innerHTML;

  try {
    // Set loading state immediately
    button.classList.add("loading");
    button.disabled = true;
    // button.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    button.innerHTML = `Downloading...`;

    // Force a reflow to ensure loading state is visible
    button.offsetHeight;

    const jsonData = window.__ITEMS__;
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Small delay to ensure loading state is visible
    await new Promise((resolve) => setTimeout(resolve, 500));

    await XLSX.writeFile(workbook, "students.xlsx");
  } catch (error) {
    console.error("Excel Generation failed:", error);
    alert("Failed to generate Excel file. Please try again.");
  } finally {
    // Reset button state
    button.classList.remove("loading");
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

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

// Run immediately on page load.
refreshToken();

// Then repeat every 14 minutes.
setInterval(refreshToken, 840000);