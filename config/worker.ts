export default {
  rabbitmq: {
    queue: {
      task: {
        name: 'task',
        active: true,
        prefetch: 1,
        durable: true,
        persistent: true,
      }
    }
  },
  cron: {
    cleanRunners: {
      disabled: true,
      expression: '0 0 */12 * * *', // every 12 hours
    }
  }
}