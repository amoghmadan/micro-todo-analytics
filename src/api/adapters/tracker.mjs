import { credentials } from "@grpc/grpc-js";

import settings from "#/api/conf/index.mjs";
import { trackerProto } from "#/api/protobuf/client/index.mjs";
import { gRPCCallable } from "#/api/utils/call.mjs";

export class TrackerAdapter {

  constructor() {
    this.client = {
      health: new trackerProto.HealthService(
        settings.SERVICES.grpc.tracker.host, credentials.createInsecure()
      ),
      analytics: new trackerProto.AnalyticsService(
        settings.SERVICES.grpc.tracker.host, credentials.createInsecure()
      ),
    }
  }

  async health(metadata) {
    const callableMethod = gRPCCallable(this.client.health, "Ping");
    const response = await callableMethod({}, metadata);
    return response;
  }

  async dayAnalytics(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.analytics, "DayAnalytics");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async weekAnalytics(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.analytics, "WeekAnalytics");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async monthAnalytics(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.analytics, "MonthAnalytics");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async yearAnalytics(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.analytics, "YearAnalytics");
    const response = await callableMethod(payload, metadata);
    return response;
  }
}
