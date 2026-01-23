import type { Runner } from "src/modules/runner/entities/runner.entity";

import { Repository } from "typeorm";

export const assertExists = ({ runnerRepository }: { runnerRepository: Repository<Runner> }) => {
  return async ({ id }): Promise<Runner> => {
    const runner = await runnerRepository.findOne({ where: { id } });
    if (!runner) {
      throw new Error(`Runner not found. Runner ID: ${id}`);
    }
    return runner;
  }
}