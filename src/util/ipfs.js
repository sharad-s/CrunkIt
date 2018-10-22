import IPFS from "ipfs";
import OrbitDB from "orbit-db";

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
// Note that these options need to be passed to IPFS in
// all examples even if not specified so.
const ipfsOptions = {
	EXPERIMENTAL: {
		pubsub: true
	},
	emptyRepo: true
};

const node = new IPFS(ipfsOptions);

node.on("error", e => console.error(e));

node.on("start", async () => {
	console.log("IPFS Node Started...");
});

node.on("ready", async () => {
	// Log shit
	const version = await node.version();
	const id = await node.id();
	console.log(`IPFS Node Ready:
    Version: ${version.version}
    Node Id: ${id.id}
  `);
});

const getOrbitDB = node => {
	// Instantiate Orbit
	return new OrbitDB(node);

	// // Create / Open a database
	// const db = await orbitdb.log(DATABASE_NAME);
	// await db.load();

	// // Listen for updates from peers
	// db.events.on("replicated", address => {
	// 	console.log(db.iterator({ limit: -1 }).collect());
	// });

	// // Add an entry
	// const hash = await db.add("boobs");
	// const hash2 = await db.add("vagina");
	// console.log("HASH:", hash);
	// console.log("HASH:", hash2);

	// // Query
	// const result = db.iterator({ limit: -1 }).collect();
	// console.log(JSON.stringify(result, null, 2));
	// console.log(result.length);
};

export { node, getOrbitDB };
