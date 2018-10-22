import React from "react";
import isEmpty from "../../util/isEmpty";

const LogFeed = props => {
	const { feed, dbName } = props;
	let feedItems = null;

	if (!isEmpty(feed)) {
		feedItems = feed.map(item => {
			const { value } = item.payload;
			return <li> {value} </li>;
		});
	}

	return (
		<div>
			<h1>
				Feed {dbName}({feed.length})
			</h1>
			<ul>{feedItems}</ul>
		</div>
	);
};

export default LogFeed;
