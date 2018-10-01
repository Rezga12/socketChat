export class Login{


    constructor(post){

        this.container = document.getElementById('container');
        this.post = post;
    }

    renderLogin(){
        this.container.innerHTML =
            '<input type = "text" name = "username" id = "user">' +
            '<input type = "password" name = "password" id = "pass">' +
            '<button id = "login">Log in man</button>' +
            '<span class = "err" id = "err">Something Went Wrong Bruh</span>' +
            '<button id = "register">register</button>';

        document.getElementById('login').addEventListener('click',() => {this.post(false)},false);
        document.getElementById('register').addEventListener('click',() => {this.renderRegister()},false);

    }

    LoginFailed(){
        document.getElementById('err').style.opacity = 1;
    }

    registerFailed(){
        document.getElementById('reg-err').style.opacity = 1;
    }

    renderRegister(){

        this.container.innerHTML ='<div>\n' +
            '            <input class = \'input\' type = \'text\' id = \'user\'>\n' +
            '        </div>\n' +
            '        <div>\n' +
            '            <input class = \'input\' type = \'text\' id = \'pass\'>\n' +
            '        </div>\n' +
            '        <div>\n' +
            '            <input class = \'input\' type = \'text\' id = \'repass\'>\n' +
            '        <span class = "err" id = "reg-err">Something Went WRong with Register</span>' +
            '        </div>' +
            '        <button id = "register">press me man</button>'+
            '          <button id = "login">login</button>';

        document.getElementById('register').addEventListener('click',() => {this.post(true)},false);
        document.getElementById('login').addEventListener('click',() => {this.renderLogin()},false);
    }

}