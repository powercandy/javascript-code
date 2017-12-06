CRATE DATABASE mysql_demo1; // 创建数据库

use mysql_demo1; // 选择并进入数据库

CREATE TABLE department  // 创建表
(
	dpt_name CHAR(20) NOT NULL,
	people_num INT(10) DEFALUT '10', // 设置默认值
	CONSTRAINT dpt_pk PRIMARY KEY (dpt_name) // 主键
);

CREATE TABLE employee
(
	id INT(10) PRIMARY KEY, // 主键
	name CHAR(20),
	age INT(10),
	salary INT(10) NOT NULL,
	phone INT(12) NOT NULL, 
	in_dpt CHAR(20) NOT NULL,
	UNIQUE (phone), // UNIQUE约束，phone的值唯一不能有重复
	CONSTRAINT emp_fk FOREIGN KEY (in_dpt) REFERENCES department(dpt_name) // 外键
);

CREATE TABLE project
(
	proj_num INT(10) NOT NULL,
	proj_name CHAR(20) NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE DEFAULT '2017-10-1',
	of_dpt CHAR(20) REFERENCES department(dpt_name),
	CONSTRAINT proj_pk PRIMARY KEY (proj_num, proj_name)
);