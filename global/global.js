import {Login} from './login.js'
import {Chat} from './chat.js'

class Main{

    constructor(){
        this.login = new Login(post);
        this.chat = new Chat();

    }

    init(){
        if(sessionStorage.getItem('user') === null){
            this.login.renderLogin(post);
        }else{
            this.chat.renderChat();
            document.getElementById('logout').addEventListener('click',() => {this.logOut()});
        }
    }

    logOut(){

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        this.login.renderLogin(post);
        this.chat.sockClient.close();

        this.chat.m  = undefined;
    }


}



function post(register,username,password){

    console.log(username);
    console.log(username);

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
            console.log(jsonObject.result);
            if(!register) {
                if (jsonObject.result === 'ACCEPT') {
                    sessionStorage.setItem('user', myJSON.username);
                    sessionStorage.setItem('token', jsonObject.token);
                    main.chat.renderChat();
                    document.getElementById('logout').addEventListener('click',() => {main.logOut()});
                } else {
                    Login.LoginFailed(jsonObject.result);
                }
            }else{
                if (jsonObject.result === 'REGISTERED') {
                    sessionStorage.setItem('user', myJSON.username);
                    sessionStorage.setItem('token', jsonObject.token);
                    main.chat.renderChat();
                    document.getElementById('logout').addEventListener('click',() => {main.logOut()});

                }else{
                    Login.registerFailed(jsonObject.result);
                }
            }
        });


}




const main = new Main();
main.init();



