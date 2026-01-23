export const MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
}

export const RUNNER = {
  STATUS: {
    IDLE: 'IDLE',
    PROCESSING: 'PROCESSING',
    ERROR: 'ERROR',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
  },
  get LIST_STATUS() {
    return Object.values(RUNNER.STATUS);
  },
}

export const REDIS_CLIENT_TOKEN = Symbol("REDIS_CLIENT")