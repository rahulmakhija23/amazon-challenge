import axios from "axios";

const instance = axios.create({
  // #14
  baseURL: "http://localhost:5001/challenge-224c5/us-central1/api", //cloud function
  //  #11 we dont  have a base Url right now but will be creating
});
export default instance;
