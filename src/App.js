import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// Components
import UploadForm from "./components/UploadForm";
import OrbitLog from "./components/Log/OrbitLog";

class App extends Component {
	render() {
		return (
			<div className="App">
				<OrbitLog />
			</div>
		);
	}
}

export default App;
