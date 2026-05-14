let chamadoAtual = null

// ============================
// USUÁRIO LOGADO
// ============================

const usuario = JSON.parse(localStorage.getItem("usuario"))

if (usuario && document.getElementById("usuarioLogado")) {
    document.getElementById("usuarioLogado").innerText =
        "Usuário: " + usuario.username
}


// ============================
// POPUP DE CRIAÇÃO DE CHAMADO
// ============================

function abrirPopup() {

    document.getElementById("popupChamado").style.display = "flex"

}

function fecharPopup() {

    document.getElementById("popupChamado").style.display = "none"

    limparFormulario()

}


// ============================
// CRIAR CHAMADO
// ============================

async function criarChamado() {

    const titulo = document.getElementById("titulo").value
    const descricao = document.getElementById("descricao").value
    const prioridade = document.getElementById("prioridade").value

    const response = await fetch("http://localhost:3000/chamados", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            titulo,
            descricao,
            prioridade
        })

    })

    const data = await response.json()

    alert("Chamado criado com sucesso! Código: " + data.codigo)

    fecharPopup()

    carregarChamados()

}


// ============================
// LIMPAR FORMULÁRIO
// ============================

function limparFormulario() {

    document.getElementById("titulo").value = ""
    document.getElementById("descricao").value = ""
    document.getElementById("prioridade").value = "Baixa"

}


// ============================
// LOGOUT
// ============================

function logout() {

    localStorage.removeItem("usuario")

    window.location.href = "login.html"

}


// ============================
// CARREGAR CHAMADOS
// ============================

async function carregarChamados(){

    try{

        const response = await fetch("http://localhost:3000/chamados")
        const chamados = await response.json()

        const aberto = document.getElementById("aberto")
        const andamento = document.getElementById("andamento")
        const concluido = document.getElementById("concluido")

        aberto.innerHTML = ""
        andamento.innerHTML = ""
        concluido.innerHTML = ""

        let countAberto = 0
        let countAndamento = 0
        let countConcluido = 0

        chamados.forEach(chamado => {

        const card = document.createElement("div")
        card.className = "card"

        card.innerHTML = `
            <strong>TASK${String(chamado.id).padStart(5,"0")}</strong><br>
            ${chamado.titulo}<br>
            <small>${chamado.prioridade}</small>
        `

        card.onclick = () => abrirDetalhes(chamado)

        if(chamado.status === "Aberto"){
            aberto.appendChild(card)
            countAberto++
        }

        if(chamado.status === "Em andamento"){
            andamento.appendChild(card)
            countAndamento++
        }

        if(chamado.status === "Concluído"){
            concluido.appendChild(card)
            countConcluido++
        }

    })

        document.getElementById("count-aberto").innerText = countAberto
        document.getElementById("count-andamento").innerText = countAndamento
        document.getElementById("count-concluido").innerText = countConcluido

    }catch(error){

        console.error("Erro ao carregar chamados:", error)

    }

}

// ============================
// DETALHES DO CHAMADO
// ============================

function abrirDetalhes(chamado){

    chamadoAtual = chamado

    document.getElementById("popupDetalhes").style.display = "flex"

    document.getElementById("detId").innerText =
        "TASK" + String(chamado.id).padStart(5,"0")

    document.getElementById("detTitulo").innerText = chamado.titulo
    document.getElementById("detDescricao").value = chamado.descricao
    document.getElementById("detPrioridade").innerText = "Prioridade: " + chamado.prioridade
    document.getElementById("detStatus").innerText = "Status: " + chamado.status

    // ✅ CONTROLE DE EDIÇÃO
    document.getElementById("detDescricao").disabled = true
    document.getElementById("btnEditar").style.display = "block"
    document.getElementById("btnSalvar").style.display = "none"

    const acoes = document.getElementById("acoesChamado")

    acoes.innerHTML = ""

    if(chamado.status === "Aberto"){
        acoes.innerHTML += `
            <button onclick="alterarStatus('Em andamento')">
                Iniciar atendimento
            </button>
        `
    }

    if(chamado.status === "Em andamento"){
        acoes.innerHTML += `
            <button onclick="alterarStatus('Concluído')">
                Concluir chamado
            </button>
        `
        acoes.innerHTML += `
            <button onclick="alterarStatus('Aberto')">
                Voltar para fila
            </button>
        `
    }

    if(chamado.status === "Concluído"){
        acoes.innerHTML += `
            <button onclick="alterarStatus('Aberto')">
                Reabrir chamado
            </button>
        `
    }

}

function habilitarEdicao(){

    document.getElementById("detDescricao").disabled = false

    document.getElementById("btnEditar").style.display = "none"
    document.getElementById("btnSalvar").style.display = "block"

}

function fecharDetalhes() {

    document.getElementById("popupDetalhes").style.display = "none"

}

// ============================
// ALTERAR CHAMADO
// ============================

async function alterarStatus(novoStatus){

    await fetch(`http://localhost:3000/chamados/${chamadoAtual.id}/status`, {

        method: "PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            status: novoStatus
        })

    })

    fecharDetalhes()
    carregarChamados()

}

async function salvarDescricao(){

    const novaDescricao = document.getElementById("detDescricao").value

    await fetch(`http://localhost:3000/chamados/${chamadoAtual.id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            descricao: novaDescricao
        })

    })

    alert("Descrição atualizada!")

    document.getElementById("detDescricao").disabled = true
    document.getElementById("btnEditar").style.display = "block"
    document.getElementById("btnSalvar").style.display = "none"

    fecharDetalhes()
    carregarChamados()

}

// ============================
// INICIALIZAÇÃO
// ============================

carregarChamados()