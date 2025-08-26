import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import config from 'config/app';
import { Runner } from "src/modules/runner/entities/runner.entity";
import _CONST from 'src/shared/_CONST';
import { assertExists } from './activities/runner.assert-exists';
import { createRunner } from './activities/runner.create';
import { executeCode } from './activities/runner.execute-code';
import { run } from './activities/runner.run';

@Injectable()
export class RunnerService {
  private di: {
    runnerRepository: Repository<Runner>;
    taskClient: ClientProxy;
    runnerService: RunnerService;
  };

  public assertExists: ReturnType<typeof assertExists>;
  public createRunner: ReturnType<typeof createRunner>;
  public executeCode: ReturnType<typeof executeCode>;
  public run: ReturnType<typeof run>;

  constructor(
    @Inject(config.rabbitmq.queue.task.name.toUpperCase()) private taskClient: ClientProxy,
    @InjectRepository(Runner) private runnerRepository: Repository<Runner>
  ) { 
    this.di = {
      runnerRepository: this.runnerRepository,
      taskClient: this.taskClient,
      runnerService: this,
    };

    this.assertExists = assertExists(this.di);
    this.createRunner = createRunner(this.di);
    this.executeCode = executeCode();
    this.run = run(this.di);
  }
}
