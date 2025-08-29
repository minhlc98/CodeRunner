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
      disabled: false,
      expression: '0 */1 * * * *', // every 12 hours
    }
  }
}