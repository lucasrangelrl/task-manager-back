const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.get("/test", (req, resp) => {
    resp.status(200).json({ success: true });
});

app.get("/tasks", async (req, resp) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks', (err, row) => {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        resp.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        resp.status(500).json({ error: 'Internal Server error' });
    }
});

app.post("/tasks", async (req, resp) => {
    const { description } = req.body;
    console.log("Request Body:", req.body);

    if (!description) {
        return resp.status(400).json({ error: 'Description is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run('INSERT INTO tasks (description) VALUES (?)', [description], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, description });
                }
            });
        });
        resp.status(200).json(result);
    } catch (err) {
        console.error(err.message);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/tasks/:id', async (req, resp) => {
    const { id } = req.params;
    const { description } = req.body;

    try {
        await new Promise((resolve, reject) => {
            db.run('UPDATE tasks SET description = ? WHERE id = ?', [description, id], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        resp.json({ id, description });
    } catch (err) {
        console.error(err.message);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/tasks/:id', async (req, resp) => {
    const { id } = req.params;

    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        resp.sendStatus(204);
    } catch (err) {
        console.error(err.message);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, function () {
    console.log("Server listening on port: 3000");
});

