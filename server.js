const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

app.get("/api/contacts", (req, res) => {

    db.query(
        "SELECT * FROM contactos",
        (err, results) => {

            if (err) {

                return res.send("Hubo un error en la consulta de contactos");
            }

            res.json(results);
        }
    );
});

app.post("/api/contacts", (req, res) => {

    const {
        name,
        lastName,
        gender,
        phone,
        city,
        address
    } = req.body;

    const sql = `
        INSERT INTO contactos
        (
            name,
            lastName,
            gender,
            phone,
            city,
            address
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            lastName,
            gender,
            phone,
            city,
            address
        ],
        (err, result) => {

            if (err) {

                return res.send("Hubo un error al crear el contacto");
            }

            res.json({
                id: result.insertId,
                name,
                lastName,
                gender,
                phone,
                city,
                address
            });
        }
    );
});

app.put("/api/contacts/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        lastName,
        gender,
        phone,
        city,
        address
    } = req.body;

    const sql = `
        UPDATE contactos
        SET
            name = ?,
            lastName = ?,
            gender = ?,
            phone = ?,
            city = ?,
            address = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            lastName,
            gender,
            phone,
            city,
            address,
            id
        ],
        (err) => {

            if (err) {

                return res.send("Hubo un error al actualizar el contacto");
            }

            res.json({
                message: "Contact updated"
            });
        }
    );
});


app.delete("/api/contacts/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM contactos WHERE id = ?",
        [id],
        (err) => {

            if (err) {

                return res.send("Hubo un error al eliminar el contacto");
            }

            res.json({
                message: "Contact deleted"
            });
        }
    );
});

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );
});