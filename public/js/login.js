document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");

  msg.textContent = "Logging in...";

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      msg.textContent = "Login success! Redirecting...";
      setTimeout(() => window.location.href = "/admin.html", 800);
    } else {
      msg.textContent = data.error || "Login failed.";
    }
  } catch (err) {
    msg.textContent = "Error connecting to server.";
  }
});
