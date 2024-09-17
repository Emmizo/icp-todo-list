import Array "mo:base/Array";
import Time "mo:base/Time";

actor TodoListCanister {

  type Todo = {
    id : Nat;
    description : Text;
    priority : Text; // "Low", "Medium", "High"
    deadline : Time.Time;
    completed : Bool;
  };

  private var todos : [Todo] = [];
  private var nextId : Nat = 0;

  public func addTodo(description : Text, priority : Text, deadline : Time.Time) : async Text {
    let newTodo = {
      id = nextId;
      description = description;
      priority = priority;
      deadline = deadline;
      completed = false;
    };
    todos := Array.append(todos, [newTodo]);
    nextId += 1;
    return "Todo added";
  };

  public func getTodos() : async [Todo] {
    return todos;
  };

  public func completeTodo(id : Nat) : async Text {
    // Find the index of the Todo with the given id
    let indexOpt = Array.indexOf<Todo>(
      {
        id = id;
        description = "";
        priority = "";
        deadline = 0;
        completed = false;
      },
      todos,
      func(todo1 : Todo, todo2 : Todo) : Bool {
        todo1.id == todo2.id;
      },
    );

    switch (indexOpt) {
      case (?_i) {
        // Create a new array with the updated Todo
        let updatedTodos = Array.map<Todo, Todo>(
          todos,
          func(todo : Todo) : Todo {
            if (todo.id == id) {
              return {
                id = todo.id;
                description = todo.description;
                priority = todo.priority;
                deadline = todo.deadline;
                completed = true; // Mark as completed
              };
            };
            todo // Return unchanged if it's not the target todo
          },
        );
        todos := updatedTodos;
        return "Todo marked as completed";
      };
      case null {
        return "Todo not found";
      };
    };
  };

  public func removeTodo(id : Nat) : async Text {
    // Filter out the Todo with the given id
    todos := Array.filter<Todo>(
      todos,
      func(todo : Todo) : Bool {
        todo.id != id;
      },
    );
    return "Todo removed";
  };

  public func editTodo(id : Nat, newDescription : ?Text, newPriority : ?Text, newDeadline : ?Time.Time) : async Text {
    // Find the index of the Todo with the given id
    let indexOpt = Array.indexOf<Todo>(
      {
        id = id;
        description = "";
        priority = "";
        deadline = 0;
        completed = false;
      },
      todos,
      func(todo1 : Todo, todo2 : Todo) : Bool {
        todo1.id == todo2.id;
      },
    );

    switch (indexOpt) {
      case (?_i) {
        // Create a new array with the updated Todo
        let updatedTodos = Array.map<Todo, Todo>(
          todos,
          func(todo : Todo) : Todo {
            if (todo.id == id) {
              return {
                id = todo.id;
                description = switch (newDescription) {
                  case (?d) d;
                  case null todo.description;
                };
                priority = switch (newPriority) {
                  case (?p) p;
                  case null todo.priority;
                };
                deadline = switch (newDeadline) {
                  case (?d) d;
                  case null todo.deadline;
                };
                completed = todo.completed;
              };
            };
            todo // Return unchanged if it's not the target todo
          },
        );
        todos := updatedTodos;
        return "Todo edited";
      };
      case null {
        return "Todo not found";
      };
    };
  };
};
