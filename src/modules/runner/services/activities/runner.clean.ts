import { Repository } from "typeorm";
import { Runner } from "src/modules/runner/entities/runner.entity";
import { log_info } from "src/common/utils/helper";

export const clean = ({ runnerRepository }: { runnerRepository: Repository<Runner> }) => {
  return async (date?: Date): Promise<void> => {
    log_info("[START]: Clean old runners");

    if (!date) {
      date = new Date();
      date.setDate(date.getDate() - 1); // default to a day ago
    }
    const result = await runnerRepository.createQueryBuilder()
      .delete()
      .where("createdAt < :date", { date })
      .execute();
    
    log_info(`[FINISH]: Cleaned ${result.affected} old runners.`)
  }
}