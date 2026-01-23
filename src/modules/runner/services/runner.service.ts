import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import config from 'config/app';
import { Runner } from "src/modules/runner/entities/runner.entity";
import { assertExists } from 'src/modules/runner/services/activities/runner.assert-exists';
import { createRunner } from 'src/modules/runner/services/activities/runner.create';
import { executeCode } from 'src/modules/runner/services/activities/runner.execute-code';
import { run } from 'src/modules/runner/services/activities/runner.run';
import { clean } from 'src/modules/runner/services/activities/runner.clean';
import { ProgrammingLanguageService } from 'src/modules/programming-language/programming-language.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class RunnerService {
  private di: {
    runnerRepository: Repository<Runner>;
    taskClient: ClientProxy;
    runnerService: RunnerService;
    programmingLanguageService: ProgrammingLanguageService;
    redisService: RedisService;
  };

  public assertExists: ReturnType<typeof assertExists>;
  public createRunner: ReturnType<typeof createRunner>;
  public executeCode: ReturnType<typeof executeCode>;
  public run: ReturnType<typeof run>;
  public clean: ReturnType<typeof clean>;

  constructor(
    @Inject(config.rabbitmq.queue.task.name.toUpperCase()) private taskClient: ClientProxy,
    @InjectRepository(Runner) private runnerRepository: Repository<Runner>,
    private programmingLanguageService: ProgrammingLanguageService,
    private redisService: RedisService,
  ) { 
    this.di = {
      runnerRepository: this.runnerRepository,
      taskClient: this.taskClient,
      runnerService: this,
      programmingLanguageService: this.programmingLanguageService,
      redisService: this.redisService,
    };

    this.assertExists = assertExists(this.di);
    this.createRunner = createRunner(this.di);
    this.executeCode = executeCode();
    this.run = run(this.di);
    this.clean = clean(this.di);
  }
}
