import { healthRepository } from "#/task/repositories/index.mjs";

async function ping() {
    const response = await healthRepository.ping();
    return { reply: response.findOptions.reply };
}

export default { ping };
