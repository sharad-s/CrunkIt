import React, { Component } from "react";
import { node, getOrbitDB } from "../../util/ipfs";
import isEmpty from "../../util/isEmpty";

// Components
import LogFeed from "./LogFeed";

export default class OrbitLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "", // form field
			dbName: "", // form field
			dbAddress: "", // form field
			currentDBName: "",
			currentDBAddress: "",
			feed: {},
			db: null
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmitMessage = this.onSubmitMessage.bind(this);
		this.onSubmitDatabase = this.onSubmitDatabase.bind(this);
		this.onSubmitDatabaseAddress = this.onSubmitDatabaseAddress.bind(this);
	}

	async componentDidMount() {
		await this._instantiateOrbitLog();
	}

	async _instantiateOrbitLog() {
		node.on("ready", async () => {
			const dbName = "testdb";
			await this._resetDBWithName(dbName);
		});
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ [e.target.name]: e.target.value });
	}

	// Form Submit - Submit a message to the current DB
	async onSubmitMessage(e) {
		e.preventDefault();
		const { db, message } = this.state;
		if (isEmpty(message)) return;

		// Add Message to DB
		const hash = await db.add(message);

		// Update Feed
		const feed = db.iterator({ limit: -1 }).collect();
		this.setState({ feed, message: "" });
	}

	// Form Submit - Create or "open" a new DB given an input name
	async onSubmitDatabase(e) {
		e.preventDefault();
		const { dbName } = this.state;
		if (isEmpty(dbName)) return;
		await this._resetDBWithName(dbName);
	}

	// Form Submit - Open an existing DB given the input OrbitDB address
	async onSubmitDatabaseAddress(e) {
		e.preventDefault();
		const { dbAddress } = this.state;
		if (isEmpty(dbAddress)) return;
		await this._openDBWithAddress(dbAddress);
	}

	async _resetDBWithName(dbName) {
		// Get orbitdb
		const orbitdb = getOrbitDB(node);

		let db;

		// Create / Open a database
		try {
			try {
				db = await orbitdb.create(dbName, "eventlog", {
					write: ["*"]
				});
				console.log("Database CREATED:", dbName, db.address.toString());
			} catch (err) {
				db = await orbitdb.log(dbName, { write: ["*"] });
				console.log("Database OPENED:", dbName, db.address.toString());
			}
		} catch (err) {
			console.log(err);
		}

		await db.load();

		const currentDBAddress = db.address.toString();

		// Listen for updates from peers
		db.events.on("replicated", address => {
			console.log(db.iterator({ limit: -1 }).collect());
		});

		// // Query
		const feed = db.iterator({ limit: -1 }).collect();

		this.setState({
			feed,
			db,
			dbName: "",
			currentDBAddress,
			currentDBName: dbName
		});
	}

	async _openDBWithAddress(dbAddress) {
		// Get orbitdb
		const orbitdb = getOrbitDB(node);
		let db;

		// Open a database
		db = await orbitdb.log(dbAddress);
		const currentDBAddress = db.address.toString();
		const currentDBName = currentDBAddress.split("/").slice(-1);
		console.log("Database OPENED at address:", currentDBAddress);

		// Listen for updates from peers
		db.events.on("replicated", address => {
			console.log(db.iterator({ limit: -1 }).collect());
		});

		// Query db
		const feed = db.iterator({ limit: -1 }).collect();
		console.log(feed, db);

		// Set State with new values
		this.setState({
			feed,
			db,
			dbName: "",
			currentDBAddress,
			currentDBName
		});
	}

	render() {
		return (
			<div>
				<h1>Orbit Log Demo</h1>

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

				{/* Database Name Form */}
				<form onSubmit={this.onSubmitDatabase}>
					<div className="input-group mb-3">
						<div className="input-group mb-3">
							<p>
								Create/Open DB Using Name:
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

				{/* Database Address Form */}
				<form onSubmit={this.onSubmitDatabaseAddress}>
					<div className="input-group mb-3">
						<div className="input-group mb-3">
							<p>
								Open DB With Address:
								<input
									type="text"
									name="dbAddress"
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

				{/* Stateless Feed Component */}
				<LogFeed
					feed={this.state.feed}
					dbName={this.state.currentDBName}
					dbAddress={this.state.currentDBAddress}
				/>
			</div>
		);
	}
}
