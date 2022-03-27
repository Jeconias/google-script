import jpackage from './packageInfo';

//TODO: Add enhancement
export const logger = {
  debug: (...message: string[]) =>
    console.log(`[${jpackage.name}][Debug]`, ...message),
  info: (...message: string[]) =>
    console.log(`[${jpackage.name}][Info]`, ...message),
  err: (...err: any) => console.error(`[${jpackage.name}][Error]`, err),
};
