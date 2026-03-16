// Função responsável por autenticar o usuário

async function login(){

    const username = document.getElementById("username").value
    const senha = document.getElementById("senha").value

    // validação antes de enviar para o servidor
    if(username === "" || senha === ""){
        document.getElementById("mensagem").innerText = "Preencha usuário e senha"
        return
    }

    const response = await fetch("http://localhost:3000/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            senha
        })

    })

    const data = await response.json()

    if(data.success){

        localStorage.setItem("usuario", JSON.stringify(data.user))

        window.location.href = "index.html"

    }else{

        document.getElementById("mensagem").innerText = "Usuário ou senha inválidos"

    }

}