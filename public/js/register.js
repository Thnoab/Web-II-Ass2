document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");

  msg.textContent = "Creating account...";
  msg.style.color = "#333";

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      msg.textContent = "✅ Account created successfully! Redirecting...";
      msg.style.color = "green";
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      msg.textContent = "⚠️ " + (data.error || "Registration failed.");
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "❌ Error connecting to server.";
    msg.style.color = "red";
  }
});

