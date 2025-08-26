import { trim } from "lodash";
import { Repository } from "typeorm";

import { RunCodeResponse } from "src/modules/runner/interfaces/run-code-response.interface"
import _CONST from "src/shared/_CONST";
import { Runner } from "src/modules/runner/entities/runner.entity";
import { ExecuteResult } from "src/modules/runner/interfaces/execute-code-result.interface";
import { log_error } from "src/common";
import { RunnerService } from "../runner.service";

export const run = ({ runnerRepository, runnerService }: { runnerRepository: Repository<Runner>, runnerService: RunnerService }) => {
  return async ({ runner }: { runner: Runner }): Promise<RunCodeResponse> => {
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
      await runnerRepository.update(runner.id, {
        status: _CONST.RUNNER.STATUS.PROCESSING,
        updatedAt: startedAt
      });

      const executeResult: ExecuteResult = await runnerService.executeCode({ language: runner.language, code: runner.code });

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

      await runnerRepository.update(runner.id, {
        output: response.output ?? undefined,
        error: response.error ?? undefined,
        status: response.success ? _CONST.RUNNER.STATUS.COMPLETED : _CONST.RUNNER.STATUS.ERROR,
        finishedAt: finishedAt,
        duration: finishedAt.getTime() - startedAt.getTime(),
      });
    }
    catch (error) {
      log_error(error);
      response.error = 'An unexpected error occurred while running the code.';
    }

    return response;
  }
}
