import React, { Fragment } from "react";
import { observer } from "mobx-react";

import { todosStore } from "./todosStore";
import { usersStore } from "./usersStore";

if (false) {
  todosStore.hydrate([
    {
      id: "mock_todo_id_1",
      done: true,
      text: "this is a hydrated thing",
      authorId: "mock_author_id_1"
    },
    {
      id: "mock_todo_id_2",
      done: false,
      text: "this is another hydrated thing",
      authorId: "mock_author_id_2"
    },
    {
      id: "mock_todo_id_3",
      loading: true
    }
  ]);

  usersStore.hydrate([
    {
      id: "mock_author_id_1",
      name: "Big Billy"
    },
    {
      id: "mock_author_id_2",
      loading: true
    }
  ]);
} else {
  todosStore.getTodoById(1);
  todosStore.getTodoById(2);
  todosStore.getTodoById(3);
  todosStore.getTodoById(4);
  todosStore.getTodoById(5);
}

const AuthorComponent = observer(({ author }) => (
  <div>Author: {author.loading ? "loading..." : author.name}</div>
));

const TodoComponent = observer(({ todo }) => (
  <div
    style={{
      margin: "1em",
      backgroundColor: todo.done ? "coral" : "lightgrey"
    }}
  >
    {todo.loading ? (
      "loading..."
    ) : (
      <Fragment>
        <div onClick={todo.toggleDone}>{todo.done ? "done" : "not done"}</div>
        <input onChange={e => todo.setText(e.target.value)} value={todo.text} />
        {todo.author && <AuthorComponent author={todo.author} />}
      </Fragment>
    )}
  </div>
));

const App = observer(() => (
  <div style={{ backgroundColor: "red", padding: "1em" }}>
    {[...todosStore.todos.entries()].map(([id, todo]) => (
      <TodoComponent key={id} todo={todo} />
    ))}

    <div>
      {todosStore.totalDone} / {todosStore.total}
    </div>

    <div
      onClick={() => todosStore.allDone()}
      style={{ backgroundColor: "green" }}
    >
      ALL DONE
    </div>
  </div>
));
export default App;
