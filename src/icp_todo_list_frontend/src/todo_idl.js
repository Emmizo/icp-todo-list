export const idlFactory = ({ IDL }) => {
  const Todo = IDL.Record({
    id: IDL.Nat,
    description: IDL.Text,
    priority: IDL.Text,
    deadline: IDL.Int,
    completed: IDL.Bool,
  });
  return IDL.Service({
    addTodo: IDL.Func([IDL.Text, IDL.Text, IDL.Int], [IDL.Text], []),
    getTodos: IDL.Func([], [IDL.Vec(Todo)], ["query"]),
    completeTodo: IDL.Func([IDL.Nat], [IDL.Text], []),
    removeTodo: IDL.Func([IDL.Nat], [IDL.Text], []),
    editTodo: IDL.Func(
      [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Int)],
      [IDL.Text],
      []
    ),
  });
};
export const init = ({ IDL }) => {
  return [];
};
