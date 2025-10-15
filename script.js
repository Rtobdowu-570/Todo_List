class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || []
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }

  addTask(task) {
    this.tasks.push(task)
    this.saveTasks()
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id)
    this.saveTasks()
  }

  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id)
    if (task) task.toggled = !task.toggled
    this.saveTasks()
  }

  filterTasks(filter) {
    if (filter === "completed") return this.tasks.filter((t) => t.toggled)
    if (filter === "pending") return this.tasks.filter((t) => !t.toggled)
    return this.tasks
  }

  getTasks() {
    return this.tasks
  }
}

class UI {
  static renderTask(taskData) {
    const taskList = document.querySelector(".task-list")
    const taskItem = document.createElement("div")
    taskItem.className = "task-item"
    taskItem.setAttribute("data-id", taskData.id)

    const taskCheckbox = document.createElement("input")
    taskCheckbox.type = "checkbox"
    taskCheckbox.className = "task-checkbox"
    if (taskData.toggled) taskCheckbox.checked = true

    const taskLabel = document.createElement("p")
    taskLabel.className = taskData.toggled ? "task-label completed" : "task-label"
    taskLabel.textContent = taskData.text

    const deleteBtn = document.createElement("span")
    deleteBtn.className = "task-delete"
    deleteBtn.textContent = "[x]"

    taskItem.append(taskCheckbox, taskLabel, deleteBtn)
    taskList.appendChild(taskItem)

    requestAnimationFrame(() => {
      taskItem.style.animation = "fadeIn 0.3s ease forwards"
    })

    taskList.scrollTop = taskList.scrollHeight
  }

  static clearInput() {
    document.querySelector(".terminal-input").value = ""
  }

  static deleteTask(element) {
    element.style.animation = "slideOut 0.3s ease forwards"
    setTimeout(() => {
      element.remove()
      const taskList = document.querySelector(".task-list")
      if (taskList.children.length === 0) {
        const emptyState = document.createElement("div")
        emptyState.className = "empty-state"
        emptyState.innerHTML = `
          <p class="comment">// no tasks found</p>
          <p class="comment">// add your first task above</p>
        `
        document.querySelector(".tasks-container").insertBefore(emptyState, taskList)
      }
    }, 300)
  }

  static alertMessage(message) {
    const div = document.createElement("div")
    div.className = "alert"
    div.textContent = message
    const container = document.querySelector(".tasks-container")
    const form = document.querySelector(".task-list")
    container.insertBefore(div, form)

    requestAnimationFrame(() => {
      div.style.animation = "fadeIn 0.2s ease forwards"
    })

    setTimeout(() => {
      const alert = document.querySelector(".alert")
      if (alert) {
        alert.style.animation = "fadeOut 0.2s ease forwards"
        setTimeout(() => alert.remove(), 200)
      }
    }, 2000)
  }

  static updateFooterStats(tasks) {
    const total = tasks.length
    const completed = tasks.filter((t) => t.toggled).length
    const pending = total - completed

    const totalEl = document.querySelector(".total-tasks")
    const completedEl = document.querySelector(".completed-tasks")
    const pendingEl = document.querySelector(".pending-tasks")

    if (totalEl) totalEl.textContent = total
    if (completedEl) completedEl.textContent = completed
    if (pendingEl) pendingEl.textContent = pending

    const stats = document.querySelector(".stats")
    if (stats) {
      stats.style.animation = "pulse 0.3s ease"
      setTimeout(() => {
        stats.style.animation = ""
      }, 300)
    }
  }
}

const taskManager = new TaskManager()

// Load tasks
document.addEventListener("DOMContentLoaded", () => {
  const tasks = taskManager.getTasks()
  const emptyState = document.querySelector(".empty-state")
  if (tasks.length > 0 && emptyState) emptyState.remove()
  tasks.forEach((task) => UI.renderTask(task))
  UI.updateFooterStats(tasks)
})

// Add task
document.querySelector(".terminal-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    const input = document.querySelector(".terminal-input")
    const text = input.value.trim()
    if (!text) return UI.alertMessage("// Please enter a task")

    const taskData = { id: Date.now(), text, toggled: false }
    const emptyState = document.querySelector(".empty-state")
    if (emptyState) emptyState.remove()

    taskManager.addTask(taskData)
    UI.renderTask(taskData)
    UI.clearInput()
    UI.alertMessage("// Task added")

    UI.updateFooterStats(taskManager.getTasks())
  }
})

// Delete task
document.querySelector(".task-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("task-delete")) {
    const taskId = Number.parseInt(e.target.parentElement.getAttribute("data-id"))
    taskManager.removeTask(taskId)
    UI.deleteTask(e.target.parentElement)
    UI.alertMessage("// Task removed")
    UI.updateFooterStats(taskManager.getTasks())
  }
})

// Toggle task
document.querySelector(".task-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const taskId = Number.parseInt(e.target.parentElement.getAttribute("data-id"))
    const label = e.target.nextElementSibling
    label.classList.toggle("completed", e.target.checked)
    taskManager.toggleTask(taskId)
    UI.alertMessage("// Task status updated")
    UI.updateFooterStats(taskManager.getTasks())
  }
})

// Filter
document.querySelector(".btn-filter").addEventListener("click", () => {
  document.querySelector(".filter-options").classList.toggle("hidden")
})

document.querySelector(".filter-options").addEventListener("click", (e) => {
  e.preventDefault()
  const filter = e.target.textContent.toLowerCase()
  const filtered = taskManager.filterTasks(filter)
  const list = document.querySelector(".task-list")
  list.innerHTML = ""
  filtered.forEach((task) => UI.renderTask(task))
  UI.updateFooterStats(taskManager.getTasks())
  document.querySelector(".filter-options").classList.add("hidden")
})
