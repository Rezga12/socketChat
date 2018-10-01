export class Chat{

    constructor(){
        this.container = document.getElementById('container');
        this.m = undefined;


        this.changeFriend = (e) => {

            document.getElementById('chat').innerHTML = '';

            this.m.style.color = 'aqua';
            this.m = e.target;
            e.target.style.color = 'red';

            this.getMessages(sessionStorage['user'],e.target.innerHTML);


        }
    }

    renderChat(){

        this.container.innerHTML = '<h1>GOOD JOB NUUUB MAN ' + sessionStorage.getItem('user') +'</h1>' +
            '<button id = "logout">log out</button>' +
            '<textarea id = "message"></textarea>' +
            '<button id = "send">send</button>' +
            '<div id = "chat"></div>';



        this.sockClient = new SocketClient();
        this.sockClient.addHandlers();

        document.getElementById("send").addEventListener('click',() => {this.sockClient.sendMessage(this.m.innerHTML)},false);

        this.getFriends();
    }

    static addForeignMessage(message){
        const child = document.createElement('div');
        child.classList.add('foreign-message');
        child.innerHTML = message;
        document.getElementById('chat').appendChild(child);
    }

    static addSelfMEssage(message){
        const child = document.createElement('div');
        child.classList.add('self-message');
        child.innerHTML = message;
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
                let elem = document.createElement('div');
                elem.classList.add('friend');
                elem.innerHTML = jsonObject.user_name;
                elem.addEventListener('click',this.changeFriend,false);

                this.container.appendChild(elem);

                if(this.m === undefined){

                    //messageToDiv = elem;
                    this.m = elem;
                    elem.style.color = 'red';
                    this.getMessages(sessionStorage['user'],this.m.innerHTML);
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
            "message": document.getElementById('message').value,
            "from":sessionStorage.getItem('user'),
            "to" : to,
        };
        Chat.addSelfMEssage(myJSON['message']);
        this.webSocket.send(JSON.stringify(myJSON));
    }

    close(){
        this.webSocket.close();
    }


}