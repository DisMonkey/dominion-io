import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { getServerConfigFromServer } from "../core/configuration/ConfigLoader";

const config = getServerConfigFromServer();

export function getOtelResource() {
  return resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "dominion-io",
    [ATTR_SERVICE_VERSION]: "1.0.0",
    ...getPromLabels(),
  });
}

export function getPromLabels() {
  return {
    "service.instance.id": process.env.HOSTNAME,
    "dominion.environment": config.env(),
    "dominion.host": process.env.HOST,
    "dominion.domain": process.env.DOMAIN,
    "dominion.subdomain": process.env.SUBDOMAIN,
    "dominion.component": process.env.WORKER_ID
      ? "Worker " + process.env.WORKER_ID
      : "Master",
  };
}
