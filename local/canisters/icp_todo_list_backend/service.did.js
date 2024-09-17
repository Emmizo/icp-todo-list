export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Todo = IDL.Record({
    'id' : IDL.Nat,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'deadline' : Time,
    'priority' : IDL.Text,
  });
  return IDL.Service({
    'addTodo' : IDL.Func([IDL.Text, IDL.Text, Time], [IDL.Text], []),
    'completeTodo' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'editTodo' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(Time)],
        [IDL.Text],
        [],
      ),
    'getTodos' : IDL.Func([], [IDL.Vec(Todo)], []),
    'removeTodo' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
