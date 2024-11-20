<template>
  <div class="registration-container">
    <div class="registration-card">
      <h1 class="title">Create an Account</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="username" id="username" type="text" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" id="email" type="email" placeholder="Enter your email" required />
        </div>
       <div class="form-group">
          <label for="phone">Phone</label>
          <input v-model="phone" id="phone" type="tel" placeholder="Enter your phone number" required />
       </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="password" id="password" type="password" placeholder="Create a password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" placeholder="Confirm your password" required />
        </div>
        <button type="submit" class="btn-submit">Register</button>
      </form>
      <p class="link-text">
        Already have an account? <router-link to="/login" class="link">Login here</router-link>
      </p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      // Clear previous messages
      this.successMessage = '';
      this.errorMessage = '';

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            phone: this.phone,
            password: this.password
          })
        });

        if (response.ok) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.$router.push({ name: 'Login' });
          }, 2000); // Redirect after 2 seconds
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Registration failed. Please try again.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred during registration. Please try again later.';
        console.error('Error during registration:', error);
      }
    }
  }
};

</script>

<style>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.registration-card {
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  text-align: center; /* 字体居中 */
  color: #555;
}

input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.btn-submit {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.link-text {
  text-align: center;
  margin-top: 15px;
  color: #666;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.success-message {
  color: #28a745;
  text-align: center;
  margin-top: 15px;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
}
</style>

