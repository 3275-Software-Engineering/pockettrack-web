<template>
  <div class="saving-goals-page">
    <h1>Saving Goals</h1>

    <!-- Buttons -->
    <div class="button-section">
      <button @click="openCreateModal" class="button-primary">
        <i class="fa-solid fa-plus"></i> Create
      </button>
      <button @click="openEditModal" :disabled="!selectedGoal" class="button-secondary">
        <i class="fa-solid fa-pen-to-square"></i> Edit
      </button>
      <button @click="deleteGoal" :disabled="!selectedGoal" class="button-danger">
        <i class="fa-solid fa-delete-left"></i> Delete
      </button>
    </div>

    <!-- Goals Table -->
    <table class="goals-table">
      <thead>
        <tr>
          <th>Target Amount</th>
          <th>Purpose</th>
          <th>Month</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(goal, index) in goals" 
          :key="index" 
          @click="selectGoal(goal)"
          :class="{ selected: selectedGoal === goal }"
        >
          <td>{{ goal.targetAmount }}</td> <!-- Changed from 'amount' to 'targetAmount' -->
          <td>{{ goal.purpose }}</td>
          <td>{{ monthNames[goal.month - 1] }}</td> <!-- Display the month name -->
        </tr>
      </tbody>
    </table>

    <!-- Create / Edit Modal -->
    <div v-if="showGoalModal" class="modal">
      <h3>{{ editMode ? 'Edit Goal' : 'Create a Goal' }}</h3>
      <form @submit.prevent="saveGoal">
        <!-- Month Selection -->
        <div class="form-group">
          <label for="month">Month:</label>
          <select v-model="newGoal.month" required>
            <option value="" disabled>Select Month</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- Purpose Selection -->
        <div class="form-group">
          <label for="purpose">Purpose:</label>
          <select v-model="newGoal.purpose" required>
            <option value="Buy Car">Buy Car</option>
            <option value="Buy House">Buy House</option>
            <option value="Travel">Travel</option>
            <option value="Gift">Gift</option>
            <option value="Wedding">Wedding</option>
            <option value="Retirement Savings">Retirement Savings</option>
            <option value="Emergency">Emergency</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Target Amount Input -->
        <div class="form-group">
          <label for="targetAmount">Target Amount:</label> <!-- Updated label -->
          <input type="number" v-model="newGoal.targetAmount" required /> <!-- Changed from 'amount' to 'targetAmount' -->
        </div>

        <!-- Action Buttons -->
        <div class="form-group">
          <button type="submit">{{ editMode ? 'Update Goal' : 'Record Goal' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goals: [], // List of saved goals
      selectedGoal: null, // Currently selected goal
      showGoalModal: false, // Modal visibility
      editMode: false, // Edit mode flag
      newGoal: {
        month: '',
        purpose: '',
        targetAmount: 0 // Changed from 'amount' to 'targetAmount'
        
      },
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Numeric months (1-12)
      monthNames: [ // Array for month names for display
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    };
  },
  mounted() {
    this.fetchGoals(); // Fetch the user's goals when the component is mounted
  },
  methods: {
    // Fetch the saved goals from the backend
    async fetchGoals() {
      const userId = localStorage.getItem("userId"); // Dynamically get user ID
      if (!userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/saving-goals/${userId}`);
        if (response.ok) {
          const data = await response.json();
          this.goals = data; // Populate the goals array with data from the API
        } else {
          console.error("Failed to fetch goals:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    },

    // Opens the modal to create a new goal
    openCreateModal() {
      this.showGoalModal = true;
      this.editMode = false;
      this.resetNewGoal();
    },

    // Opens the modal to edit the selected goal
    openEditModal() {
      if (this.selectedGoal) {
        this.newGoal = { ...this.selectedGoal }; // Copy the selected goal
        this.showGoalModal = true;
        this.editMode = true;
      }
    },

    // Close the modal without saving
    closeModal() {
      this.showGoalModal = false;
    },

    // Resets the new goal form
    resetNewGoal() {
      this.newGoal = { month: '', purpose: '', targetAmount: 0 }; // Reset 'targetAmount'
    },

    // Save or update the goal
    saveGoal() {
      if (this.editMode) {
        this.updateGoal();
      } else {
        this.addGoal();
      }
      this.closeModal();
    },

    // Add a new goal to the goals list
    addGoal() {
      const userId = localStorage.getItem("userId"); // Dynamically get user ID
      if (!userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      if (this.newGoal.month && this.newGoal.purpose && this.newGoal.targetAmount > 0) {
        const newGoal = { ...this.newGoal, userId }; // Include user ID in the goal
        this.goals.push(newGoal); // Add to the list of goals

        // Optionally send the new goal to the backend
        fetch('http://localhost:8080/api/saving-goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGoal)
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to save goal");
            }
          })
          .then(() => this.fetchGoals()) // Refresh the goals list
          .catch((error) => console.error("Error adding goal:", error));
      } else {
        alert("Please fill in all fields correctly.");
      }
    },

    // Update an existing goal
    updateGoal() {
      const userId = localStorage.getItem("userId"); // Dynamically get user ID
      if (!userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      fetch(`http://localhost:8080/api/saving-goals/${this.newGoal.goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.newGoal, userId })
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to update goal");
          }
        })
        .then((updatedGoal) => {
          const index = this.goals.findIndex((goal) => goal.goalId === updatedGoal.goalId);
          if (index !== -1) {
            this.goals.splice(index, 1, updatedGoal);
          }
        })
        .catch((error) => console.error("Error updating goal:", error));
    },

    // Delete the selected goal
    deleteGoal() {
      const userId = localStorage.getItem("userId"); // Dynamically get user ID
      if (!userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      if (this.selectedGoal) {
        fetch(`http://localhost:8080/api/saving-goals/${this.selectedGoal.goalId}`, {
          method: 'DELETE'
        })
          .then((response) => {
            if (response.ok) {
              this.goals = this.goals.filter((goal) => goal !== this.selectedGoal);
              this.selectedGoal = null;
            } else {
              throw new Error("Failed to delete goal");
            }
          })
          .catch((error) => console.error("Error deleting goal:", error));
      }
    },

    // Set the selected goal
    selectGoal(goal) {
      this.selectedGoal = goal;
    }
  }
};
</script>


<style scoped>
.saving-goals-page {
  padding: 20px;
}

.button-section {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.button-section button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.goals-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.goals-table th, .goals-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.goals-table tr.selected {
  background-color: #f0f0f0;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>