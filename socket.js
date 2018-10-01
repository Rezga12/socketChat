const WS = require('ws');


class WebSocket{

    constructor(server,database){
        this.webSocket = new WS.Server({server});
        this.connectedClients = new Map();
        this.base = database;
     }

    addHandlers(){

        this.webSocket.on('error', (err) => logger.error(err));

        this.webSocket.on('connection', (client) => {

            client.send('conncted to the Server');

            client.on('message', (message) => {

                const myJSON = JSON.parse(message);
                if(myJSON['type'] === 'M'){
                    let user = myJSON['to'];
                    if(this.connectedClients.has(user) && this.connectedClients.get(user).length !== 0){
                        let arr = this.connectedClients.get(myJSON['to']);
                        arr.forEach((key) => {
                            key.send(myJSON['message']);
                        });
                    }else{



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
                    }
                });

                console.log('closed man :(');


            });
        });

    }

}

module.exports = WebSocket;




