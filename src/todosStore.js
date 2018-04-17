import { reaction, observable, decorate, action, computed } from "mobx";

import { usersStore } from "./usersStore";

const getTodoData = id => {
  fetch(`https://www.example.com/get-todo/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      done: id === 2,
      text: `this is the text for todo ${id}`,
      authorId: id % 2 ? "aaa" : "bbb"
    });
  });
};

class Todo {
  id;
  done;
  text;
  author;
  loading = true;
  shouldSave = true;

  constructor(id) {
    this.id = id;

    getTodoData(id).then(({ done, text, authorId }) => {
      this.shouldSave = false;

      this.done = done;
      this.text = text;
      this.author = usersStore.getUser(authorId);

      this.loading = false;
      this.shouldSave = true;
    });

    reaction(
      () => this.constructForAPI,
      () => {
        this.shouldSave &&
          console.log(`update API for todo ${id} `, this.constructForAPI);
      }
    );
  }

  toggleDone = () => {
    this.done = !this.done;
  };

  setText = text => {
    this.text = text;
  };

  get constructForAPI() {
    return {
      done: this.done,
      text: this.text
    };
  }
}
decorate(Todo, {
  done: observable,
  text: observable,
  loading: observable,
  author: observable,

  constructForAPI: computed,

  toggleDone: action,
  setText: action
});

class Todos {
  todos = new Map();

  getTodo(id) {
    if (this.todos.has(id)) {
      return this.todos.get(id);
    } else {
      this.todos.set(id, new Todo(id));
      return this.todos.get(id);
    }
  }

  get total() {
    return [...this.todos.values()].filter(({ loading }) => !loading).length;
  }

  get totalDone() {
    return [...this.todos.values()].filter(({ done }) => done).length;
  }

  allDone = () => {
    for (const todo of this.todos.values()) {
      todo.done = true;
    }
  };
}
decorate(Todos, {
  todo: observable,
  getTodo: action,
  total: computed,
  totalDone: computed,
  allDone: action
});

const todosStore = new Todos();

export { Todo, Todos, todosStore };
