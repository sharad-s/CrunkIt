import React, { Component } from "react";
import { node, getOrbitDB } from "../../util/ipfs";

// Components
import LogFeed from "./LogFeed";

export default class OrbitLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			dbName: "testdb",
			feed: {},
			db: null
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmitMessage = this.onSubmitMessage.bind(this);
		this.onSubmitDatabase = this.onSubmitDatabase.bind(this);
	}

	async componentDidMount() {
		await this._instantiateOrbitLog();
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ [e.target.name]: e.target.value });
	}

	async onSubmitMessage(e) {
		e.preventDefault();
		e.stopPropagation();
		const { db, message } = this.state;
		const hash = await db.add(message);
		const feed = db.iterator({ limit: -1 }).collect();
		this.setState({ feed });
	}

	async onSubmitDatabase(e) {
		e.preventDefault();
		e.stopPropagation();
		const { dbName } = this.state;
		await this._resetDB(dbName);
	}

	async _instantiateOrbitLog() {
		node.on("ready", async () => {
			const dbName = "testdb";
			await this._resetDB(dbName);
		});
	}

	async _resetDB(dbName) {
		// Get orbitdb
		const orbitdb = getOrbitDB(node);

		// Create / Open a database
		const db = await orbitdb.log(dbName);
		await db.load();

		// Listen for updates from peers
		db.events.on("replicated", address => {
			console.log(db.iterator({ limit: -1 }).collect());
		});

		// // Query
		const feed = db.iterator({ limit: -1 }).collect();
		this.setState({ feed, db, dbName });
	}

	render() {
		return (
			<div>
				<h1>Orbit Log</h1>

				{/* Message Form */}
				<form onSubmit={this.onSubmitMessage}>
					<div className="input-group mb-3">
						<div className="input-group mb-3">
							<p>
								Submit Message:
								<input
									type="text"
									name="message"
									onChange={this.onChange}
								/>
							</p>
						</div>
						<div className="input-group mb-3">
							<input
								type="submit"
								className="btn btn-dark"
								value="Submit"
							/>
						</div>
					</div>
				</form>

				{/* Database Form */}
				<form onSubmit={this.onSubmitDatabase}>
					<div className="input-group mb-3">
						<div className="input-group mb-3">
							<p>
								Enter Database:
								<input
									type="text"
									name="dbName"
									onChange={this.onChange}
								/>
							</p>
						</div>
						<div className="input-group mb-3">
							<input
								type="submit"
								className="btn btn-dark"
								value="Submit"
							/>
						</div>
					</div>
				</form>

				<hr />
				<LogFeed feed={this.state.feed} />
			</div>
		);
	}
}
