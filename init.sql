CREATE USER IF NOT EXISTS 'bradyblair'@'%' IDENTIFIED WITH caching_sha2_password BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'bradyblair'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;