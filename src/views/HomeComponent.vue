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

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Full viewport height */
  background: #f0f0f0; 
  font-family: 'Roboto', Arial, sans-serif; /* Modern font */
}

h1 {
  font-size: 36px; /* Larger font size for better visibility */
  font-weight: 600;
  color: black; /* Light text for contrast */
  margin-bottom: 30px; /* Space below the heading */
  text-align: center; /* Center align the heading */
  letter-spacing: 2px; /* Slightly increase letter spacing for readability */
}

.button-container {
  display: flex;
  flex-direction: row;
  gap: 20px; /* Space between buttons */
}

.button {
  padding: 15px 25px; /* Adjust padding for a more balanced button size */
  background-color: #007bff; /* Primary color */
  color: white; /* Text color */
  text-decoration: none; /* Remove underline from link */
  border-radius: 50px; /* Rounded pill-shaped buttons */
  font-size: 16px; /* Slightly larger font size */
  font-weight: bold; /* Bold text for emphasis */
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3); /* Subtle button shadow */
  transition: all 0.3s ease; /* Smooth transition for hover effect */
}

.button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Slight button lift on hover */
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4); /* Enhanced shadow on hover */
}

@media (max-width: 768px) {
  .home-container {
    padding: 20px;
  }
  
  h1 {
    font-size: 28px; /* Adjust title size on smaller screens */
  }

  .button-container {
    flex-direction: column;
    gap: 15px; /* Space between buttons in column layout */
  }
}
</style>
