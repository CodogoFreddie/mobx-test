import React, { Fragment } from "react";
import { observer } from "mobx-react";

import { todosStore, usersStore } from "./store";

if (false) {
  todosStore.hydrate([
    {
      id: 1,
      done: true,
      text: "this is a hydrated thing",
      authorId: "mock_author_id_1"
    },
    {
      id: 2,
      done: false,
      text: "this is another hydrated thing",
      authorId: "mock_author_id_2"
    },
    {
      id: 3,
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

const AuthorComponent = observer(
  ({ author }) => (
    console.log(author.todos),
    (
      <div>
        Author: {author.loading ? "loading..." : author.name} ({
          author.todos.filter(({ done }) => done).length
        }{" "}
        / {author.todos.length})
      </div>
    )
  )
);

const TodoComponent = observer(({ id }) => {
  const todo = todosStore.getTodoById(id);

  return (
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
          <input
            onChange={e => todo.setText(e.target.value)}
            value={todo.text}
          />
          {todo.author && <AuthorComponent author={todo.author} />}
        </Fragment>
      )}
    </div>
  );
});

const App = observer(() => (
  <div style={{ backgroundColor: "red", padding: "1em" }}>
    {[...todosStore.todos.entries()].map(([id]) => (
      <TodoComponent key={id} id={id} />
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
