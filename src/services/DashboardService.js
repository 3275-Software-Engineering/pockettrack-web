import http from "./http-common.js"

class DashboardService{
    get(userID){
        return http.get(`/dashboard/${userID}`);
     }
}

export default new DashboardService();