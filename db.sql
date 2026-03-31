create Database car_rental;
USE car_rental;

create table users (
    id int auto_increment Primary Key,
    name varchar(100),
    email varchar(100),
    password varchar(100),
    role varchar(20)
);

create table cars(
    id int auto_increment Primary key,
    model varchar(100),
    number varchar(50),
    seats int,
    rent int,
    agency_id int
);

create table bookings (
    id int auto_increment Primary key,
    user_id int ,
    car_id int,
    days int,
    start_date date,
    status varchar(20) default 'pending'
);