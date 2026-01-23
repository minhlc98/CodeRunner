import type { ExecuteResult } from "src/modules/runner/interfaces/execute-code-result.interface";
import type { RunCodeResponse } from "src/modules/runner/interfaces/run-code-response.interface"
import type { RunnerService } from "src/modules/runner/services/runner.service";

import { trim } from "lodash";
import { Repository } from "typeorm";

import { MS, RUNNER } from "src/shared/constant";
import { Runner } from "src/modules/runner/entities/runner.entity";
import { log_error } from "src/common/utils/helper";

import { ProgrammingLanguageService } from "src/modules/programming-language/programming-language.service";

type RunDIType = {
  runnerRepository: Repository<Runner>,
  runnerService: RunnerService,
  programmingLanguageService: ProgrammingLanguageService
}

export const run = ({
  runnerRepository,
  runnerService,
  programmingLanguageService
}: RunDIType) => {
  return async ({ runner }: { runner: Runner }): Promise<RunCodeResponse> => {
    const response: RunCodeResponse = {
      success: false,
      output: null,
      error: null,
    }

    if (runner.status !== RUNNER.STATUS.IDLE) {
      return response;
    }

    try {
      const startedAt = new Date();
      const runnerCreatedAt = runner.createdAt;
      const durationFromCreatedToStart = startedAt.getTime() - runnerCreatedAt.getTime();
      if (durationFromCreatedToStart > MS.MINUTE) {
        // skip running if the runner has been waiting for too long
        await runnerRepository.update(runner.id, {
          status: RUNNER.STATUS.SKIPPED,
          updatedAt: startedAt,
          finishedAt: startedAt,
          duration: 0,
        });

        return response;
      }

      const programingLanguage = await programmingLanguageService.assertExists(runner.programmingLanguageId, true, true);

      await runnerRepository.update(runner.id, {
        status: RUNNER.STATUS.PROCESSING,
        updatedAt: startedAt
      });

      const executeResult: ExecuteResult = await runnerService.executeCode(programingLanguage, runner);

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
        output: response.output,
        error: response.error,
        status: response.success ? RUNNER.STATUS.COMPLETED : RUNNER.STATUS.ERROR,
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
