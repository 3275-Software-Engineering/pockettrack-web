<template>
    <div class="transaction-page">
      <h1>Transactions</h1>
  
      <!-- Filter Section -->
      <div class="filter-section">
  
  
        <label for="filterType">Filter by Type:</label>
        <select id="filterType" v-model="filterType">
          <option value="">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        
        <label for="filterCategory">Filter by Category:</label>
        <select id="filterCategory" v-model="filterCategory">
          <option value="">All</option>
          <!-- Add more categories as needed -->
          <option value="Shopping">Shopping</option>
          <option value="Groceries">Groceries</option>
          <option value="Dining">Dining</option>
          <option value="Transportation">Transportation</option>
          <option value="Utility">Utility</option>
          <option value="MobilePayment">MobilePayment</option>
          <option value="Travel">Travel</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Study">Study</option>
          <option value="Sport">Sport</option>
          <option value="Other">Other</option>
          <option value="Salary">Salary</option>
          <option value="Gift">Gift</option>
          <option value="Investment">Investment</option>
        </select>
  
        
  
        <label for="filterPaymentMethod">Filter by Payment Method:</label>
        <select id="filterPaymentMethod" v-model="filterPaymentMethod">
          <option value="">All</option>
          <option value="Cash">Cash</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Credit Card">Credit Card</option>
          <option value="E-transfer">E-transfer</option>
        </select>
      </div>
  
  
      <!-- Buttons with Icons -->
      <div class="button-section">
        <button @click="openRecordModal" class="button-primary">
          <i class="fa-solid fa-plus"></i> Create
        </button>
        <button @click="openEditModal" :disabled="!selectedRecord" class="button-secondary">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button @click="deleteRecord" :disabled="!selectedRecord" class="button-danger">
          <i class="fa-solid fa-delete-left"></i> Delete
        </button>
      </div>
  
      <!-- Records Table -->
      <table class="records-table">
        <thead>
          <tr>
            <th @click="sortTable('transactionAmount')">Amount
                <span v-if="sortColumn === 'transactionAmount'">
                    <span v-if="sortDirection === 'asc'">⬆️</span>
                    <span v-else>⬇️</span>
                </span>
            </th>
            <th @click="sortTable('transactionType')">Type</th>
            <th @click="sortTable('currency')">Currency</th>
            <th @click="sortTable('transactionCategoryName')">Category</th>
            <th @click="sortTable('paymentMethodName')">Payment Method</th>
            <th @click="sortTable('transactionDate')">Date
                <span v-if="sortColumn === 'transactionDate'">
                    <span v-if="sortDirection === 'asc'">⬆️</span>
                    <span v-else>⬇️</span>
                </span>
            </th>
            <th @click="sortTable('note')">Note</th>
          </tr>
          
        </thead>
        
        <tbody>
           <!-- Apply filters using computed property 'filteredRecords' -->
           <tr 
            v-for="(record, index) in filteredRecords" 
            :key="index" 
            @click="selectRecord(record)"
            :class="{ selected: selectedRecord === record }"
          >
            <td>{{ record.transactionAmount }}</td>
            <td>{{ record.transactionType }}</td>
            <td>{{ record.currency }}</td>
            <td>{{ record.transactionCategoryName }}</td>
            <td>{{ record.paymentMethodName}}</td>
            <td >{{ record.transactionDate }}</td>
            <td>{{ record.note }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Record Modal -->
      <div v-if="showRecordModal" class="modal">
        <h3>{{ editMode ? 'Edit Transaction' : 'Create a Transaction' }}</h3>
        <form @submit.prevent="recordTransaction">
          <!-- Date Input -->
          <div class="form-group form-inline">
            <label for="date">Date:</label>
            <input type="date" value-format="yyyy-MM-dd" v-model="newRecord.transactionDate" required />
          </div>
  
          <!-- Type Input -->
          <div class="form-group form-inline">
            <label for="type">Type:</label>
            <select v-model="newRecord.transactionType" required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
  
          <!-- Amount Input -->
          <div class="form-group form-inline">
            <label for="amount">Amount:</label>
            <input type="number" v-model="newRecord.transactionAmount" step="0.01" required />
          </div>
  
          <!-- Currency Input -->
          <div class="form-group form-inline">
            <label for="currency">Currency:</label>
            <select v-model="newRecord.currency" required>
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
          <!--Category Input-->
          <div class="form-group form-inline" v-if="newRecord.transactionType === 'expense'">
            <label for="category">Expense Category:</label>
            <select v-model="newRecord.transactionCategoryName" required>
              <option>Shopping</option>
              <option>Groceries</option>
              <option>Dining</option>
              <option>Transportion</option>
              <option>Utility</option>
              <option>MobilePayment</option>
              <option>Travel</option>
              <option>Healthcare</option>
              <option>Study</option>
              <option>Sport</option>
              <option>Other</option>
            </select>
          </div>
  
          <div class="form-group form-inline" v-if="newRecord.transactionType === 'income'">
            <label for="category">Income Category:</label>
            <select v-model="newRecord.transactionCategoryName" required>
              <option>Salary</option>
              <option>Gift</option>
              <option>Investment</option>
              <option>Other</option>
            </select>
          </div>
  
          <!-- Payment Method Input -->
          <div class="form-group form-inline">
            <label for="payment">Payment Method:</label>
            <select v-model="newRecord.paymentMethodName" required>
              <option>Cash</option>
              <option>Debit Card</option>
              <option>Credit Card</option>
              <option>E-transfer</option>
            </select>
          </div>
  
          <!-- Note Input -->
          <div class="form-group form-inline">
            <label for="note">Note:</label>
            <input type="text" v-model="newRecord.note" />
          </div>
  
          <!-- Submit Button -->
          <div class="form-group">
            <button type="submit">{{ editMode ? 'Save Changes' : 'Record' }}</button>
          </div>
          <div class="form-group">
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';  // Import Axios
  
  export default {
    data() {
      return {
        records: [], // Array to hold all transaction records
        filterCategory: '',
        filterType: '',
        //sortColumn: 'transactionDate', // Default sorting column
        //sortDirection: 'asc', // Default sorting direction
        filterPaymentMethod: '',
        selectedRecord: null,
        showRecordModal: false,
        editMode: false,
        newRecord: {
        transactionDate: '',
        transactionType: 'expense',
        transactionAmount: 0,
        currency: 'CAD',  // Default Currency is CAD
        transactionCategoryName: '',
        paymentMethodName: 'Cash',
        note: '',
        user: {
          userId: localStorage.getItem('userId') || '1' // Example way to get or default a user ID
        }
        },
        sortColumn: 'transactionDate',  // Default sorting column
        sortDirection: 'desc',  // Default sorting direction
      };
    },
    computed: {
      filteredRecords() {
        let sortedRecords = [...this.records];

    // Sort by selected column and direction
    if (this.sortColumn === 'transactionDate') {
      sortedRecords.sort((a, b) => {
        let dateA = new Date(a.transactionDate);
        let dateB = new Date(b.transactionDate);
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (this.sortColumn === 'transactionAmount') {
      sortedRecords.sort((a, b) => {
        let amountA = parseFloat(a.transactionAmount);
        let amountB = parseFloat(b.transactionAmount);
        return this.sortDirection === 'desc' ? amountB - amountA : amountA - amountB;
      });
    }
      return sortedRecords.filter(record => {
        // Normalize case for consistent filtering
        const filterCategory = this.filterCategory.toLowerCase();
        const filterType = this.filterType.toLowerCase();
        const filterPaymentMethod = this.filterPaymentMethod.toLowerCase();
  
        const recordCategory = record.transactionCategoryName ? record.transactionCategoryName.toLowerCase() : '';
        const recordType = record.transactionType ? record.transactionType.toLowerCase() : '';
        const recordPaymentMethod = record.paymentMethodName ? record.paymentMethodName.toLowerCase() : '';
  
        // Apply filters
        const matchesCategory = !this.filterCategory || recordCategory === filterCategory;
        const matchesType = !this.filterType || recordType === filterType;
        const matchesPaymentMethod = !this.filterPaymentMethod || recordPaymentMethod === filterPaymentMethod;
  
        return matchesCategory && matchesType && matchesPaymentMethod;
      });
      
    }
    },
    mounted() {
      this.fetchRecords();
    },
    methods: {
      // Fetch records from the API when the component is mounted
      fetchRecords() {
        axios.get(`http://localhost:8080/api/transactions/${localStorage.getItem("userId")}`) //will use localStorage.getItem('userId'); 
          .then(response => {
            this.records = response.data; // Store the fetched records in 'records'
            console.log(this.records);
          })
          .catch(error => {
            console.error('There was an error fetching the records:', error);
          }); 
      },
      sortTable(column) {
      if (this.sortColumn === column) {
        // Toggle sorting direction
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Set new sorting column and default sorting direction
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      },
      openRecordModal() {
        this.showRecordModal = true;
        this.resetNewRecord();
        this.editMode = false;
      },
      closeModal() {
        this.showRecordModal = false;
      },
      recordTransaction() {
        if (this.editMode) {
          Object.assign(this.selectedRecord, this.newRecord);
          this.updateTransaction();
        } else {
          //this.records.push({ ...this.newRecord });
          //add new transaction
          this.addTransaction();
        }
        this.closeModal();
      },
      resetNewRecord() {
        this.newRecord = {
          transactionDate: '',
          transactionType: 'expense',
          transactionAmount: 0,
          currency: 'CAD',  // Reset currency to CAD
          transactionCategoryName: '',
          paymentMethodName: 'Cash',
          note: '',
          user: {
          userId: localStorage.getItem('userId') || '1' // Example way to get or default a user ID
          }
        };
      },
      selectRecord(record) {
        this.selectedRecord = record;
      },
      openEditModal() {
        if (this.selectedRecord) {
          this.newRecord = { ...this.selectedRecord };
          this.showRecordModal = true;
          this.editMode = true;
        }
      },
      deleteRecord() {
        if (this.selectedRecord) {
          this.records = this.records.filter(record => record !== this.selectedRecord);
          //this.selectedRecord;
          this.deleteTransaction();
        }
      },
      addTransaction() {
        console.log('Data being sent:', this.newRecord); 
        // Create a new transaction by sending a POST request to the server
        axios.post('http://localhost:8080/api/transactions', {
          ...this.newRecord
          //userId: localStorage.getItem("userId")  // Assuming userId is needed
        })
        .then(response => {
          // Add the new transaction to the local `records` array if the POST was successful
          this.records.push(response.data);
          console.log('Transaction added successfully', response.data);  // 检查返回的记录是否包含 transactionCategoryName
         
          this.fetchRecords();
        })
        .catch(error => {
          console.error('There was an error adding the transaction:', error);
        });
      },
  
      // update a transaction
      updateTransaction() {
    console.log('Data being updated:', this.newRecord);
    axios.put(`http://localhost:8080/api/transactions/${this.selectedRecord.transactionId}`, {
      ...this.newRecord
    })
    .then(response => {
      console.log('Transaction updated successfully', response.data);
      
      // 更新本地 records 数组
      const index = this.records.findIndex(record => record.id === this.selectedRecord.id);
      if (index !== -1) {
        this.records.splice(index, 1, response.data);
      }
  
      this.fetchRecords();
      this.closeModal();
    })
    .catch(error => {
      console.error('There was an error updating the transaction:', error);
    });
  },
  // delete a transaction
  deleteTransaction() {
    if (!this.selectedRecord || !this.selectedRecord.transactionId) {
      console.error('No record selected or missing transactionId.');
      return;
    }
  
    // 确认删除操作，避免误操作
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
  
    axios.delete(`http://localhost:8080/api/transactions/${this.selectedRecord.transactionId}`)
      .then(response => {
        console.log('Transaction deleted successfully', response.data);
  
        // 从本地 records 数组中移除已删除的记录
        this.records = this.records.filter(record => record.transactionId !== this.selectedRecord.transactionId);
  
        // 清除选中的记录
        this.selectedRecord = null;
      })
      .catch(error => {
        console.error('There was an error deleting the transaction:', error);
      });
  }
  
  
      
    }
  };
  </script>
  
  <style scoped>
  .transaction-page {
    padding: 20px;
  }
  
  .filter-section {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
  }
  
  .filter-section label {
    margin-right: 5px;
  }
  
  .button-section {
    margin-bottom: 20px;
    display: flex;
    justify-content: center; 
    gap: 10px; 
  }
  
  .button-section button {
    padding: 8px 12px;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .button-section i {
    margin-right: 5px;
  }
  
  .records-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .records-table th, .records-table td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .records-table tr.selected {
    background-color: #f0f0f0;
  }
  
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
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
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .form-inline {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .form-inline label {
    width: 150px; /* 可以根据需要调整 */
    margin-right: 10px;
  }
  
  .button-primary, .button-secondary, .button-danger {
    width: 100px; 
    height: 50px; 
    border-radius: 50%; 
    font-size: 22px; 
    text-align: center;
    display: flex; 
    align-items: center;
    justify-content: center; 
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .button-primary {
    background-color: #007bff;
    color: white;
  }
  
  .button-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .button-danger {
    background-color: #dc3545;
    color: white;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>