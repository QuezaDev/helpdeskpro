const express = require("express")
const sql = require("mssql")
const cors = require("cors")
const bcrypt = require("bcrypt")

require("dotenv").config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Configuração do banco
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
}

// Conexão com SQL Server
sql.connect(config)
    .then(() => console.log("Conectado ao SQL Server"))
    .catch(err => console.log(err))


// ============================
// ROTAS DE CHAMADOS
// ============================

// Criar chamado
app.post("/chamados", async (req, res) => {

    const { titulo, descricao, prioridade } = req.body

    try {

        const pool = await sql.connect(config)

        const result = await pool.request()
            .input("titulo", titulo)
            .input("descricao", descricao)
            .input("prioridade", prioridade)
            .query(`
                INSERT INTO Chamados (titulo, descricao, prioridade, status)
                OUTPUT INSERTED.id
                VALUES (@titulo, @descricao, @prioridade, 'Aberto')
            `)

        const id = result.recordset[0].id
        const codigo = "TASK" + String(id).padStart(5, "0")

        res.json({ codigo })

    } 
        catch (err) {

        console.log(err)
        res.status(500).json({ erro: "Erro ao criar chamado" })

    }

})


// Listar chamados
app.get("/chamados", async (req, res) => {

    try {

        const pool = await sql.connect(config)

        const result = await pool.request()
            .query("SELECT * FROM Chamados ORDER BY id DESC")

        res.json(result.recordset)

    } catch (err) {

        console.log(err)
        res.status(500).send("Erro ao buscar chamados")

    }

})


// ============================
// ROTA DE LOGIN
// ============================

app.post("/login", async (req, res) => {

    const { username, senha } = req.body

    try{

        const pool = await sql.connect(config)

        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .query("SELECT * FROM Usuarios WHERE username = @username")

        if(result.recordset.length === 0){

            return res.json({success:false})

        }

        const usuario = result.recordset[0]

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if(senhaValida){

            res.json({
                success:true,
                user:usuario
            })

        }else{

            res.json({success:false})

        }

    }catch(err){

        console.log(err)
        res.status(500).send("Erro no login")

    }

})

app.post("/registro", async (req, res) => {

    const { username, senha } = req.body

    if(!username || !senha){
        return res.json({
            success:false,
            mensagem:"Usuário e senha são obrigatórios"
        })
    }

    try{

        const pool = await sql.connect(config)

        const verifica = await pool.request()
            .input("username", sql.VarChar, username)
            .query("SELECT * FROM Usuarios WHERE username = @username")

        if(verifica.recordset.length > 0){
            return res.json({success:false})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        await pool.request()
            .input("username", sql.VarChar, username)
            .input("senha", sql.VarChar, senhaHash)
            .query(`
                INSERT INTO Usuarios (username, senha, tipo)
                VALUES (@username, @senha, 'usuario')
            `)

        res.json({success:true})

    }catch(err){

        console.log(err)

        res.status(500).json({
            success:false,
            error:"Erro ao registrar"
        })

    }

})


// ============================
// INICIAR SERVIDOR
// ============================

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})