import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import RoutesList from "./RoutesList";
import Navigation from "./Nav";
// import userContext from "./userContext";
import ShareApi from "./api";
import jwt_decode from "jwt-decode";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
