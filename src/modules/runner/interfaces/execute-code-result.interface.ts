import { ExecException } from "child_process";

export interface ExecuteResult {
  stdout: string | null;
  stderr: string | null;
  error: ExecException | null;
}