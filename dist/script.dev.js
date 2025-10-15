"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskManager =
/*#__PURE__*/
function () {
  function TaskManager() {
    _classCallCheck(this, TaskManager);

    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  _createClass(TaskManager, [{
    key: "saveTasks",
    value: function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
  }, {
    key: "addTask",
    value: function addTask(task) {
      this.tasks.push(task);
      this.saveTasks();
    }
  }, {
    key: "removeTask",
    value: function removeTask(id) {
      this.tasks = this.tasks.filter(function (task) {
        return task.id !== id;
      });
      this.saveTasks();
    }
  }, {
    key: "toggleTask",
    value: function toggleTask(id) {
      var task = this.tasks.find(function (task) {
        return task.id === id;
      });
      if (task) task.toggled = !task.toggled;
      this.saveTasks();
    }
  }, {
    key: "filterTasks",
    value: function filterTasks(filter) {
      if (filter === "completed") return this.tasks.filter(function (t) {
        return t.toggled;
      });
      if (filter === "pending") return this.tasks.filter(function (t) {
        return !t.toggled;
      });
      return this.tasks;
    }
  }, {
    key: "getTasks",
    value: function getTasks() {
      return this.tasks;
    }
  }]);

  return TaskManager;
}();

var UI =
/*#__PURE__*/
function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, null, [{
    key: "renderTask",
    value: function renderTask(taskData) {
      var taskList = document.querySelector(".task-list");
      var taskItem = document.createElement("div");
      taskItem.className = "task-item";
      taskItem.setAttribute("data-id", taskData.id);
      var taskCheckbox = document.createElement("input");
      taskCheckbox.type = "checkbox";
      taskCheckbox.className = "task-checkbox";
      if (taskData.toggled) taskCheckbox.checked = true;
      var taskLabel = document.createElement("p");
      taskLabel.className = taskData.toggled ? "task-label completed" : "task-label";
      taskLabel.textContent = taskData.text;
      var deleteBtn = document.createElement("span");
      deleteBtn.className = "task-delete";
      deleteBtn.textContent = "[x]";
      taskItem.append(taskCheckbox, taskLabel, deleteBtn);
      taskList.appendChild(taskItem);
      requestAnimationFrame(function () {
        taskItem.style.animation = "fadeIn 0.3s ease forwards";
      });
      taskList.scrollTop = taskList.scrollHeight;
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      document.querySelector(".terminal-input").value = "";
    }
  }, {
    key: "deleteTask",
    value: function deleteTask(element) {
      element.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(function () {
        element.remove();
        var taskList = document.querySelector(".task-list");

        if (taskList.children.length === 0) {
          var emptyState = document.createElement("div");
          emptyState.className = "empty-state";
          emptyState.innerHTML = "\n          <p class=\"comment\">// no tasks found</p>\n          <p class=\"comment\">// add your first task above</p>\n        ";
          document.querySelector(".tasks-container").insertBefore(emptyState, taskList);
        }
      }, 300);
    }
  }, {
    key: "alertMessage",
    value: function alertMessage(message) {
      var div = document.createElement("div");
      div.className = "alert";
      div.textContent = message;
      var container = document.querySelector(".tasks-container");
      var form = document.querySelector(".task-list");
      container.insertBefore(div, form);
      requestAnimationFrame(function () {
        div.style.animation = "fadeIn 0.2s ease forwards";
      });
      setTimeout(function () {
        var alert = document.querySelector(".alert");

        if (alert) {
          alert.style.animation = "fadeOut 0.2s ease forwards";
          setTimeout(function () {
            return alert.remove();
          }, 200);
        }
      }, 2000);
    }
  }, {
    key: "updateFooterStats",
    value: function updateFooterStats(tasks) {
      var total = tasks.length;
      var completed = tasks.filter(function (t) {
        return t.toggled;
      }).length;
      var pending = total - completed;
      var totalEl = document.querySelector(".total-tasks");
      var completedEl = document.querySelector(".completed-tasks");
      var pendingEl = document.querySelector(".pending-tasks");
      if (totalEl) totalEl.textContent = total;
      if (completedEl) completedEl.textContent = completed;
      if (pendingEl) pendingEl.textContent = pending;
      var stats = document.querySelector(".stats");

      if (stats) {
        stats.style.animation = "pulse 0.3s ease";
        setTimeout(function () {
          stats.style.animation = "";
        }, 300);
      }
    }
  }]);

  return UI;
}();

var taskManager = new TaskManager(); // Load tasks

document.addEventListener("DOMContentLoaded", function () {
  var tasks = taskManager.getTasks();
  var emptyState = document.querySelector(".empty-state");
  if (tasks.length > 0 && emptyState) emptyState.remove();
  tasks.forEach(function (task) {
    return UI.renderTask(task);
  });
  UI.updateFooterStats(tasks);
}); // Add task

document.querySelector(".terminal-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    var input = document.querySelector(".terminal-input");
    var text = input.value.trim();
    if (!text) return UI.alertMessage("// Please enter a task");
    var taskData = {
      id: Date.now(),
      text: text,
      toggled: false
    };
    var emptyState = document.querySelector(".empty-state");
    if (emptyState) emptyState.remove();
    taskManager.addTask(taskData);
    UI.renderTask(taskData);
    UI.clearInput();
    UI.alertMessage("// Task added");
    UI.updateFooterStats(taskManager.getTasks());
  }
}); // Delete task

document.querySelector(".task-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("task-delete")) {
    var taskId = Number.parseInt(e.target.parentElement.getAttribute("data-id"));
    taskManager.removeTask(taskId);
    UI.deleteTask(e.target.parentElement);
    UI.alertMessage("// Task removed");
    UI.updateFooterStats(taskManager.getTasks());
  }
}); // Toggle task

document.querySelector(".task-list").addEventListener("change", function (e) {
  if (e.target.classList.contains("task-checkbox")) {
    var taskId = Number.parseInt(e.target.parentElement.getAttribute("data-id"));
    var label = e.target.nextElementSibling;
    label.classList.toggle("completed", e.target.checked);
    taskManager.toggleTask(taskId);
    UI.alertMessage("// Task status updated");
    UI.updateFooterStats(taskManager.getTasks());
  }
}); // Filter

document.querySelector(".btn-filter").addEventListener("click", function () {
  document.querySelector(".filter-options").classList.toggle("hidden");
});
document.querySelector(".filter-options").addEventListener("click", function (e) {
  e.preventDefault();
  var filter = e.target.textContent.toLowerCase();
  var filtered = taskManager.filterTasks(filter);
  var list = document.querySelector(".task-list");
  list.innerHTML = "";
  filtered.forEach(function (task) {
    return UI.renderTask(task);
  });
  UI.updateFooterStats(taskManager.getTasks());
  document.querySelector(".filter-options").classList.add("hidden");
});
//# sourceMappingURL=script.dev.js.map
