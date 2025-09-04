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
      GO: 'GO',
      JAVA: 'JAVA'
    },
    get LANGUAGE_INFO() {
      return {
        [_CONST.RUNNER.LANGUAGE.JAVASCRIPT]: {
          name: 'JavaScript',
          extension: 'js',
          timeout: 4000, // 4 seconds
        },
        [_CONST.RUNNER.LANGUAGE.TYPESCRIPT]: {
          name: 'TypeScript',
          extension: 'ts',
          timeout: 5000, // 5 seconds
        },
        [_CONST.RUNNER.LANGUAGE.GO]: {
          name: 'Go',
          extension: 'go',
          timeout: 15000, // 15 seconds
        },
        [_CONST.RUNNER.LANGUAGE.JAVA]: {
          name: 'Java',
          extension: 'java',
          timeout: 8000, // 8 seconds
        }
      }
    },
    get LIST_LANGUAGE() {
      return Object.values(_CONST.RUNNER.LANGUAGE);
    }
  }
}

export default _CONST;