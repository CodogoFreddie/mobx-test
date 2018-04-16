import { reaction, observable, decorate, action, computed } from "mobx";

const getTodoData = id =>
  new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      done: id === 2,
      text: `this is the text for todo ${id}`
    });
  });

class Todo {
  id;
  done;
  text;
  loading = true;
  shouldSave = true;

  constructor(id) {
    this.id = id;

    getTodoData(id).then(({ done, text }) => {
      this.shouldSave = false;
      this.loading = false;
      this.done = done;
      this.text = text;
      this.shouldSave = true;
    });

    reaction(
      () => this.constructForAPI(),
      () => {
        this.shouldSave && console.log(`update API for todo ${id} `);
      }
    );
  }

  toggleDone = () => {
    this.done = !this.done;
  };

  setText = text => {
    this.text = text;
  };

  constructForAPI = () => ({
    done: this.done,
    text: this.text
  });
}
decorate(Todo, {
  done: observable,
  text: observable,
  loading: observable,
  constructForAPI: observable,
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
}
decorate(Todos, {
  todo: observable,
  total: computed,
  totalDone: computed
});

export { Todo, Todos };
