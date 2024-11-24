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
    <table class="goals-table" ref="goalsTable">
      <thead>
      <tr>
        <th>Target Amount</th>
        <th>Purpose</th>
        <th>DeadlineDate</th>
        <th>DeadlinePeriod</th>
        <th>CurrentAmount</th>
        <th>Month</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="goal in goals"
          :key="goal.goalId"
          @click.prevent="selectGoal(goal)"
          :class="{ selected: selectedGoal === goal }"
      >
        <td>{{ goal.targetAmount }}</td> <!-- Changed from 'amount' to 'targetAmount' -->
        <td>{{ goal.purpose }}</td>
        <td>{{ goal.deadlineDate }}</td>
        <td>{{ goal.deadlinePeriod }}</td>
        <td>{{ goal.currentAmount }}</td>
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
          <label for="month">Month</label>
          <select v-model="newGoal.month" required>
            <option value="" disabled>Select Month</option>
            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- Purpose Selection -->
        <div class="form-group">
          <label for="purpose">Purpose</label>
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
        <el-from label-width="150px" label-position="left">
          <!-- Deadline Date Picker -->
          <el-form-item label="Deadline Date">
            <el-date-picker clearable v-model="newGoal.deadlineDate"
                            type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                            placeholder="Select Deadline Date">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="Deadline Period">
            <el-input v-model="newGoal.deadlinePeriod" placeholder="Enter Deadline Period"/>
          </el-form-item>
          <el-form-item label="Current Amount">
            <el-input v-model="newGoal.currentAmount" placeholder="Enter Current Amount"/>
          </el-form-item>
        </el-from>
        <!-- Target Amount Input -->
        <div class="form-group">
          <label for="targetAmount">Target Amount</label> <!-- Updated label -->
          <input type="number" v-model="newGoal.targetAmount" required/>
          <!-- Changed from 'amount' to 'targetAmount' -->
        </div>

        <!-- Action Buttons -->
        <div class="form-group">
          <button type="submit">{{ editMode ? 'Update Goal' : 'Record Goal' }}</button>
          <button type="button" @click="closeModal" style="margin-top: 8px">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import SavingGoalsService from "../services/SavingGoalsService";

export default {
  data() {
    return {
      goals: [], // List of saved goals
      selectedGoal: null, // Currently selected goal
      showGoalModal: false, // Modal visibility
      editMode: false, // Edit mode flag
      userId: 0,
      newGoal: {
        month: '',
        purpose: '',
        deadlinePeriod: '',
        currentAmount: 0,
        deadlineDate: null, // Added deadline date
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
    fetchGoals() {
      this.userId = localStorage.getItem("userId"); // Dynamically get user ID
      if (!this.userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      SavingGoalsService.getGoals(encodeURIComponent(this.userId))
          .then(response => {
            if (response && response.data) {
              this.goals = response.data;
              console.log(this.goalsData);
            } else {
              console.log("Response data is null");
            }
          })
          .catch(error => {
            console.log(error);
          })
    },

    // Opens the modal to create a new goal
    openCreateModal() {
      event.preventDefault();
      this.showGoalModal = true;
      this.editMode = false;
      this.resetNewGoal();
    },

    // Opens the modal to edit the selected goal
    openEditModal() {
      event.preventDefault();
      if (this.selectedGoal) {
        this.newGoal = {...this.selectedGoal}; // Copy the selected goal
        console.log(this.newGoal);
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
      this.newGoal = {
        month: '',
        purpose: '',
        deadlineDate: null,
        deadlinePeriod: '',
        currentAmount: 0,
        targetAmount: 0,
      }; // Reset 'targetAmount'
    },

    // Save or update the goal
    saveGoal() {
      event.preventDefault();
      if (!this.newGoal.month || !this.newGoal.purpose || !this.newGoal.deadlineDate || this.newGoal.targetAmount <= 0) {
        alert("Please fill in all fields correctly!");
        return;
      }
      console.log("Deadline Date: ", this.newGoal.deadlineDate);

      if (this.editMode) {
        this.updateGoal();
        alert("Goal updated successfully!");
      } else {
        this.addGoal();
        alert("Goal added successfully!");
      }
      this.selectedGoal = null;
      this.fetchGoals();
      this.closeModal();
    },

    // Add a new goal to the goals list
    addGoal() {
      event.preventDefault();
      if (this.userId < 1) {
        console.error("No user ID found in localStorage");
        return;
      }

      const newGoal = {...this.newGoal, user: {userId: this.userId}}; // Include user ID in the goal
      SavingGoalsService.addGoals(newGoal)
          .then(response => {
            if (response && response.data) {
              this.goals = response.data;
              console.log(this.goals);
            } else {
              console.log("Response data is null");
            }
          })
          .catch(error => {
            console.log(error);
          })

    },


    // Update an existing goal
    updateGoal() {
      event.preventDefault();
      if (this.userId < 1) {
        console.error("No user ID found in localStorage");
        return;
      }

      const goalId = this.selectedGoal ? this.selectedGoal.goalId : null;
      console.log(this.newGoal.deadlinePeriod);
      if (goalId) {
        SavingGoalsService.editGoals(this.userId, goalId, this.newGoal)
            .then(response => {
              if (response && response.data) {
                this.goals = response.data; // 更新目标列表
                console.log(this.goals);
              } else {
                console.log("Response data is null");
              }
            })
            .catch(error => {
              console.log(error);
            });
      }
    },

    // Delete the selected goal
    deleteGoal() {
      event.preventDefault();
      if (!this.userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      if (this.selectedGoal) {
        if (confirm("Are you sure you want to delete this goal?")) {
          SavingGoalsService.delOneGoal(this.userId, this.selectedGoal.goalId)
              .then(response => {
                if (response && response.data) {
                  this.goalsData = response.data;
                  console.log(this.goalsData);
                } else {
                  console.log("Response data is null");
                }
              })
              .catch(error => {
                console.log(error);
              });
          this.goals = this.goals.filter(goal => goal !== this.selectedGoal);
          this.selectedGoal = null;
          alert("Goal deleted successfully!");
          this.fetchGoals();
        }
      }
    },

    // Set the selected goal
    selectGoal(goal) {
      event.preventDefault();
      this.selectedGoal = goal;
    }
  },
  watch: {
    // goals() {
    //   // 当 goals 发生变化时执行的代码
    //   this.fetchGoals();
    // }
  }
}
</script>


<style>

.el-input--small .el-input__wrapper {
  padding: 0px !important;
}

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
  z-index: 1000; /* 确保弹窗位于最前面 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
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

.goals-table tr.selected {
  background-color: #1890ff; /* 或者你想要的其他颜色 */
  color: white; /* 如果你需要改变文字颜色，可以加上这行 */
}

</style>