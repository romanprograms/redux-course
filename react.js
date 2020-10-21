function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => props.toggle && props.toggle(item.id)}
            style={{ textDecoration: item.complete ? 'line-through' : 'none' }}
          >
            {item.name}
          </span>
          <button onClick={() => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  );
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    return API
            .saveTodo(this.input.value)
            .then(todo => {
              this.props.store.dispatch(addTodoAction(todo));
              this.input.value = '';
            })
            .catch(() => alert('An Error occured! Try again later!'));
   
  };
  removeItem = (todo) => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (id) => {
    this.props.store.dispatch(toggleTodoAction(id));
    return API.saveTodoToggle(id)
      .catch(() => {
        this.props.store.dispatch(toggleTodoAction(id));
        alert('An error occured! Try again !');
      })
  };

  render() {
    return (
      <div>
        <h1>Todo List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Todo</button>
        <List
          remove={this.removeItem}
          items={this.props.todos}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}
class Goals extends React.Component {
  addItem = (e) => {
  e.preventDefault();
  return API
          .saveGoal(this.input.value)
          .then(goal => {
            this.props.store.dispatch(addGoalAction(goal));
            this.input.value = '';
          })
          .catch(() => alert('An Error occured! Try again later!'));
  };
  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      this.props.store.dispatch(addGoalAction(goal))
      alert('Error occurred ! Try again !')
    });
  };

  render() {
    return (
      <div>
        <h1>Goals</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List remove={this.removeItem} items={this.props.goals} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    
    Promise
      .all([API.fetchTodos(), API.fetchGoals()])
      .then(([todos, goals]) => {
        store.dispatch(receiveDataAction(todos, goals));
      });
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const { store } = this.props;
    const { todos, goals, loading } = this.props.store.getState();
    if (loading) return <h3>Loading...</h3>
    return (
      <div>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('app'));