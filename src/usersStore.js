import { reaction, observable, decorate, action, computed } from "mobx";

const getUserData = id => {
  fetch(`https://www.example.com/get-user/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      name: id === "aaa" ? "Freddie" : "Marcelo"
    });
  });
};

class User {
  id;
  name;
  loading = true;

  constructor(id) {
    this.id = id;

    getUserData(id).then(({ name }) => {
      console.log("then", name);

      this.name = name;

      this.loading = false;
    });
  }
}
decorate(User, {
  name: observable,
  loading: observable
});

class Users {
  users = new Map();

  getUser(id) {
    if (this.users.has(id)) {
      return this.users.get(id);
    } else {
      this.users.set(id, new User(id));
      return this.users.get(id);
    }
  }
}
decorate(User, {
  users: observable,
  getUser: action
});

const usersStore = new Users();

export { User, Users, usersStore };
