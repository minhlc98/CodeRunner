import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFileStream, ensureDirExists } from 'src/common/utils/helper';

export const writeCodeToFile = async ({
  fileName = 'solution',
  fileExtension,
  code
}: { fileName?: string, fileExtension: string, code: string }): Promise<{ folder: string, fileName: string }> => {
  const uuid = uuidv4();
  const folder = path.resolve('code', `${uuid.slice(-8)}-${Date.now()}`);
  const fullFileName = `${fileName}.${fileExtension}`;
  await ensureDirExists(folder);
  return writeFileStream(path.resolve(folder, fullFileName), code).then(() => ({ folder, fileName: fullFileName }));
}