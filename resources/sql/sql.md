# SQL Commands

| Command | Description |
| --- | --- |
| SELECT * FROM table_name; | Retrieve all columns and rows from a specified table. |
| SELECT column1, column2 FROM table_name WHERE condition; | Retrieve specific columns from a table matching a condition. |
| INSERT INTO table_name (col1, col2) VALUES (val1, val2); | Insert new rows into a database table. |
| UPDATE table_name SET col1 = val1 WHERE condition; | Modify existing records in a table. |
| DELETE FROM table_name WHERE condition; | Delete existing records from a table. |
| CREATE TABLE table_name (col1 datatype, col2 datatype); | Create a new table in the database. |
| DROP TABLE table_name; | Delete an entire table and its data from the database. |
| ALTER TABLE table_name ADD col_name datatype; | Modify an existing table structure (e.g., add a column). |
| SELECT DISTINCT column_name FROM table_name; | Return only distinct (unique) values in a query result. |
| SELECT * FROM table_name ORDER BY column_name ASC; | Sort query results in ascending (or descending with DESC) order. |
| SELECT COUNT(*) FROM table_name; | Count the number of rows matching a query. |
| SELECT col, SUM(col2) FROM table_name GROUP BY col; | Group rows sharing a property to perform aggregate functions. |
| SELECT * FROM t1 JOIN t2 ON t1.id = t2.id; | Combine rows from two or more tables based on a related column. |
| BEGIN TRANSACTION; | Start a new database transaction. |
| COMMIT; | Save all changes made during the current transaction. |
| ROLLBACK; | Undo changes made during the current transaction in case of an error. |