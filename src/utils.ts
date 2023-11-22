/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  MatchOptions,
  StateMatching,
  StateValue,
} from '@bemedev/x-matches';
import type { Prop, TypegenEnabled } from 'xstate';

// #region PartialCall
// type Arr = readonly any[];

// export function partialCall<T extends Arr, U extends Arr, R>(
//   f: (...args: [...T, ...U]) => R,
//   ...headArgs: T
// ) {
//   return (...tailArgs: U) => f(...headArgs, ...tailArgs);
// }
// #endregion

type TSV<T> = T extends TypegenEnabled
  ? Prop<Prop<T, 'resolved'>, 'matchesStates'>
  : never;

export type UseMatchesProps<T> = MatchOptions<
  StateMatching<TSV<T> extends StateValue ? TSV<T> : StateValue>
>[];

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

type SubType<Base extends object, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;
// #endregion

type Fn<P extends any[] = any, R = any> = (...arg: P) => R;
type KeysFn<T extends object = object> = keyof SubType<T, Fn>;

export function defaultSelector<Input, Output>(value: Input) {
  return value as unknown as Output;
}

function _reFunction<P extends any[] = any[], R = any>(
  fn: Fn<P, R>,
  bind: any,
) {
  return (...args: P) => fn.bind(bind)(...args);
}

export function reFunction<
  T extends object = object,
  FnKey extends KeysFn<T> = KeysFn<T>,
>(object: T, fn: FnKey) {
  const _fn = object[fn];
  type Pm = T[FnKey] extends (...args: infer P) => any ? P : any[];
  type Re = T[FnKey] extends (...args: any) => infer R ? R : any;
  return _reFunction<Pm, Re>(_fn as any, object);
}
