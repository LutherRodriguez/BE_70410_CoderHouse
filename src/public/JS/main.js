//Instancio el socket
const socket = io();

let user;


//Saludo desde el front con el swetalert

Swal.fire({
    title: "Bienvenido! Identificate",
    input: "text",
    text: "Gracias por visitar nuestra página",
    inputValidator: (value) => {
        return !value && "Debes ingresar tu nombre para continuar";
    },
    allowOutsideClick: false,
   
}).then(result => {
    user= result.value
});

//Vinculo el chatBox
const chatBox= document.getElementById("chatBox");

chatBox.addEventListener("keyup", (e) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("mensaje", {user: user, mensaje: chatBox.value});
            chatBox.value = "";
        }
        
    }
});

//Recibo el mensaje del back
socket.on("messagesLogs", (data) => {
    const chat = document.getElementById("messagesLogs");
    let mensajes = "";
    data.forEach(mensaje => {
        mensajes = mensajes + `<p>${mensaje.user} dice: ${mensaje.mensaje}</p>`;
    });
    chat.innerHTML = mensajes;
});

//Envio un mensaje al back
socket.emit("mensaje", "Hola mundo desde el front, que tal");

socket.on("saludo", (data) => {
    console.log(data);
})

socket.on("usuarios", (data) => {
   const listaUsuarios = document.getElementById("lista-usuarios");
    listaUsuarios.innerHTML = "";
    data.forEach(usuario => {
        listaUsuarios.innerHTML += `<li>${usuario.nombre} ${usuario.apellido} </li>`;
       
    });
})

