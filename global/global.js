import {Login} from './login.js'
import {Chat} from './chat.js'

class Main{

    constructor(){
        this.login = new Login(post);
        this.chat = new Chat();

    }

    init(){
        if(sessionStorage.getItem('user') === null){
            this.login.renderLogin();
        }else{
            this.chat.renderChat();
            document.getElementById('logout').addEventListener('click',() => {this.logOut()});
        }
    }

    logOut(){

        sessionStorage.removeItem('user');
        this.login.renderLogin();
        this.chat.sockClient.close();

        this.chat.m  = undefined;
    }


}



function post(register){

    let username = document.getElementById('user').value;
    let password = document.getElementById('pass').value;

    let myJSON = {
        'username': username,
        'password': password,
        'register': register,
    };

    const fetchPromise = fetch('/checkpass',
        {

            credentials: 'include',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(myJSON),

        });

        fetchPromise.then(rsp => {
            if(rsp.ok){
                return rsp.json();
            }
        }).then(jsonObject => {

            if(!register) {
                if (jsonObject.result === 'ACCEPT') {
                    sessionStorage.setItem('user', myJSON.username);
                    main.chat.renderChat();
                    document.getElementById('logout').addEventListener('click',() => {main.logOut()});
                } else {
                    main.login.LoginFailed();
                }
            }else{
                if (jsonObject.result === 'REGISTERED') {
                    sessionStorage.setItem('user', myJSON.username);
                    main.chat.renderChat();
                    document.getElementById('logout').addEventListener('click',() => {main.logOut()});

                }else{
                    main.login.registerFailed();
                }
            }
        });


}




const main = new Main();
main.init();



