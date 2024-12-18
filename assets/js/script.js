const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskInvalid = document.getElementById("task-invalid");
const taskList = document.getElementById("task-list");
const btnTasksClearAll = document.getElementById("btn-tasks-clear-all");
const searchInput = document.getElementById("search-input");
const noTaskMessage = document.getElementById("no-task-message");
const taskFilter = document.getElementById("task-filter");
const closeButton = document.querySelector(".close-modal");
const modal = document.querySelector(".modall");
const backDrop = document.querySelector(".backdrop");
const removeButton = document.querySelector(".remove-item");
const modalRemoveAll = document.getElementById("modal-remove-all");
const removeAllItems = document.getElementById("remove-all-items");
const cancelRemoveAll = document.getElementById("cancel-remove-all");
const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const confirmEdit = document.querySelector(".confirm-edit");
const cancelEdit = document.querySelector(".cancel-edit");
let todos = [];
let filterValue = "all";
let currentTaskId = null;

function onLoadTasksList() {
  let items = getFromStorage();
  createTask(items);
  checkUI();
}

function onSubmitTask(e) {
  e.preventDefault();

  if (!taskInput.value) {
    taskInvalid.textContent = "چیزی برای ثبت وجود ندارد";
    return;
  } else {
    taskInvalid.textContent = "";
  }

  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: taskInput.value,
    isCompleted: false,
  };

  todos.push(newTodo);

  saveToStorage(newTodo);
  onFilterTasks();

  checkUI();
}

function createTask(todos) {
  let result = "";

  todos.forEach((todo) => {
    result += `<li
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div class="d-flex align-items-center gap-1">
                    <i data-todo-id = ${todo.id} ${
      todo.isCompleted
        ? `class = "bi bi-check-square check-el"`
        : `class = "bi bi-square uncheck-el"`
    }></i>
                    <span data-todo-id = ${
                      todo.id
                    } style="outline: 0 !important" ${
      todo.isCompleted ? `class = "completed"` : `class = ""`
    }
                      >${todo.title}</span
                    >
                  </div>
                  <div class="d-flex align-items-center gap-3">
                  <span class="creation-date">${new Date(
                    todo.createdAt
                  ).toLocaleDateString("Fa-IR")}</span>
                    <i data-todo-id = ${
                      todo.id
                    } class="bi bi-pencil-square edit-el"></i>
                    <i data-todo-id = ${
                      todo.id
                    } class="bi bi-trash rm-el text-danger"></i>
                  </div>
                </li> `;
  });

  taskList.innerHTML = result;
  taskInput.value = "";
}

function checkUI() {
  let items = taskList.querySelectorAll("li");

  if (items.length == 0) {
    searchInput.style.display = "none";
    btnTasksClearAll.style.display = "none";
    noTaskMessage.style.display = "block";
  } else {
    searchInput.style.display = "block";
    btnTasksClearAll.style.display = "block";
    noTaskMessage.style.display = "none";
  }
}

function onClearAllTasks() {
  modalRemoveAll.classList.remove("hidden");
  backDrop.classList.remove("hidden");
}

function onRemoveAllItems() {
  taskList.innerHTML = "";
  todos = [];
  localStorage.removeItem("todos");
  checkUI();
  modalRemoveAll.classList.add("hidden");
  backDrop.classList.add("hidden");
}

function onFilterTasks() {
  todos = getFromStorage();

  switch (filterValue) {
    case "all": {
      createTask(todos);
      break;
    }
    case "completed": {
      const filteredTasks = todos.filter((t) => t.isCompleted);
      createTask(filteredTasks);
      break;
    }
    case "uncompleted": {
      const filteredTasks = todos.filter((t) => !t.isCompleted);
      createTask(filteredTasks);
      break;
    }
  }
}

function onClickHandler(e) {
  const todoId = Number(e.target.dataset.todoId);
  function storageCheck() {
    let items = getFromStorage();
    items.forEach((item) => {
      if (item.id == todoId) {
        item.isCompleted
          ? (item.isCompleted = false)
          : (item.isCompleted = true);
      }
    });
    localStorage.setItem("todos", JSON.stringify(items));
  }

  if (e.target.classList.contains("rm-el")) {
    modal.classList.remove("hidden");
    backDrop.classList.remove("hidden");
    currentTaskId = todoId; // Store the ID of the task to be removed
  }

  if (e.target.classList.contains("uncheck-el")) {
    e.target.className = "bi bi-check-square check-el";
    e.target.parentElement.childNodes[3].classList = "completed";

    todos.forEach((t) => {
      if (t.id == todoId) {
        t.isCompleted = true;
      }
    });
    storageCheck();
  } else if (e.target.classList.contains("check-el")) {
    e.target.className = "bi bi-square uncheck-el";
    e.target.parentElement.childNodes[3].classList = "";

    todos.forEach((t) => {
      if (t.id == todoId) {
        t.isCompleted = false;
      }
    });
    storageCheck();
  }
  onFilterTasks();
  checkUI();
}

