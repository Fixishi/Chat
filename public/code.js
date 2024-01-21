(function(){
    const socket = io();
    console.log('Socket:', socket); // Log the socket object

    const app = document.querySelector('.app');
    let uname;

    const joinJoinScreen = app.querySelector('.join-screen #join');
    const sendChatScreen = app.querySelector('.chat-screen #send');
    const JoinScreen = app.querySelector('.join-screen')
    const ChatScreen = app.querySelector('.chat-screen')

    joinJoinScreen.addEventListener('click', function(){
        let username = app.querySelector('.join-screen #name').value;
        console.log('Username:', username); // Log the entered username

        if(username.length > 0){
            socket.emit('newuser', username);
            uname = username;
            JoinScreen.classList.remove('active');
            ChatScreen.classList.add('active');
        } else {
            alert('Zadejte prosím jméno.');
            return;
        }
    });

    sendChatScreen.addEventListener("click", function(){ 
        let message = app.querySelector(".chat-screen #message").value;
        console.log('Message:', message); // Log the entered message

        if(message.length == 0) {
            return;
        }

        renderMessage("my", {
            username: uname,
            text:message
        });
        
        socket.emit("chat", {
            username: uname,
            text:message
        });
        
        app.querySelector(".chat-screen #message").value = "";
    });

    app.querySelector(".chat-screen #leave").addEventListener("click", function(){
        socket.emit("leftuser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update) {
        console.log('Update:', update); // Log the received update
        renderMessage("update", update);
    });
    socket.on("chat", function(message) {
        console.log('Received message:', message); // Log the received message
        renderMessage("other", message);
    });
    
    function renderMessage(type, message) {
        console.log('Rendering message:', type, message);
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message local-msg");
            el.innerHTML = `<div>
                                <div class='name'>You</div>
                                <div class='text'>${message.text}</div>
                            </div>`;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class", "message remote-msg");
            el.innerHTML = `
                            <div>
                                <div class='name'>${message.username}</div>
                                <div class='text'>${message.text}</div>
                            </div>`;
            messageContainer.appendChild(el);
        } else if(type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();