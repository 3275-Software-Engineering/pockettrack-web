<template>
  <div class="home-container">
    <h1>Welcome to PocketTrack</h1>
    <div class="button-container">
      <router-link to="/login" class="button">Login</router-link>
      <router-link to="/register" class="button">Register</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent',
};
</script>

<style>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Full viewport height */
  background-color: #f8f9fa; /* Light background color */
  font-family: Arial, sans-serif; /* Font style */
}

h1 {
  margin-bottom: 20px; /* Space below the heading */
  color: #343a40; /* Dark text color */
}

.button-container {
  display: flex;
  gap: 20px; /* Space between buttons */
}

.button {
  padding: 12px 20px; /* Padding inside buttons */
  background-color: #007bff; /* Primary color */
  color: white; /* Text color */
  text-decoration: none; /* Remove underline from link */
  border-radius: 5px; /* Rounded corners */
  transition: background-color 0.3s ease; /* Smooth hover transition */
}

.button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
</style>

