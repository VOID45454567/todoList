import addTask from "./CRUD/addTask.js";
import getTasks from "./CRUD/getTasks.js";
import deleteTask from "./CRUD/deleteTask.js";
import updateTask from "./CRUD/updateTask.js";
const btnAddTaskEl = document.getElementById("btnAddCard");
const dialogAddTaskEl = document.getElementById("addTaskDialog");
const overlayEl = document.getElementById("overlay");
const sendBtnEl = document.getElementById("send");
const URL = "http://localhost:3000/tasks";
async function getData() {
  const data = await getTasks(URL);
  return data;
}
let data = await getData();

function showModal() {
  dialogAddTaskEl.showModal();
  overlayEl.style.display = "block";
  displayRemainingChars();
}
btnAddTaskEl.addEventListener("click", showModal);
function displayRemainingChars() {
  const remainingTitleEl = document.getElementById("remaining-title");
  const remainingDescriptionEl = document.getElementById(
    "remaining-description"
  );
  const maxCharsTitle = 25;
  const maxCharsDescription = 75;
  const titleInput = document.getElementById("inputForTitle");
  const descriptionInput = document.getElementById("inputForDescription");

  const updateRemainingChars = (input, remainingEl, maxChars) => {
    const remainingChars = maxChars - input.value.length;
    remainingEl.textContent = `Осталось: ${remainingChars}`;

    if (remainingChars < 0) {
      input.value = input.value.substring(0, maxChars);
    }
  };

  titleInput.addEventListener("input", () =>
    updateRemainingChars(titleInput, remainingTitleEl, maxCharsTitle)
  );
  descriptionInput.addEventListener("input", () =>
    updateRemainingChars(
      descriptionInput,
      remainingDescriptionEl,
      maxCharsDescription
    )
  );

  updateRemainingChars(titleInput, remainingTitleEl, maxCharsTitle);
  updateRemainingChars(
    descriptionInput,
    remainingDescriptionEl,
    maxCharsDescription
  );
}

function getTaskTemplate(data) {
  if (!data || !data.title || !data.description) {
    return "";
  }
  return `<div class="card" draggable="true" data-id="${data.id}">
            <div class="title-DeleteButton">
              <h3 id="title">${data.title}</h3>
              <button id="deleteCardBtn" data-id="${data.id}">Удалить запись</button>
            </div>
            <p id="description">${data.description}</p>
          </div>`;
}
sendBtnEl.addEventListener("click", () => {
  const titleInput = document.getElementById("inputForTitle");
  const descriptionInput = document.getElementById("inputForDescription");
  if (titleInput.value.length === 0 && descriptionInput.value.length === 0) {
    return 0;
  }
  let task = {
    title: titleInput.value,
    description: descriptionInput.value
  };
  addTask(task, URL);
  renderTasks(data);
});
const container = document.querySelector(".cards-container");
function renderTasks(array) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    container.insertAdjacentHTML("beforeend", getTaskTemplate(array[i]));
  }
}
renderTasks(data);
container.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.dataset.id;
    const userResponse = confirm("Подтвердить удаление записи?");
    if (userResponse) {
      deleteTask(id, URL);
    } else {
      return 0;
    }
  }
});
function dragElements() {
  const elements = document.querySelectorAll(".card");
  const checkboxInput = document.querySelector(".checkbox-input");
  const messageContainer = document.querySelector(".messageContainer");
  messageContainer.style.color = "red";
  let draggedElement = null;

  elements.forEach((element) => {
    element.addEventListener("dragstart", (e) => {
      if (!checkboxInput.checked) {
        messageContainer.textContent =
          "Перетаскивание отключено. Включите опцию 'Click&drag'.";
        e.preventDefault();
        return;
      }
      messageContainer.textContent = "";
      draggedElement = element;
    });

    element.addEventListener("dragend", () => {
      draggedElement = null;
    });

    element.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    element.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedElement) {
        if (element !== draggedElement) {
          const draggedId = draggedElement.dataset.id;
          const targetId = element.dataset.id;

          const draggedTitle =
            draggedElement.querySelector("#title").textContent;
          const draggedDescription =
            draggedElement.querySelector("#description").textContent;

          const targetTitle = element.querySelector("#title").textContent;
          const targetDescription =
            element.querySelector("#description").textContent;

          updateTask(draggedId, URL, {
            title: targetTitle,
            description: targetDescription
          });

          updateTask(targetId, URL, {
            title: draggedTitle,
            description: draggedDescription
          });
        }
      }
    });
  });

  const buttons = document.querySelectorAll(".title-DeleteButton, #title");
  buttons.forEach((button) => {
    button.addEventListener("dragstart", (e) => {
      e.stopPropagation();
    });
  });
}
dragElements();
