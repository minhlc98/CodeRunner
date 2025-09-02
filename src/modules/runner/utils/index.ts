import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import _CONST from 'src/shared/_CONST';
import { writeFileStream, ensureDirExists } from 'src/common/utils/helper';

export const writeCodeToFile = async (language: string, code: string): Promise<{ folder: string, fileName: string }> => {
  const uuid = uuidv4();
  const folder = path.resolve('code', `${uuid.slice(-8)}-${Date.now()}`);
  const languageInfo = _CONST.RUNNER.LANGUAGE_INFO[language];
  if (!languageInfo) {
    return Promise.reject(`Unsupported language: ${language}`);
  }
  const fileName = `solution.${languageInfo.extension}`;
  await ensureDirExists(folder);
  return writeFileStream(path.resolve(folder, fileName), code).then(() => ({ folder, fileName }));
}