export class Login{


    constructor(){

        this.container = document.getElementById('container');
        this.animationFinished = true;
    }

    renderLogin(post){
        this.container.innerHTML = `
    <div class = 'login-container' id = 'login-container'>
    
        <div class = 'title login-title-height'>
            <p class = 'text'>COME IN</p>
        </div>
    
        <div class = 'item login-field-height'>
            <input class = 'inp' type = 'text' placeholder="who Am i" id = 'login-user'>
            <div class = 'label'>
                User
            </div>
        </div>
    
        <div class = 'item login-field-height'>
            <input class = 'inp' type = 'password' placeholder="who Am i" id = 'login-password'>
            <div class = 'label'>
                Pass
            </div>
        </div>
    
        <div class ='buttons login-field-height'>
    
            <div class = 'button login-button' id ='post-login'>
                Login
    
            </div>
    
            <div class = 'button' id ='to-registration'>
    
                Register
            </div>
    
        </div>
    </div>
    
    
    
    
    <div class = 'register-container' id = 'register-container' style = 'display: none'>
    
        <div class = 'title register-title-height'>
            <p class = 'text'>COME IN</p>
        </div>
    
        <div class = ' item register-field-height'>
            <input class = 'inp' type = 'text' placeholder="who Am i" id = 'register-user'>
            <div class = 'label'>
                User
            </div>
        </div>
    
        <div class = 'item register-field-height'>
            <input class = 'inp' type = 'password' placeholder="who Am i" id = 'register-password'>
            <div class = 'label'>
                Pass
            </div>
        </div>
    
        <div class = 'item register-field-height'>
            <input class = 'inp' type = 'password' placeholder="who Am i" id = 'register-password-re'>
            <div class = 'label'>
                Pass
            </div>
        </div>
    
        <div class ='buttons register-field-height'>
    
            <div class = 'button login-button' id = 'to-login'>
                Login
            </div>
    
            <div class = 'button' id = 'post-register'>
                Register
            </div>
    
        </div>
    </div>
`;

        let registration = document.getElementById('register-container');
        let login = document.getElementById('login-container');

        document.getElementById('to-registration').addEventListener('click',() => this.switchForms(login,registration));
        document.getElementById('to-login').addEventListener('click',() => this.switchForms(registration,login));


        let loginPassword = document.getElementById('login-password');
        let loginUsername = document.getElementById('login-user');
        document.getElementById('post-login').addEventListener('click',() => post(false,loginUsername.value,loginPassword.value));

        let registerPassword = document.getElementById('register-password');
        let registerPasswordRe = document.getElementById('register-password-re');
        let registerUsername = document.getElementById('register-user');
        document.getElementById('post-register').addEventListener('click', () => Login.tryRegister(
            registerUsername.value,
            registerPassword.value,
            registerPasswordRe.value,
            post));

        //some UI modifications
        document.querySelectorAll('.item').forEach((item) => Login.checkLength(item));

    }

    static tryRegister(user,pass,passRe,post){

        if(pass === passRe){
            post(true,user,pass);
        }else{
            Login.registerFailed('NO_MATCH');
        }

    }

    static checkLength(item){

        const label = item.querySelector('.label');
        const field = item.querySelector('input');
        field.addEventListener('keyup',() => {
            if(field.value.length > 0){
                label.style = 'width:25%';
            }else{
                label.style='';
            }
        });


    }

    static failedAnimation(field){

        field.animate([{transform: 'translateX(0px)'}, {transform: 'translateX(3px)'}], {duration: 100, iterations:8});
        field.animate([{background: '#d3d3d3'},{background: 'darkred'}], {duration:400}).onfinish = () => {
            field.animate([{background: 'darkred'},{background: '#d3d3d3'}],
            {duration:400});
        }
    }

    static LoginFailed(code){
        if(code === 'NOT_FOUND'){
            Login.failedAnimation(document.getElementById('login-user'));
        }else{
            Login.failedAnimation(document.getElementById('login-password'));
        }
    }

    static registerFailed(code){
        if(code === 'TAKEN'){
            Login.failedAnimation(document.getElementById('register-user'));
        }else{
            Login.failedAnimation(document.getElementById('register-password'));
            Login.failedAnimation(document.getElementById('register-password-re'));
        }
    }

    static fadeOut(element){

        return element.animate(
            [{ opacity:1 },
                { opacity: 0 }],
            {

                duration: 1000,
                fill: "forwards",
            });

    }

    static fadeIn(element){

        element.style.display = 'flex';

        return element.animate(
            [{ opacity:0 },
                { opacity: 1 }],
            {
                // timing options
                duration: 1000,
                fill: "forwards",
            });
    }

    switchForms(elementOut, elementIn){

        if(this.animationFinished) {
            this.animationFinished = false;
            Login.fadeOut(elementOut).onfinish = () => {
                elementOut.style.display = 'none';
                document.querySelectorAll('input').forEach(object => object.value = '');
                document.querySelectorAll('.label').forEach(object => object.style = '');
                Login.fadeIn(elementIn).onfinish = () => this.animationFinished = true;
            };
        }
    }




}