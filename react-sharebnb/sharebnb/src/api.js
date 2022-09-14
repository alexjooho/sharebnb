import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ShareApi {
  // Remember, the backend needs to be authorized with a token
  // We're providing a token you can use to interact with the backend API
  // DON'T MODIFY THIS TOKEN
  // static token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
  //   "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
  //   "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ShareApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get a list of all companies.
   * Accepts an optional parameter of filter to filter for companies with names
   * that include the filter
  */

  static async getCompanies(filter) {
    if (filter) {
      let res = await this.request(`companies/?name=${filter}`);
      return res.companies;
    }
    let res = await this.request(`companies/`);
    return res.companies;
  }

  /** Get a list of jobs. */

  static async getJobs(filter) {
    if (filter) {
      let res = await this.request(`jobs/?title=${filter}`);
      return res.jobs;
    }
    let res = await this.request(`jobs/`);
    return res.jobs;
  }

  /** Get a token for when you login */
  static async login(formData) {
    let res = await this.request(`auth/token`, formData, "post")

    return res.token;
    // before I tried to throw new error, but remember that the backend already throws you an error
    // if incorrect data!
  }

  /** Register user and get token */
  static async signup(formData) {
    let res = await this.request(`auth/register`, formData, "post")

    return res.token;
    
  }

  /** Update a user's profile */
  static async updateProfile(formData) {
    const { username, firstName, lastName, email } = formData;
    const patchData = { firstName, lastName, email }

    let response = await this.request(`users/${username}`, patchData, "patch")
    return response.user;
  }

  static async getUser(username){
    const res = await this.request(`users/${username}`)
    return res.user;
  }

}

export default ShareApi;