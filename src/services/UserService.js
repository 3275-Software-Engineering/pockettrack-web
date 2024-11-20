import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; // 替换为你的后端 API 地址

const UserService = {
  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  },
  async register(user) {
    const response = await axios.post(`${API_URL}/register`, user);
    return response.data;
  },
};

export default UserService;
