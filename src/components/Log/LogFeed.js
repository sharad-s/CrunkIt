import React from "react";
import isEmpty from "../../util/isEmpty";

const LogFeed = props => {
	const { feed, dbName, dbAddress } = props;
	let feedItems = null;

	if (!isEmpty(feed)) {
		feedItems = feed.map((item, idx) => {
			const { value } = item.payload;
			return <li key={idx}> {value} </li>;
		});
	}

	return (
		<div>
			<h1>
				{dbName}({feed.length})
			</h1>
			<p> DB Address: "{dbAddress}" </p>
			<ul>{feedItems}</ul>
		</div>
	);
};

export default LogFeed;
