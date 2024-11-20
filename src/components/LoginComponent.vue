<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Welcome Back</h2>
      <p>Please login to your account</p>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your username" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <button type="submit" class="login-btn">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p class="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/login?username=${encodeURIComponent(
            this.username
          )}&password=${encodeURIComponent(this.password)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem("userId", userData.userId); // Save user ID to local storage
          alert("Login successful!");
          this.errorMessage = "";
          this.$router.push({ name: "Dashboard" }); // Redirect to Dashboard page
        } else {
          const message = await response.text();
          this.errorMessage = message;
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = "Login failed. Please try again later.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f0f0; /* 背景设置为浅灰色 */
  font-family: Arial, sans-serif;
}

.login-box {
  background: white;
  border-radius: 12px;
  padding: 30px 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

p {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.register-link {
  margin-top: 15px;
  font-size: 14px;
  color: #333;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
