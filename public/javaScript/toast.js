// Flash messages from Express (rendered using EJS)
const successMsg = "<%= success && success.length > 0 ? success[0] : '' %>";
const errorMsg = "<%= error && error.length > 0 ? error[0] : '' %>";

const container = document.createElement("div");
container.id = "toast-container";
document.body.appendChild(container);

function showToast(message, type) {
  if (!message) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after 3s
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.4s forwards";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Conditionally show messages
if (successMsg) showToast(successMsg, "success");
if (errorMsg) showToast(errorMsg, "error");
