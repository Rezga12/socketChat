create database test;

use test;
#ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'davidovich1@'


create table users(

    user_id int primary key auto_increment,
    user_name varchar(30) not null,
    user_pass varchar(30) not null
);


create table messages(

    id int primary key auto_increment,
    message text,
    user_from varchar(30) not null,
    user_to varchar(30) not null,
	message_time TIMESTAMP DEFAULT NOW()

);


