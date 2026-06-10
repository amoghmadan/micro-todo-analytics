import { HealthService, ItemService } from "#/task/protobuf/server/index.mjs";
import { healthService, itemService } from "#/task/services/index.mjs";

export default new Map([
    [HealthService.service, healthService],
    [ItemService.service, itemService],
]);
