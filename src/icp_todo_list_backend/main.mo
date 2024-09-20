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

  private func findTodoIndex(id : Nat) : ?Nat {
    Array.indexOf<Todo>(
      todos,
      {
        id = id;
        description = "";
        priority = "";
        deadline = 0;
        completed = false;
      },
      func(todo1 : Todo, todo2 : Todo) : Bool {
        todo1.id == todo2.id;
      },
    );
  };

  public func addTodo(description : Text, priority : Text, deadline : Time.Time) : async Text {
    if (priority != "Low" and priority != "Medium" and priority != "High") {
      return "Invalid priority value";
    };
    let newTodo = {
      id = nextId;
      description = description;
      priority = priority;
      deadline = deadline;
      completed = false;
    };
    todos := Array.append<Todo>(todos, [newTodo]);
    nextId += 1;
    return "Todo added";
  };

  public query func getTodos() : async [Todo] {
    return todos;
  };

  public func completeTodo(id : Nat) : async Text {
    let indexOpt = findTodoIndex(id);
    switch (indexOpt) {
      case (?index) {
        todos[index] := { todos[index] with completed = true };
        return "Todo marked as completed";
      };
      case null {
        return "Todo not found";
      };
    };
  };

  public func removeTodo(id : Nat) : async Text {
    todos := Array.filter<Todo>(
      todos,
      func(todo : Todo) : Bool {
        todo.id != id;
      },
    );
    return "Todo removed";
  };

  public func editTodo(id : Nat, newDescription : ?Text, newPriority : ?Text, newDeadline : ?Time.Time) : async Text {
    let indexOpt = findTodoIndex(id);
    switch (indexOpt) {
      case (?index) {
        if (newPriority != null and newPriority != ?("Low") and newPriority != ?("Medium") and newPriority != ?("High")) {
          return "Invalid priority value";
        };
        todos[index] := {
          todos[index] with
          description = switch (newDescription) {
            case (?d) d;
            case null todos[index].description;
          };
          priority = switch (newPriority) {
            case (?p) p;
            case null todos[index].priority;
          };
          deadline = switch (newDeadline) {
            case (?d) d;
            case null todos[index].deadline;
          };
        };
        return "Todo edited";
      };
      case null {
        return "Todo not found";
      };
    };
  };

  // private _stream : Stream; // Commented out as Stream is unbound
  private _stream : Stream;

};
