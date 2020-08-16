import axios from "axios";

const API_URL = "http://localhost:8082/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        debugger;
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password, imagePath) {
    debugger;
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      imagePath,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
