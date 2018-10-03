export class Chat{

    constructor(){
        this.container = document.getElementById('container');

        this.selected = undefined;




        this.changeFriend = (e) => {

            document.getElementById('chat').innerHTML = '';

            this.selected.classList.remove('focused');
            this.selected = e;
            this.selected.classList.add('focused');

            this.getMessages(sessionStorage['user'],this.selected.name);


        }
    }

    renderChat(){

        this.container.innerHTML = `<div class = 'main-container'>

            <div class = 'friends'>
                <div class = 'search'>
    
                    <input class = 'search-inp' type = 'text' placeholder="search">
                    <div  class = 'icon'><i class="fas fa-search fa-3x inner-icon"></i></div>
                </div>
    
                <div class = 'conversations' id = 'convs'>
                    
                    
    
    
                </div>
            </div>
            <div class = 'chat'>
                <div class ='header'>
                    <div class = 'username' >${sessionStorage['user']}</div>
                    <button id = 'logout'>log out</button>
                </div>
                <div class ='message-bar' id = "chat">
    
                    
    
                </div>
                <div class ='field'>
                    </label><textarea class = 'area' rows="2" cols = "60" id = 'area' placeholder = 'Type Message...'></textarea>
                    <div class = 'send-button' id = "send"></div>
                </div>
            </div>
    
    
    
        </div>`;







        this.sockClient = new SocketClient();
        this.sockClient.addHandlers();

        document.getElementById("send").addEventListener('click',() => {
            this.sockClient.sendMessage(this.selected.name);
            document.getElementById('area').value = '';
        },false);

        this.getFriends();
    }

    static addForeignMessage(message){
        const child = document.createElement('div');
        child.classList.add('message');
        child.classList.add('outer');

        child.innerHTML = `<div class = 'message-text outer-text'>
                            ${message}
                        </div>
                        <div class ='message-avatar'>
                            <label class = 'inner-time'>18:00</label>
                            <img class = 'inner-avatar' src="./global/avatar2.jpg">
                        </div>`;
        document.getElementById('chat').appendChild(child);
    }

    static addSelfMEssage(message){
        const child = document.createElement('div');
        child.classList.add('message');
        child.innerHTML = `<div class = 'message-text'>
                            ${message}
                        </div>
                        <div class ='message-avatar'>
                            <label class = 'inner-time'>18:00</label>
                            <img class = 'inner-avatar' src="./global/avatar2.jpg">
                        </div>`;
        document.getElementById('chat').appendChild(child);
    }

    getFriends(){

        const fetchpromise = fetch('/getusers', {
            credentials: 'include',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            method: 'GET',
        });

        fetchpromise.then(rsp => {
            if(rsp.ok){
                return rsp.json();
            }
        }).then(jsonArray => {

            jsonArray.forEach((jsonObject) => {
                if(jsonObject.user_name === sessionStorage['user']){
                    return;
                }
                let elem = document.createElement('div');
                elem.classList.add('friend');
                elem.name = jsonObject.user_name;
                elem.innerHTML = `<div class = 'image'>
                            <img class = 'avatar' src="./global/avatar2.jpg">
                        </div>
                        <div class = 'info'>
                            <div class ='name'>
                                <label class = 'who'>${jsonObject.user_name}</label>
                                <label class = 'time'>18:00:123</label>
                            </div>
                            <div class = 'last-message'>Hi What's Up DuDe are You Ok ToDay Bro?</div>
                        </div>`;
                elem.addEventListener('click',() => {this.changeFriend(elem)},false);

                let friendContainer = document.getElementById('convs');
                friendContainer.appendChild(elem);

                if(this.selected === undefined){

                    //messageToDiv = elem;
                    this.selected = elem;

                    elem.classList.add('focused');
                    this.getMessages(sessionStorage['user'],elem.name);
                }
            });

        });
    }

    getMessages(from, to) {

        const fetchPromise = fetch(`/getmessages?from=${from}&to=${to}`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
        });

        fetchPromise.then(rsp => {
            if (rsp.ok) {
                return rsp.json();
            }

        }).then(jsonArray => {
            jsonArray.forEach((jsonObject) => {

                if(jsonObject.user_from === sessionStorage['user']){
                    Chat.addSelfMEssage(jsonObject.message);
                }else{
                    Chat.addForeignMessage(jsonObject.message);
                }

            });

        });

    }




}



export class SocketClient{

    constructor(){

        this.webSocket = new WebSocket('ws://localhost:3000');

    }



    addHandlers(){
        this.webSocket.addEventListener('open', (event) => {
            const result = {"type": "C","user": sessionStorage.getItem('user')};
            this.webSocket.send(JSON.stringify(result));
        });

        this.webSocket.addEventListener('message', (event) => {
            Chat.addForeignMessage(event.data);
        });




    }

    sendMessage(to){
        const myJSON = {
            "type": "M",
            "message": document.getElementById('area').value,
            "from":sessionStorage.getItem('user'),
            "to" : to,
            "token": sessionStorage.getItem('token'),
        };
        Chat.addSelfMEssage(myJSON['message']);
        this.webSocket.send(JSON.stringify(myJSON));
    }

    close(){
        this.webSocket.close();
    }


}