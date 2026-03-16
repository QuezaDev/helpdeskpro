async function registrar(){

    const username = document.getElementById("username").value.trim()
    const senha = document.getElementById("senha").value.trim()

    if(username === "" || senha === ""){
        alert("Preencha usuário e senha")
        return
    }

    const response = await fetch("http://localhost:3000/registro",{

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

        alert("Conta criada com sucesso!")
        window.location.href = "login.html"

    }else{

        alert(data.mensagem || "Erro ao registrar, nome de usuário já existente!")

    }

}