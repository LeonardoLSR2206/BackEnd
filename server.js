// Importar bibliotecas
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcrypt");

// Configurar servidor
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// Criar banco sqlite3
const db = new sqlite3.Database("./database.db");

// Criar tabela usuários
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT
    )
`);

// Cadastrar usuário
app.post("/usuarios", async (req, res) => {
    console.log(req.body);

    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;

    let senhaHash = await bcrypt.hash(senha, 10);
    console.log(senhaHash);

    // Inserir no banco de dados
    db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
        [nome, email, senhaHash],

        res.json({
            id: this.lastID,
            nome,
            email
        })
    )
});

// Listar todos os usuários
app.get("/usuarios", (req, res) => {
    db.all(`SELECT id, nome, email FROM usuarios`, [], (err, rows) => {
        res.json(rows)
    })
})

// Selecionar um usuário
app.get("/usuarios/:id", (req, res) => {
    let idUsuario = req.params.id;

    db.get(`SELECT id, nome, email FROM usuarios 
    WHERE id = ?`,
    [idUsuario], (err, result) => {
        if(result){
            res.json(result)
        } else {
            res.status(404).json({
                "message" : "Usuário não encontrado."
            })
        }
    })
})

// Deletar usuário
app.delete("/usuarios/:id", (req, res) => {
    let idUsuario = req.params.id

    db.run(`DELETE FROM usuarios WHERE id = ?`, [idUsuario], function() {
        if(this.changes === 0){
            return res.status(404).json({
                "message" : "Usuário não encontrado."
            })
        }

        res.json({
            "message" : "Usuário deletado."
        })
    })
})

// Iniciar o server
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))