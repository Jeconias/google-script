export type ArrayType<T> = T extends Array<any> ? T[number] : T;

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
