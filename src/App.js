import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// Components
import UploadForm from "./components/UploadForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <UploadForm />
      </div>
    );
  }
}

export default App;
