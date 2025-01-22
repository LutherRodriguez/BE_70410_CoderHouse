const socket = io();

socket.emit("mensaje", "Hola mundo desde el front");

socket.on("saludo", (data) => {
    console.log(data);
})

socket.on("usuarios", (data) => {
    const listaUsuarios = document.getElementById("listaUsuarios");

    listaUsuarios.innerHTML = "";

    data.forEach(usuario => {
        listaUsuarios.innerHTML += `<li>${usuario.nombre} ${usuario.apellido}</li>`;
        
    });
})