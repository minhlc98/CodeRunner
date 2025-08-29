import webConfig from './web';
import workerConfig from './worker';

let config: typeof webConfig | typeof workerConfig = { ...webConfig };
if (process.env.APP_TYPE === 'web') {
  config = { ...webConfig };
}
else if (process.env.APP_TYPE === 'worker') {
  config = { ...workerConfig };
}

export default config;