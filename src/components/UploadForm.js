import React, { Component } from "react";
import classnames from "classnames";
import Crunker from "crunker";

import WATERMARK_MP3_URL from "../audio";
console.log("WATERMARK_MP3_URL:", WATERMARK_MP3_URL);

export default class UploadForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			trackFile: "",
			originalAudioBuffer: [],
			originalAudioFile: {},
			originalAudioURL: "",
			crunkedAudioBuffer: [],
			crunkedAudioFile: {},
			crunkedAudioURL: "",
			isCrunking: false,
			hasCrunked: false,
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.crunkIt = this.crunkIt.bind(this);
	}

	onChange(e) {
		e.preventDefault();
		switch (e.target.name) {
			case "trackImage":
				this.setState({ trackImage: e.target.files[0] });
				break;

			case "trackFile":
				this.setState({ trackFile: e.target.files[0] });
				break;

			default:
				this.setState({ [e.target.name]: e.target.value });
		}
	}

	async onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		const { trackFile, name } = this.state;
		console.log(this.state, name);
		console.log(trackFile);

		// Create object URL
		const audioURL = window.URL.createObjectURL(trackFile);

		// Read input file
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(trackFile);
		reader.onloadend = async () => {
			const audioBuffer = await Buffer.from(reader.result);
			console.log("UPLOADED: ", audioBuffer);
			this.setState({
				originalAudioBuffer: audioBuffer,
				originalAudioFile: trackFile,
				originalAudioURL: audioURL
			});
			this.crunkIt();
		};
	}

	crunkIt() {
		console.log("Crunking...");
		this.setState({ isCrunking: true, hasCrunked: false });

		// Get Audio Buffer
		const {
			originalAudioBuffer,
			originalAudioFile,
			originalAudioURL
		} = this.state;
		console.log(originalAudioBuffer);

		// Instantiate Crunker
		const crunker = new Crunker();

		// Fetch Audio
		crunker
			.fetchAudio(originalAudioURL, WATERMARK_MP3_URL)
			.then(buffers => crunker.mergeAudio(buffers))
			.then(merged => crunker.export(merged, "audio/mp3"))
			.then(output => {
				console.log(output);
				this.setState({
					crunkedAudioBuffer: output.blob,
					crunkedAudioFile: output,
					crunkedAudioURL: output.url
				});
				// crunker.download(output.blob);
				this.setState({ isCrunking: false, hasCrunked: true });
			})
			.catch(error => {
				throw new Error(error);
			});
	}

	// async getWatermarkAudioBuffer() {
	// 	const reader = new window.FileReader();
	// 	reader.readAsArrayBuffer(trackFile);
	// 	reader.onloadend = async () => {
	// 		const audioBuffer = await Buffer.from(reader.result);
	// 		console.log("UPLOADED: ", audioBuffer);
	// 		this.setState({ watermarkAudioBuffer: audioBuffer });
	// 	};
	// }

	async readAsArrayBuffer(item) {
		const fileReader = new FileReader();
		let arrayBuffer;
		fileReader.onloadend = () => {
			arrayBuffer = fileReader.result;
			return arrayBuffer;
		};

		fileReader.readAsArrayBuffer(item);
	}

	render() {
		let p = (
			<div>
				<p> File Uploaded! {this.state.originalAudioURL} </p>
				<button onClick={this.crunkIt}> CRUNK IT </button>
			</div>
		);

		let crunking = (
			<div>
				<p>
					Crunking...
					{this.state.originalAudioURL}{" "}
				</p>
			</div>
		);

		let crunked = (
			<div>
				<p>Crunked! Enjoy:</p>
				<a href={this.state.crunkedAudioURL} target="_blank">
					{this.state.crunkedAudioURL}
				</a>
			</div>
		);

		return (
			<div>
				<h1> 😳☝🏽 Crunk It 😩👊🏽</h1>
				<form onSubmit={this.onSubmit}>
					<div className="input-group mb-3">
						<div className="input-group mb-3">
							<p>
								select trak:{" "}
								<input
									type="file"
									name="trackFile"
									onChange={this.onChange}
								/>
							</p>
						</div>
						<div className="input-group mb-3">
							<input
								type="submit"
								className="btn btn-dark"
								value="CRUNK IT"
							/>
						</div>
					</div>
				</form>

				{this.state.isCrunking ? crunking : null}
				{this.state.hasCrunked ? crunked : null}
			</div>
		);
	}
}
