import * as moment from 'moment';
import { createWriteStream, mkdir, rm } from 'fs';

export const writeFileStream = (filePath: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath);
    stream.write(content);
    stream.end();
    stream.on('finish', () => {
      resolve();
    });
  });
}

export const ensureDirExists = (dirPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export const removeDir = (dirPath: string, options: { recursive?: boolean }): Promise<void> => {
  return new Promise((resolve, reject) => {
    rm(dirPath, options, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export const log_info = (text: string): void => {
  const now = moment().format('DD-MM-YYYY HH:mm:ss');
  console.log(`[${now}] [INFO]: ${text}`);
}

export const safeStringify = (obj: unknown, space = 0): string => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  }, space);
}

export const log_error = (error: unknown): void => {
  const now = moment().format('DD-MM-YYYY HH:mm:ss');
  if (typeof error === 'object' && error !== null) {
    const tmp = {};
    Object.getOwnPropertyNames(error).forEach((key) => {
      tmp[key] = (error as Error)[key];
    });

    error = safeStringify(tmp, 2);
  }
  console.error(`[${now}] [ERROR]: ${error}`);
}