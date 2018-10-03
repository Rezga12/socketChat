const mysql = require('promise-mysql');

class DBManager{

    constructor(){
        this.connectionPool = mysql.createPool({

            host: 'localhost',
            user: 'root',
            password: 'davidovich1@',
            database: 'test',
            connectionLimit: 10
        });




    }

    searchUser(username){

        return  this.connectionPool.query('select * from users where user_name = ?',[username]);
    }

    registerUser(username,password){

        const post = {
            user_name: username,
            user_pass: password,
        };

        this.connectionPool.query("insert into users set ?",post).then(res=>{
           // console.log(res);
        }).catch(error => {
            console.log(error)
        });

    }

    getUsernames(){

        return  this.connectionPool.query('select * from users');

    }

    insertMessage(message, from, to){

        const post = {

            message: message,
            user_from: from,
            user_to: to,
        };

        this.connectionPool.query('insert into messages set ?', post).then((res) => {

        }).catch(error => {
            console.log(error)
        });
    }

    getMessages(self,friend){

        return this.connectionPool.query('select message, user_from, user_to from messages ' +
            'where user_from = ? and user_to = ? or ' +
            'user_from = ? and user_to = ? order by message_time',[self,friend,friend,self]);


    }



}





module.exports = DBManager;