import type { ExecuteResult } from "src/modules/runner/interfaces/execute-code-result.interface";
import type { Runner } from "src/modules/runner/entities/runner.entity";
import type { ProgrammingLanguage } from "src/modules/programming-language/programming-language.entity";

import { exec } from "child_process";
import { writeCodeToFile } from "src/modules/runner/utils";
import { log_error, removeDir } from "src/common/utils/helper";

export const executeCode = () => {
  return async (programingLanguage: ProgrammingLanguage, runner: Runner): Promise<ExecuteResult> => {
    const { folder, fileName } = await writeCodeToFile({ fileExtension: programingLanguage.fileExtension, code: runner.code });
    const command = programingLanguage.runCommand.replace('{fileName}', fileName).replace('{folder}', folder);

    async function executeCommand(command: string): Promise<ExecuteResult> {
      return new Promise((resolve) => {
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
        }, programingLanguage.timeout || 3000); // default timeout 3s
      });
    }

    const executeResult: ExecuteResult = await executeCommand(command!);

    removeDir(folder, { recursive: true }).catch(log_error);

    return executeResult;
  }
}