<template>
  <div class="registration-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username:</label>
        <input v-model="username" id="username" placeholder="Username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" id="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input v-model="phone" id="phone" placeholder="Phone" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p> <!-- Changed to point to login page -->
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
      confirmPassword: ''
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
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
          console.log('Registration successful');
          this.$router.push({ name: 'Login' });
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData);
          alert('Registration failed: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  }
};
</script>

<style>
.registration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px; /* Adjust width as needed */
  margin: 0 auto; /* Center the form */
}

.form-group {
  display: flex; /* Use flex to align items horizontally */
  align-items: center; /* Center align the label and input */
  margin-bottom: 15px; /* Add space between fields */
  width: 100%; /* Make the form groups full width */
}

label {
  flex: 0 0 120px; /* Set a fixed width for the labels */
  margin-right: 10px; /* Add space between label and input */
}

input {
  flex: 1; /* Allow input to take remaining space */
  padding: 10px; /* Add padding for comfort */
  border: 1px solid #ccc; /* Add border */
  border-radius: 4px; /* Rounded corners */
}

button {
  padding: 10px;
  background-color: #28a745; /* Green background */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838; /* Darker green on hover */
}
</style>
