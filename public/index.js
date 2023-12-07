async function handleAddTodo() {
    const titleEl = document.querySelector("#title")
    const descriptionEl = document.querySelector("#description")
    const title = titleEl.value
    const description = descriptionEl.value
    const todoObject = {
        title: title,
        description: description
    }
    await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todoObject)
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)
    })
    renderTodos()
    titleEl.value = ""
    descriptionEl.value = ""
}

function render(data) {
    const html = data.map(todo => {
        return `
        <div class="todo">
            <input type="checkbox" class="checkbox">
            <div>
                <p>Title: ${todo.title}</p>
                <p>Description: ${todo.description}</p>
            </div>
        </div>
    `
    }).join("")
    const todoListEl = document.querySelector(".lists-container")
    todoListEl.innerHTML = html
}

async function renderTodos() {
    await fetch("http://localhost:3000/todos", {
        method: "GET"
    }).then(res => {
        return res.json()
    }).then(data => {
        render(data)
    })
}