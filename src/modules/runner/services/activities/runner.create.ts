import { Repository } from "typeorm";
import { Runner } from "src/modules/runner/entities/runner.entity";
import { RunCodeDto } from "src/modules/runner/dtos/run-code.dto";
import { ClientProxy } from "@nestjs/microservices";
import { log_error, generateMd5Hash } from "src/common/utils/helper";
import { RedisService } from "src/modules/redis/redis.service";

type CreateRunnerDIType = {
  runnerRepository: Repository<Runner>,
  taskClient: ClientProxy,
  redisService: RedisService
}

export const createRunner = ({ runnerRepository, taskClient, redisService }: CreateRunnerDIType) => {
  return async (data: RunCodeDto): Promise<{ success: boolean; id?: string }> => {
    try {
      const hashedData = generateMd5Hash(`${data.programmingLanguageId}-${data.code}`);
      const runnerId = await redisService.get(hashedData);
      if (runnerId) {
        return { success: true, id: runnerId };
      }
      const runner: Runner = new Runner();
      runner.programmingLanguageId = data.programmingLanguageId;
      runner.code = data.code;
      const newRunner = await runnerRepository.save(runner);
      await Promise.all([
        redisService.setExpire(hashedData, newRunner.id, 30),
        taskClient.emit('exec_code', { id: newRunner.id })
      ]);
      return { success: true, id: newRunner.id };
    } catch (error) {
      log_error(error);
      return { success: false };
    }
  }
}