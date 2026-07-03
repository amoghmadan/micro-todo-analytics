import { trackerAdapter } from "#/api/adapters/index.mjs";

async function dayAnalytics(args, context) {
    const data = await trackerAdapter.dayAnalytics(args, context.metadata);
    return data.results;
}

async function weekAnalytics(args, context) {
    const data = await trackerAdapter.weekAnalytics(args, context.metadata);
    return data.results;
}

async function monthAnalytics(args, context) {
    const data = await trackerAdapter.monthAnalytics(args, context.metadata);
    return data.results;
}

async function yearAnalytics(args, context) {
    const data = await trackerAdapter.yearAnalytics(args, context.metadata);
    return data.results;
}

export default { dayAnalytics, monthAnalytics, weekAnalytics, yearAnalytics };
