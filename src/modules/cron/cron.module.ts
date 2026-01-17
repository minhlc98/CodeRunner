import { Module } from "@nestjs/common";
import { RunnerModule } from "../runner/runner.module";
import { CleanOldRunnerJob } from "./jobs/clean-old-runners-job";

@Module({
  imports: [RunnerModule],
  providers: [CleanOldRunnerJob],
  exports: [],
})
export class CronModule {}