import { connection } from "#/task/db/index.mjs";

async function ping() {
    const collection = connection.db.collection("local");
    const pingResponse = await collection.find({}, { reply: "Pong", _id: 0 });
    return pingResponse;
}

export default { ping };
