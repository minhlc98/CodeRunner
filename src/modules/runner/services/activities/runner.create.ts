import { Repository } from "typeorm";
import { Runner } from "src/modules/runner/entities/runner.entity";
import { RunCodeDto } from "src/modules/runner/dtos/run-code.dto";
import { ClientProxy } from "@nestjs/microservices";
import { log_error } from "src/common";

export const createRunner = ({ runnerRepository, taskClient }: { runnerRepository: Repository<Runner>, taskClient: ClientProxy }) => {
  return async (data: RunCodeDto): Promise<{ success: boolean; id?: string }> => {
     try {
      const runner: Runner = new Runner();
      runner.language = data.language;
      runner.code = data.code;
      const newRunner = await runnerRepository.save(runner);
      await taskClient.emit('exec_code', { id: newRunner.id });
      return { success: true, id: newRunner.id };
    } catch (error) {
      log_error(error);
      return { success: false };
    }
  }
}