function onEditModal(e) {
  const todoId = Number(e.target.dataset.todoId);
  currentTaskId = todoId;
  if (e.target.classList.contains("edit-el")) {
    editModal.classList.remove("hidden");
    backDrop.classList.remove("hidden");
    const taskElement = document
      .querySelector(`i[data-todo-id="${currentTaskId}"]`)
      .closest("li");

    editInput.value = taskElement.childNodes[1].childNodes[3].textContent;
  }
}

function storageEdit() {
  let items = getFromStorage();
  items.forEach((item) => {
    if (item.id == currentTaskId) {
      if (editInput.value !== "") {
        item.title = editInput.value;
      }
    }
  });
  localStorage.setItem("todos", JSON.stringify(items));
}

function onEditTask() {
  if (currentTaskId !== null) {
    const taskElement = document
      .querySelector(`i[data-todo-id="${currentTaskId}"]`)
      .closest("li");
    if (editInput.value !== "") {
      taskElement.childNodes[1].childNodes[3].textContent = editInput.value;
    }

    todos.forEach((todo) => {
      if (editInput !== "") {
        if (todo.id == currentTaskId) {
          todo.title = editInput.value;
        }
      }
    });
    storageEdit();
    editInput.value = "";
    checkUI();
    currentTaskId = null;
  }
  editModal.classList.add("hidden");
  backDrop.classList.add("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  backDrop.classList.add("hidden");
  currentTaskId = null;
}

function onLoadTasksList() {
  let items = getFromStorage();
  createTask(items);
  checkUI();
}

function getFromStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTasks;
}

function saveToStorage(task) {
  let savedTasks = getFromStorage();
  savedTasks.push(task);
  localStorage.setItem("todos", JSON.stringify(savedTasks));
}

function removeFromStorage(taskId) {
  let items = getFromStorage();
  items = items.filter((item) => item.id !== taskId);
  localStorage.setItem("todos", JSON.stringify(items));
}

function onSearch(e) {
  let textInput = e.target.value.toLowerCase();
  let items = taskList.querySelectorAll("li");

  items.forEach((item) => {
    let tasksContent =
      item.childNodes[1].childNodes[3].textContent.toLowerCase();
    if (tasksContent.indexOf(textInput) != -1) {
      item.style.setProperty("display", "flex", "important");
    } else {
      item.style.setProperty("display", "none", "important");
    }
  });
}

function onCloseModal() {
  modal.classList.add("hidden");
  backDrop.classList.add("hidden");
  currentTaskId = null; // Reset the current task ID
}

function onRemoveItem() {
  if (currentTaskId !== null) {
    const taskElement = document
      .querySelector(`i[data-todo-id="${currentTaskId}"]`)
      .closest("li");
    taskElement.remove();
    todos = todos.filter((t) => t.id !== currentTaskId);
    removeFromStorage(currentTaskId);
    checkUI();
    currentTaskId = null; // Reset the current task ID
  }
  modal.classList.add("hidden");
  backDrop.classList.add("hidden");
}

function onCloseAllRemoveModal() {
  modal.classList.add("hidden");
  modalRemoveAll.classList.add("hidden");
  backDrop.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", onLoadTasksList);
taskForm.addEventListener("submit", onSubmitTask);
btnTasksClearAll.addEventListener("click", onClearAllTasks);
taskFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  onFilterTasks();
});
taskList.addEventListener("click", onClickHandler);
taskList.addEventListener("click", onEditModal);
searchInput.addEventListener("input", onSearch);
closeButton.addEventListener("click", onCloseModal);
backDrop.addEventListener("click", onCloseAllRemoveModal);
backDrop.addEventListener("click", closeEditModal);
cancelEdit.addEventListener("click", closeEditModal);
confirmEdit.addEventListener("click", onEditTask);
removeButton.addEventListener("click", onRemoveItem);
removeAllItems.addEventListener("click", onRemoveAllItems);
cancelRemoveAll.addEventListener("click", onCloseAllRemoveModal);

checkUI();
