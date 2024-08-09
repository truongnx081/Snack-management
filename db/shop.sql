create database shop_manager;
use shop_manager;

create table Users(
	id varchar(50) not null,
    fullname nvarchar(50),
    email varchar(50),
    password varchar(100),
    dob date,
    address  varchar(100),
    thumbnail  varchar(100),
    phone varchar(10),
    gender bit,
    create_at datetime,
    update_at datetime,
    primary key (Id)
);

create table Inventory(
	id varchar(50) not null,
    product_id varchar(50),
    quantity int,
    change_type varchar(20),
    reason text,
    changed_by varchar(50),
    update_at datetime,
    primary key(id)
);

create table Role(
    name varchar(50),
    description text,
    primary key (name)
);
create table Permission(
    name varchar(50),
    description text,
    primary key(name)
);

create table Products(
	id varchar(50) not null,
    name nvarchar(50),
    description text,
    price double,
    thumbnail  varchar(100),
    category_id varchar(50),
    create_at datetime,
    update_at datetime,
    primary key(id)
);

create table Categories(
	id varchar(50) not null,
    name nvarchar(50),
    description text,
    primary key(id)
);

create table Orders(
	id int AUTO_INCREMENT,
    fullname nvarchar(50),
    phone varchar(10),
    user_id varchar(50),
    total_amount double,
    status varchar(50),
    create_at datetime,
    primary key(id)
);

create table OrderDetails(
	id int AUTO_INCREMENT,
    order_id varchar(50),
    product_id varchar(50),
    quantity int,
    price double,
    create_at datetime,
    primary key(id)
);

create table role_permissions(
	role_name varchar(50),
    permissions_name varchar(50),
    primary key(role_name, permissions_name)
);

create table users_roles(
	users_id varchar(50),
    roles_name varchar(50),
    primary key(users_id, roles_name)
);

ALTER TABLE Orders
ADD CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES Users(id) ;

ALTER TABLE Inventory
ADD CONSTRAINT fk_inventory_users FOREIGN KEY (changed_by) REFERENCES Users(id),
ADD CONSTRAINT fk_inventory_products FOREIGN KEY (product_id) REFERENCES Products(id);

ALTER TABLE Products
ADD CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES Categories(id);

ALTER TABLE OrderDetails
ADD CONSTRAINT fk_orderdetails_orders FOREIGN KEY (order_id) REFERENCES Orders(id),
ADD CONSTRAINT fk_orderdetails_products FOREIGN KEY (product_id) REFERENCES Products(id);

ALTER TABLE role_permissions
ADD CONSTRAINT fk_rp_role FOREIGN KEY (role_name) REFERENCES role(name),
ADD CONSTRAINT fk_rp_permission FOREIGN KEY (permissions_name) REFERENCES permission(name);

ALTER TABLE users_roles
ADD CONSTRAINT fk_ur_users FOREIGN KEY (users_id) REFERENCES Users(id),
ADD CONSTRAINT fk_ur_role FOREIGN KEY (roles_name) REFERENCES role(name);






