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

  static async request(endpoint, data = {}, method = "get", contentType=null) {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ShareApi.token}` };
    if(contentType) headers['Content-Type']= contentType;
    
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

  /** Get a token for when you login */
  static async login(formData) {
    let res = await this.request(`auth/token`, formData, "post")

    return res.token;
  }
  
  /** Register user and get token */
  static async signup(formData) {
    let res = await this.request(`auth/register`, formData, "post")

    return res.token;
  }
  
  /** Get a user by username and return the user */
  static async getUser(username){
    const res = await this.request(`users/${username}`)
    return res.user;
  }
  
  /** Get details on a property by name. */
  static async getProperty(name) {
    let res = await this.request(`properties/${name}`);
    return res.property;
  }
  
  /** Get a list of all properties.
   * Accepts an optional parameter of filter to filter for properties with names
   * that include the filter (case insensitive)
  */

   static async getProperties(filter) {
    if (filter) {
      let res = await this.request(`properties/?name=${filter}`);
      return res.properties;
    }
    let res = await this.request(`properties/`);
    return res.properties;
  }
  
  /** Books a property for a user.
   * Accepts form data
   */
  static async bookProperty(formData) {
    const {propertyName, startDate, endDate, username} = formData;
    const data = {startDate, endDate, propertyName}
    
    await this.request(`${username}/book`, data, "post")
  }
  
  /** Gets bookings for a user by their username */
  static async getBookings(username) {
    let res = await this.request(`${username}/bookings`)
    return res.user.bookings;
  }
  
  /** Adds a property listing for a user */
  static async addProperty(formData) {
    await this.request("properties", formData, "post", "multipart/form-data")
  }
}

export default ShareApi;