import { reaction, observable, action, computed } from "mobx";

import { createTransformer } from "mobx-utils";

import { usersStore } from "./usersStore";

const getTodoData = id => {
  fetch(`https://www.example.com/get-todo/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      done: id === 2,
      text: `this is the text for todo ${id}`,
      authorId: id > 3 ? null : id % 2 ? "aaa" : "bbb"
    });
  });
};

class Todo {
  @observable id;
  @observable done;
  @observable text;
  @observable authorId;
  @observable loading = true;

  shouldSave = true;

  constructor({ id, data }) {
    if (id) {
      this.id = id;
      this.loadDataFromServer();
    } else {
      this.hydrate(data);
    }

    //save this todo to the api when it changes
    reaction(
      () => this.constructForAPI,
      () => {
        this.shouldSave &&
          console.log(`update API for todo ${this.id} `, this.constructForAPI);
      }
    );
  }

  @computed
  get constructForAPI() {
    return {
      done: this.done,
      text: this.text,
      authorId: this.authorId
    };
  }

  @computed
  get author() {
    return usersStore.getUserById(this.authorId);
  }

  @action
  loadDataFromServer = () => {
    getTodoData(this.id).then(({ done, text, authorId }) => {
      this.shouldSave = false;

      this.done = done;
      this.text = text;
      this.authorId = authorId;

      this.loading = false;
      this.shouldSave = true;
    });
  };

  @action
  hydrate = ({ id, done, text, authorId, loading }) => {
    this.shouldSave = false;

    this.id = id;
    this.done = done;
    this.text = text;
    this.loading = loading;
    this.authorId = authorId;

    this.shouldSave = true;
  };

  @action
  toggleDone = () => {
    this.done = !this.done;
  };

  @action
  setText = text => {
    this.text = text;
  };
}

class Todos {
  @observable todos = new Map();

  @computed
  get total() {
    return [...this.todos.values()].filter(({ loading }) => !loading).length;
  }

  @computed
  get totalDone() {
    return [...this.todos.values()].filter(({ done }) => done).length;
  }

  getTodosByAuthorId = createTransformer(authorId => {
    const acc = [];

    for (const todo of todosStore.todos.values()) {
      if (todo.authorId === authorId) {
        acc.push(todo);
      }
    }

    return acc;
  });

  getTodoById = id => {
    if (!id) {
      return null;
    }

    return this.todos.get(id) || this.todos.set(id, new Todo({ id })).get(id);
  };

  @action
  allDone = () => {
    for (const todo of this.todos.values()) {
      todo.done = true;
    }
  };

  @action
  hydrate = todos => {
    todos.forEach(todo => {
      this.todos.set(todo.id, new Todo({ data: todo }));
    });
  };
}

const todosStore = new Todos();

export { Todo, Todos, todosStore };
