async function test() {
  try {
    const res = await fetch('https://foodshare-backend-wth8.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "testuser12399@test.com",
        password: "password123"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
test();
