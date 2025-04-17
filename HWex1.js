const userList = document.getElementById("user-list");

fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("user");

      const name = document.createElement("strong");
      name.textContent = user.name;

      const button = document.createElement("button");
      button.textContent = "Show Tasks";
      button.addEventListener("click", () => loadTodos(user.id, userDiv));

      userDiv.appendChild(name);
      const space = document.createTextNode("\u00A0");
      userDiv.appendChild(space);
      userDiv.appendChild(button);

      userList.appendChild(userDiv);
    });
  });

function loadTodos(userId, userContainer) {
  let existingUserContainer = userContainer.querySelector(".todos");
  if (existingUserContainer) {
    existingUserContainer.remove();
  }

  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading");
  loadingIndicator.textContent = "Loading tasks...";
  userContainer.appendChild(loadingIndicator);

  fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
    .then((response) => response.json())
    .then((todos) => {
      loadingIndicator.remove();

      const todoList = document.createElement("ul");
      todoList.classList.add("todos");

      todos.forEach((todo) => {
        const item = document.createElement("li");
        const statusText = todo.completed ? "[Completed]" : "[Not completed]";
        item.textContent = `${todo.title} ${statusText}`;
        todoList.appendChild(item);
      });

      userContainer.appendChild(todoList);
    })
    .catch((error) => {
      loadingIndicator.textContent = "Failed to load tasks.";
    });
}