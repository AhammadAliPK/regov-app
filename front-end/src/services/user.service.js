import axios from "axios";
import authHeader from "./auth-header";

import { Subject } from "rxjs";

const subject = new Subject();

const API_URL = "http://localhost:8080/api/test/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  uploadFile = async (data) => {
    let result = axios.post("http://localhost:8082/api/auth/upload", data, {
      onUploadProgress: (ProgressEvent) => {
        let position = (ProgressEvent.loaded / ProgressEvent.total) * 100;
        this.uploadStatus(position);
        // this.setState({
        //   loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
        // });
      },
    });
    return result;
  };

  uploadStatus = (pos) => {
    subject.next({ status: pos });
    //return subject.asObservable();
  };
  getuploadStatus = () => subject.asObservable();
}

export default new UserService();
