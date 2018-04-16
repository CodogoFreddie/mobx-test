import React, { Fragment } from "react";
import { observer } from "mobx-react";

import { Todos } from "./todosStore";

const todoContainer = new Todos();

todoContainer.getTodo(1);
todoContainer.getTodo(2);
todoContainer.getTodo(3);

const TodoComponent = observer(({ todo }) => (
  <div
    style={{
      margin: "1em",
      backgroundColor: "lightgrey",
      textDecoration: todo.done ? "line-through" : null
    }}
  >
    {todo.loading ? (
      "loading..."
    ) : (
      <Fragment>
        <div onClick={todo.toggleDone}>{todo.done ? "done" : "not done"}</div>
        <input onChange={e => todo.setText(e.target.value)} value={todo.text} />
      </Fragment>
    )}
  </div>
));

const App = observer(() => (
  <div style={{ backgroundColor: "red", padding: "1em" }}>
    {[...todoContainer.todos.entries()].map(([id, todo]) => (
      <TodoComponent key={id} todo={todo} />
    ))}

    <div>
      {" "}
      {todoContainer.totalDone} / {todoContainer.total}{" "}
    </div>
  </div>
));
export default App;
