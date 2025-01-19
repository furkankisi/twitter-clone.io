// let tasks = [];

// if (localStorage.tasks) {
//   tasks = JSON.parse(localStorage.tasks);
// }
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function render(type = "uncompleted") {
  // TODO: Taskların son eklenenleri en üste gelecek şekilde sıralansın
  // ekrana html formatını üreten metodumuz
  taskList.innerHTML = ""; // daha önceden eklenmiş olan todoların tekrar ekranda listelenmesini engellemek için kullanıyoruz.
  if (type === "uncompleted") {
    showUncompleted.classList.add("active");
    showCompleted.classList.remove("active");
    const filteredTasks = tasks.reverse().filter((task) => !task.isCompleted);
    if (filteredTasks.length === 0) {
      taskList.innerHTML = "Tamamlanmayan görev yok.";
      return;
    }
    for (const task of filteredTasks) {
      // güncel olan tasks dizisinin tüm elemanlarını ekrana yazdırıyor
      taskList.innerHTML += `
      <div class="taskItem">
        <div>
          <button data-id="${task.id}" class="btn markCompleteBtn"></button>
        <span data-id="${task.id}" contenteditable="true" class="taskTitle">${task.title}</span> 
        </div>
        <i data-id="${task.id}" class="fas fa-trash btn deleteTaskBtn"></i>
      </div>
      `;
    }
  } else {
    showCompleted.classList.add("active");
    showUncompleted.classList.remove("active");
    const filteredTasks = tasks.reverse().filter((task) => task.isCompleted);
    if (filteredTasks.length === 0) {
      taskList.innerHTML = "Hiç tamamlanmış görev görev yok.";
      return;
    }
    for (const task of filteredTasks) {
      // güncel olan tasks dizisinin tüm elemanlarını ekrana yazdırıyor
      taskList.innerHTML += `
      <div class="taskItem">
        <div>
        <button data-id="${task.id}" class="btn markCompleteBtn" style="background-color:green;"></button>
        <span data-id="${task.id}" contenteditable="true" class="taskTitle">${task.title}</span>
        </div>
        <i data-id="${task.id}" class="fas fa-trash btn deleteTaskBtn"></i>
      </div>
      `;
    }
  }

  //   completedTaskList.innerHTML = "";
  //   for (const task of tasks.filter((task) => task.isCompleted)) {
  //     completedTaskList.innerHTML += `
  //         <li>
  //             <del>${task.title}</del>,
  //             <button data-id="${task.id}" class="markCompleteBtn">Tamamlanmadı olarak işaretle</button>
  //         </li> `;
  //   }
  bindElements();
}

function bindElements() {
  const markCompleteBtns = document.querySelectorAll(".markCompleteBtn");
  const deleteTaskBtns = document.querySelectorAll(".deleteTaskBtn");
  const taskTitles = document.querySelectorAll(".taskTitle");
  for (const taskTitle of taskTitles) {
    taskTitle.addEventListener("focusout", function (e) {
      findedTask = tasks.find((task) => task.id == e.target.dataset.id);
      findedTask.title = e.target.textContent;
      localStorage.tasks = JSON.stringify(tasks);
    });
  }
  for (const markCompleteBtn of markCompleteBtns) {
    markCompleteBtn.addEventListener("click", function (e) {
      console.log(e.target.dataset.id);
      const findedTask = tasks.find((task) => task.id == e.target.dataset.id); // datasetden gelen id ile kullanıcının hangi taskı tamamlamak istediğini yakaladık
      // findedTask.isCompleted = true; // yakalanan taskın isCompleted değerini true yaptık
      if (findedTask.isCompleted) {
        findedTask.isCompleted = false;
        localStorage.tasks = JSON.stringify(tasks);
        render("completed");
      } else {
        findedTask.isCompleted = true;
        localStorage.tasks = JSON.stringify(tasks);
        render();
      }
      // render(); // güncel değerlerin kullanıcı ekranında görünebilmesi için sayfayı tekrar render eden metodumuzu çağırıyoruz
    });
  }

  for (const deleteTaskBtn of deleteTaskBtns) {
    deleteTaskBtn.addEventListener("click", function (e) {
      e.preventDefault();
      deleteTask(e.target.dataset.id);
    });
  }
}

showCompleted.addEventListener("click", function () {
  render("completed");
});

showUncompleted.addEventListener("click", function () {
  render();
});

render(); // ilk başta çağırmamızın amacı hali hazırda tasks dizisinde bulunan taskları ekranda gösterebilmektir.

function deleteTask(id) {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    const task = tasks.find((task) => task.id == id);
    const taskIndex = tasks.findIndex((task) => task.id == id);
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    task.isCompleted ? render("completed") : render();
  }
}

newTaskBtn.addEventListener("click", function (e) {
  newTaskBtn.style.display = "none";
  newTaskForm.style.display = "block";
  newTaskInput.focus();
});

newTaskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(e.target);
  // const formData = new FormData(e.target);
  // const formObj = Object.fromEntries(formData);
  const formObj = Object.fromEntries(new FormData(e.target));
  let newId = 1;
  if (tasks[tasks.length - 1]) {
    newId = tasks[tasks.length - 1].id + 1;
  }

  const newTask = {
    id: newId,
    title: formObj.task,
    isCompleted: false,
  };
  tasks.push(newTask); // tasks dizisine kullanıcının girdiği taskı ekliyoruz
  localStorage.tasks = JSON.stringify(tasks);
  e.target.reset();
  newTaskBtn.style.display = "block";
  newTaskForm.style.display = "none";
  render();
});
