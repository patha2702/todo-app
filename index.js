const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs/promises")
const path = require("path")


const app = express()
const PORT = 3000 || process.env.port

app.use(bodyParser.json())
app.use(express.static("public"))

app.get("/todos", (req, res) => {
    fs.readFile(path.join(__dirname, "storage.json"), "utf8").then(data => {
        res.status(200).send(JSON.parse(data))
    })
})

app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    fs.readFile(path.join(__dirname, "storage.json"), "utf8").then(data => {
        const todos = JSON.parse(data)
        const indexOfTodo = getTodoIndex(todos, parseInt(id))
        if (indexOfTodo !== -1) {
            res.status(200).send(todos[indexOfTodo])
        } else {
            res.status(404).send()
        }
    })
})

app.post("/todos", (req, res) => {
    const todo = {
        id : Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description: req.body.description,
        completed: false
    }
    fs.readFile(path.join(__dirname, "storage.json"), "utf8").then(data => {
        const todos = JSON.parse(data)
        todos.push(todo)
        fs.writeFile(path.join(__dirname, "storage.json"), JSON.stringify(todos))
        res.status(201).send(todo)
    })
})

app.put("/todos/:id", (req, res) => {
    const id = req.params.id
    fs.readFile(path.join(__dirname, "storage.json"), "utf8").then(data => {
        const todos = JSON.parse(data)
        const indexOfTodo = getTodoIndex(todos, parseInt(id))
        if (indexOfTodo !== -1) {
            todos[indexOfTodo] = {...todos[indexOfTodo], ...req.body}
            fs.writeFile(path.join(__dirname, "storage.json"), JSON.stringify(todos))
            res.status(200).send()
        } else {
            res.status(404).send()
        }
    })
})

app.delete("/todos/:id", (req, res) => {
    const id = req.params.id
    fs.readFile(path.join(__dirname, "storage.json"), "utf8").then(data => {
        let todos = JSON.parse(data)
        const indexOfTodo = getTodoIndex(todos, parseInt(id))
        if (indexOfTodo !== -1) {
            todos = removeTodo(todos, parseInt(id))
            fs.writeFile(path.join(__dirname, "storage.json"), JSON.stringify(todos))
            res.status(200).send()
        } else {
            res.status(404).send()
        }
    })
})

function removeTodo(todoList, id) {
    const updatedTodo = todoList.filter(todo => {
        return todo.id !== id
    })
    return updatedTodo
}

function getTodoIndex(todoList, id) {
    let todoIndex = -1
    todoList.forEach((todo, index) => {
        if (todo.id === id) {
            todoIndex = index
        }
    })
    return todoIndex
}

app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server running on port: ${PORT}`)
})