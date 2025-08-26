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
}