import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Time = bigint;
export interface Todo {
  'id' : bigint,
  'completed' : boolean,
  'description' : string,
  'deadline' : Time,
  'priority' : string,
}
export interface _SERVICE {
  'addTodo' : ActorMethod<[string, string, Time], string>,
  'completeTodo' : ActorMethod<[bigint], string>,
  'editTodo' : ActorMethod<
    [bigint, [] | [string], [] | [string], [] | [Time]],
    string
  >,
  'getTodos' : ActorMethod<[], Array<Todo>>,
  'removeTodo' : ActorMethod<[bigint], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
