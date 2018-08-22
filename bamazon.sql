create database bamazon;

use bamazon;

create table products(
	item_id int auto_increment not null primary key,
    product_name varchar(250) not null,
    department_name varchar(250),
    price double(50,2)  not null,
    stock_quantity int not null
    
    

);

use bamazon;
drop table products;
insert into products (item_id, product_name, department_name, price, stock_quantity) values (1, 'Table Cloth 120 Round White', 'fabric', 75.92, 93);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (2, 'pasta', 'wholefood', 6.79, 0);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (3, 'Water - Aquafina Vitamin', 'water', 51.72, 77);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (4, 'Lemon Tarts', 'juice', 6.95, 47);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (5, 'Syrup - Golden, Lyles', 'dressing', 92.40, 21);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (6, 'Appetizer - Tarragon Chicken', 'wholefood', 11.90, 57);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (7, 'Butter - Salted', 'diary', 58.94, 27);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (8, 'Shrimp - Prawn', 'seafood', 52.60, 34);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (9, 'Beer - Pilsner Urquell', 'alchole', 16.63, 66);
insert into products (item_id, product_name, department_name, price, stock_quantity) values (10, 'Bread - Rye', 'wholefood', 67.97, 9);

select * from products;
use bamazon;
create table departments({}
	department_id :int not null primary key auto_increment,
    department_name varchar(30),
    over_head_costs float
);

insert into departments (department_name,over_head_costs) values ("food",2000),("fabric",10000),("drink",5000);