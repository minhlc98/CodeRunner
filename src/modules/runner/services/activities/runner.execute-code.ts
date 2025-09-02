import { exec } from "child_process";
import { writeCodeToFile } from "src/modules/runner/utils";
import { ExecuteResult } from "../../interfaces/execute-code-result.interface";
import { log_error, removeDir } from "src/common/utils/helper";
import _CONST from "src/shared/_CONST";

export const executeCode = () => {
  return async ({ language, code }: { language: string, code: string }): Promise<ExecuteResult> => {
    const { folder, fileName } = await writeCodeToFile(language, code);
    const command = process.env[language]?.replace('{fileName}', fileName).replace('{folder}', folder);

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
        }, _CONST.RUNNER.LANGUAGE_INFO[language]?.timeout || 3000); // default timeout 3s
      });
    }

    const executeResult: ExecuteResult = await executeCommand(command!);

    removeDir(folder, { recursive: true }).catch(log_error);

    return executeResult;
  }
}