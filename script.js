let tasksMainList = [
  {
    title: "Learn Javascript",
    description: "Master the language powering the modern web",
    startDate: "07-07-2024",
    id: 1,
    completed: false,
  },
  {
    title: "Practice Javascript",
    description: "Master the language powering the modern web",
    startDate: "01-05-2024",
    id: 2,
    completed: true,
  },
  {
    title: "Hands-on Javascript",
    description: "Master the language powering the modern web",
    startDate: "08-03-2024",
    id: 3,
    completed: false,
  },
  {
    title: "Theory Javascript",
    description: "Master the language powering the modern web",
    startDate: "07-07-2023",
    id: 4,
    completed: false,
  },
];

let taskToUpdate = null;

let tasksList = tasksMainList.slice(0, 4);
$(() => {
  const today = new Date();

  generateCalender(today.getFullYear(), today.getMonth());

  $("#addNewTask").on("submit", (event) => {
    event.preventDefault();
    if (taskToUpdate) {
      updateTask();
      taskToUpdate = null;
    } else {
      addNewTask();
      tasksList = tasksMainList.slice(0, 4);
    }

    generateTasksList();
    setCompletedPending();
  });

  generateTasksList();

  setCompletedPending();
});

function loadMore() {
  tasksList.push(
    ...tasksMainList.slice(tasksList.length, tasksList.length + 4)
  );
  generateTasksList();
}

function generateTasksList() {
  $("#todo-list").html(
    tasksList
      .map(
        (task) => `
          <div class="container ${task.completed ? "completed" : ""}">
          <div class="left">
            <h4>${task.title}</h4>
            <span>${task.description}</span>
            <h4>Start Date: ${task.startDate}</h4>
          </div>
          <div class="right">
           <button onclick="completeTask(${
             task.id
           })"><i class="fa-solid fa-check-circle"></i></button>
              <button onclick="editTask(${
                task.id
              })"><i class="fa-solid fa-pen-to-square"></i></button>
              <button onclick="deleteTask(${
                task.id
              })"><i class="fa-solid fa-trash"></i></button>
           </div>
          </div>
        `
      )
      .join("")
  );
}

function sortByCategory(orderby) {
  tasksMainList.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (orderby === "asc") {
      return titleA < titleB ? -1 : titleB < titleA ? 1 : 0;
    } else {
      return titleA < titleB ? 1 : titleB < titleA ? -1 : 0;
    }
  });

  tasksList = tasksMainList.slice(0, tasksList.length);

  generateTasksList();
}

function sortByDate(orderby) {
  tasksMainList.sort((a, b) => {
    if (orderby === "asc") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else {
      return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  tasksList = tasksMainList.slice(0, tasksList.length);

  generateTasksList();
}

function generateCalender(year, month) {
  const today = new Date();
  let selectedDate = null;

  $("#day").text(
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(today)
  );

  $("#date").text(
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(today)
  );

  $("#dates").empty();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  $("#monthYear").text(
    new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(year, month))
  );

  for (let i = 0; i < firstDay; i++) {
    $("#dates").append("<div></div>");
  }

  for (let date = 1; date <= lastDay; date++) {
    let dateCell = $("<div>").text(date);

    if (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dateCell.addClass("selected");
    }

    dateCell.click(function () {
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
      selectedDate = $(this);
    });

    $("#dates").append(dateCell);
  }
}

function search(value) {
  const searchValue = value.toLowerCase().trim();

  tasksList = tasksMainList.filter(
    (data) =>
      data.title.toLowerCase().includes(searchValue) ||
      data.description.toLowerCase().includes(searchValue)
  );

  generateTasksList();
}

function setCompletedPending() {
  let completedTasks = tasksMainList.reduce((acc, data) => {
    return (acc += data.completed ? 1 : 0);
  }, 0);

  let pendingTasks = tasksMainList.reduce((acc, data) => {
    return (acc += data.completed ? 0 : 1);
  }, 0);
  $("#completedTasks").text(completedTasks);
  $("#pendingTasks").text(pendingTasks);
}

function addNewTask() {
  const taskTitle = $("#taskTitle").val();
  const taskDesc = $("#taskDesc").val();

  tasksMainList.unshift({
    title: taskTitle,
    description: taskDesc,
    startDate: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    id: tasksMainList.length + 1,
    completed: false,
  });

  $("#taskTitle").val("");
  $("#taskDesc").val("");
}

function updateTask() {
  const record = tasksList.find((data) => data.id === taskToUpdate);

  record.title = $("#taskTitle").val();
  record.description = $("#taskDesc").val();

  $("#taskTitle").val("");
  $("#taskDesc").val("");
}

function completeTask(id) {
  $(`#todo-list .container:nth-of-type(${id})`).addClass("completed");
  tasksList.find((rec) => rec.id === id).completed = true;
  setCompletedPending();
}

function editTask(id) {
  const { title, description } = tasksList.find((rec) => rec.id === id);
  $("#taskTitle").val(title);
  $("#taskDesc").val(description);
  taskToUpdate = id;
}

function deleteTask(id) {
  tasksMainList = tasksMainList.filter((data) => data.id !== id);
  tasksList = tasksMainList.slice(0, 4);
  generateTasksList();
}
