$(document).ready(function () {
    const socket = io();
    const username = user;
    const numSala = sala;


    socket.emit("joinSala", numSala);


    // Función para enviar mensajes
    function sendMessage() {
        const messageInput = $('#message-input');
        const message = messageInput.val().trim();
        const gpt = $('#activateChatGPT').prop('checked');

        const messageData = { user: username, message: message, numSala: numSala, gpt: gpt };

        const chatMessages = $('#chat-messages');
        const newMessage = $('<div>').text(`${messageData.user}: ${messageData.message}`);
        chatMessages.append(newMessage);

        console.log(messageData);
        socket.emit("newMsg", messageData);
        messageInput.val('');
    }

    // Función para renderizar mensajes en el chat
    function renderMessage(data) {
        console.log(data);
        const chatMessages = $('#chat-messages');
        const newMessage = $('<div>').text(`${data.user}: ${data.message}`);
        chatMessages.append(newMessage);

    }

    // Evento para manejar nuevos mensajes recibidos
    socket.on('newMsg', (data) => {
        console.log(data)
        renderMessage(data);
    });

    // Manejar el evento keydown para enviar mensajes al presionar Enter
    $('#message-input').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Manejar el evento click del botón para enviar mensajes
    $('#sendButton').click(function () {
        sendMessage();
    });
});
