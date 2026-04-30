type Result<T> = T | unknown;

/** Used to wrap form action */
export const safeFormActionAsync = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return async (...args: Parameters<T>): Promise<Result<Awaited<ReturnType<T>>>> => {
    try {
      const data = await fn(...args)
      return data;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { message: error.message };
      } else {
        return { message: 'Unknown error occured' };
      }
    }
  }
}
