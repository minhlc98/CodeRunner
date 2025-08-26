import { trim } from 'lodash';
import { exec, ExecException } from 'child_process';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import config from 'config/app';
import RunCodeDto from './dtos/run-code.dto';
import { log_error, removeDir } from 'src/common';
import { RunCodeResponse } from './interfaces/run-code-response.interface';
import { Runner } from './entities/runner.entity';
import _CONST from 'src/shared/_CONST';
import { writeCodeToFile } from './utils';

interface ExecuteResult {
  stdout: string | null;
  stderr: string | null;
  error: ExecException | null;
}

@Injectable()
export class RunnerService {
  constructor(
    @Inject(config.rabbitmq.queue.task.name.toUpperCase()) private taskClient: ClientProxy,
    @InjectRepository(Runner) private runnerRepository: Repository<Runner>
  ) { }

  async assertExists({ id }: { id: string }): Promise<Runner> {
    const runner = await this.runnerRepository.findOne({ where: { id } });
    if (!runner) {
      throw new Error(`Runner not found. Runner ID: ${id}`);
    }
    return runner;
  }

  async runCode({ runner }: { runner: Runner }): Promise<RunCodeResponse> {
    const response: RunCodeResponse = {
      success: false,
      output: null,
      error: null,
    }

    if (runner.status !== _CONST.RUNNER.STATUS.IDLE) {
      return response;
    }

    try {
      const startedAt = new Date();
      await this.runnerRepository.update(runner.id, {
        status: _CONST.RUNNER.STATUS.PROCESSING,
        updatedAt: startedAt
      });

      const { folder, fileName } = await writeCodeToFile(runner.language, runner.code);
      const command = process.env[runner.language]?.replace('{fileName}', fileName).replace('{folder}', folder);

      async function executeCommand(command: string): Promise<ExecuteResult> {
        return new Promise((resolve, reject) => {
          const child = exec(command, (error, stdout, stderr) => resolve({ error, stdout, stderr }));
          setTimeout(() => {
            if (!child.killed) {
              child.kill('SIGKILL');
              return resolve({
                error: {
                  message: 'Execution Timeout',
                  name: '',
                },
                stdout: null,
                stderr: null
              });
            }
          }, 3000);
        });
      }

      const executeResult: ExecuteResult = await executeCommand(command!);

      if (executeResult.error) {
        response.error = executeResult.error.message;
      }

      if (executeResult.stderr) {
        response.error = executeResult.stderr;
      }

      if (executeResult.stdout) {
        response.output = trim(executeResult.stdout);
        response.success = true;
      }

      const finishedAt = new Date();

      await this.runnerRepository.update(runner.id, {
        output: response.output ?? undefined,
        error: response.error ?? undefined,
        status: response.success ? _CONST.RUNNER.STATUS.COMPLETED : _CONST.RUNNER.STATUS.ERROR,
        finishedAt: finishedAt,
        duration: finishedAt.getTime() - startedAt.getTime(),
      });

      removeDir(folder, { recursive: true }).catch(log_error);
    }
    catch (error) {
      log_error(error);
      response.error = 'An unexpected error occurred while running the code.';
    }

    return response;
  }

  async createRunner(data: RunCodeDto): Promise<{ success: boolean; id?: string }>{
    try {
      const runner: Runner = new Runner();
      runner.language = data.language;
      runner.code = data.code;
      const newRunner = await this.runnerRepository.save(runner);
      await this.taskClient.emit('exec_code', { id: newRunner.id });
      return { success: true, id: newRunner.id };
    } catch (error) {
      log_error(error);
      return { success: false };
    }
  }
}
