let loginType = document.querySelector(".loginType");
let loginHeading = document.querySelector(".loginHeading span");
let loginTypeSpan = document.querySelector(".loginType span");
let loginForm = document.getElementById('loginForm');


let indicate = 0;

loginType.addEventListener("click", () => {
    if (indicate == 0){
        loginHeading.innerHTML = "Admin";
        loginTypeSpan.innerHTML = "Student";
        indicate++;
    } else {
        loginHeading.innerHTML = "Student";
        loginTypeSpan.innerHTML = "Admin";
        indicate--;
    }
})


loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();  // Prevent the form from reloading the page
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Call the login function (send the data)
  await loginUser(username, password);
});


async function loginUser(username, password) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Include cookied in the request
    });
  
    
    if (response.ok) {
      window.location.href = "/studentslist";
    } else {
      alert('Login failed');
    }
  }