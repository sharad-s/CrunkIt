import React from "react";
import isEmpty from "../../util/isEmpty";

const LogFeed = props => {
	const { feed } = props;
	let feedItems = null;

	if (!isEmpty(feed)) {
		feedItems = feed.map(item => {
			const { value } = item.payload;
			return <li> {value} </li>;
		});
	}

	return (
		<div>
			<h1> Feed ({feed.length}) </h1>
			<ul>{feedItems}</ul>
		</div>
	);
};

export default LogFeed;
