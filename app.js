const express = require('express');

const app = express();
const port = 3000;

const pool = require('./connection-pool');

var base = new pool();

const bodyParser = require("body-parser");

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/global/:filename',(req,res) =>{
    res.sendFile(__dirname + '/global/' + req.params.filename);
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/checkpass',(req,res) =>{

    let username = req.body['username'];
    let password = req.body['password'];
    let register = req.body['register'];



    base.searchUser(username).then(sql_response => {

        const resJSON = {
            "result": "",
            "token" : "",
        };


        if(register){

            if(sql_response.length === 0){
                base.registerUser(username,password);
                resJSON['result'] = 'REGISTERED';
                resJSON['token'] = makeid();
                instance.addToken(username,resJSON['token']);
            }else{
                resJSON['result'] = 'TAKEN';
            }
        }else{
            if(sql_response.length === 0){
                resJSON['result'] = 'NOT_FOUND';
            }else if(sql_response[0].user_pass === password){
                resJSON['result'] = 'ACCEPT';
                resJSON['token'] = makeid();
                instance.addToken(username,resJSON['token']);
            }else{
                resJSON['result'] = 'INCORRECT';
            }
        }

        res.send(JSON.stringify(resJSON));

    });
});


app.get('/getusers',(req,res) => {

    base.getUsernames().then((sql_response) => {

        let response = JSON.stringify(sql_response);

        res.send(response);
    });

});

app.get('/getmessages', (req,res) => {

    let from = req.query.from;
    let to = req.query.to;

    base.getMessages(from,to).then((sql_query) => {

        res.send(JSON.stringify(sql_query));

    });

});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const webSock = require('./socket.js');

const instance = new webSock(server,base);
instance.addHandlers();



