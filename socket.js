const WS = require('ws');


class WebSocket{

    constructor(server,database){
        this.webSocket = new WS.Server({server});
        this.connectedClients = new Map();
        this.tokens = new Map();
        this.base = database;
     }

     addToken(user,token){
        if(!this.tokens.has(user)){
            this.tokens.set(user,token);
        }
     }

    addHandlers(){

        this.webSocket.on('error', (err) => logger.error(err));

        this.webSocket.on('connection', (client) => {



            client.on('message', (message) => {

                const myJSON = JSON.parse(message);
                if(myJSON['type'] === 'M'){
                    if(myJSON['token'] !== this.tokens.get(myJSON['from'])){
                        //if someone tries to mess up with session storage
                        return;
                    }
                    console.log(myJSON['token']);
                    console.log(this.tokens.get(myJSON['from']));
                    let user = myJSON['to'];
                    if(this.connectedClients.has(user) && this.connectedClients.get(user).length !== 0){
                        let arr = this.connectedClients.get(myJSON['to']);
                        arr.forEach((key) => {
                            key.send(myJSON['message']);
                        });
                    }

                    this.base.insertMessage(myJSON['message'],myJSON['from'],myJSON['to']);


                }else{
                    if(this.connectedClients.has(myJSON['user'])){
                        let arr = this.connectedClients.get(myJSON['user']);
                        arr.push(client);
                        this.connectedClients.set(myJSON['user'],arr);
                    }else{
                        this.connectedClients.set(myJSON['user'],[client]);
                    }

                }

            });

            client.on('close',(code) => {

                this.connectedClients.forEach((val,key) => {
                    var index = val.indexOf(client);
                    if (index > -1) {
                        val.splice(index, 1);
                        if(val.length === 0){
                            this.tokens.delete(key);
                        }
                    }
                });

                console.log('closed man :(');


            });
        });

    }

}

module.exports = WebSocket;




