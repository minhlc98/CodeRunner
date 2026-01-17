import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import config from 'config/app';
import { RunnerService } from "src/modules/runner/services/runner.service";

@Injectable()
export class CleanOldRunnerJob {
  constructor(private readonly runnerService: RunnerService) {}

  @Cron(config.cron.cleanRunners.expression, {
    name: 'cleanOldRunners',
    disabled: config.cron.cleanRunners.disabled
  })
  async cleanOldRunners() {
    return this.runnerService.clean();
  }
}