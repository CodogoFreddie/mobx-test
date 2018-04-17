import React, { Fragment } from "react";
import { observer } from "mobx-react";

import { todosStore } from "./todosStore";

todosStore.getTodo(1);
todosStore.getTodo(2);
todosStore.getTodo(3);
todosStore.getTodo(4);
todosStore.getTodo(5);

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
        <AuthorComponent author={todo.author} />
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
