/**
 * Safely access environment variables in both Node.js and Vite environments.
 * Vite replaces process.env.X statically at build time; Node.js reads it at runtime.
 */

function getEnv(key: string): string | undefined {
  try {
    if (typeof process !== "undefined" && process.env) {
      return process.env[key];
    }
  } catch {
    // Ignore
  }
  return undefined;
}

export const Env = {
  get GAME_ENV(): string {
    return getEnv("GAME_ENV") ?? "dev";
  },
  get STRIPE_PUBLISHABLE_KEY() {
    return getEnv("STRIPE_PUBLISHABLE_KEY");
  },
  get DOMAIN() {
    return getEnv("DOMAIN");
  },
  get SUBDOMAIN() {
    return getEnv("SUBDOMAIN");
  },
  get OTEL_EXPORTER_OTLP_ENDPOINT() {
    return getEnv("OTEL_EXPORTER_OTLP_ENDPOINT");
  },
  get OTEL_AUTH_HEADER() {
    return getEnv("OTEL_AUTH_HEADER");
  },
  get GIT_COMMIT() {
    return getEnv("GIT_COMMIT");
  },
  get API_KEY() {
    return getEnv("API_KEY");
  },
  get ADMIN_TOKEN() {
    return getEnv("ADMIN_TOKEN");
  },
};
