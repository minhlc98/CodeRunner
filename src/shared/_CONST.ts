const _CONST = {
  RUNNER: {
    STATUS: {
      IDLE: 'IDLE',
      PROCESSING: 'PROCESSING',
      ERROR: 'ERROR',
      COMPLETED: 'COMPLETED',
    },
    get LIST_STATUS() {
      return Object.values(_CONST.RUNNER.STATUS);
    },

    LANGUAGE: {
      JAVASCRIPT: 'JAVASCRIPT',
      TYPESCRIPT: 'TYPESCRIPT',
    },
    get LANGUAGE_INFO() {
      return {
        [_CONST.RUNNER.LANGUAGE.JAVASCRIPT]: {
          name: 'JavaScript',
          extension: 'js',
        },
        [_CONST.RUNNER.LANGUAGE.TYPESCRIPT]: {
          name: 'TypeScript',
          extension: 'ts',
        },
      }
    },
    get LIST_LANGUAGE() {
      return Object.values(_CONST.RUNNER.LANGUAGE);
    }
  }
}

export default _CONST;