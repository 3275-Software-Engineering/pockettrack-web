import http from "./http-common.js"

class SavingGoalsService{

    getGoals(userID) {
        return http.get(`/saving-goals/${userID}`);
    }

    // Add goals
    addGoals(goalData) {
        return http.post(`/saving-goals`,goalData);
    }

    // Edit goals
    editGoals(userId, goalId, goalData) {
        return http.put(`/saving-goals/${userId}/${goalId}`, goalData);
    }

    // Delete one goal
    delOneGoal(userId,goalId) {
        return http.delete(`/saving-goals/${userId}/${goalId}`);
    }

    // Delete all goal
    delAllGoal(userId) {
        return http.delete(`/${userId}/saving-goals`);
    }

    // Get Saving Report
    getReport(userId){
        return http.get(`/saving-goals/report/${userId}`);
    }
}

export default new SavingGoalsService();