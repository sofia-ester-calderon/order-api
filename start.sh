
docker pull mysql/mysql-server
docker run --name=mysqlorder -d mysql/mysql-serve
docker logs mysqlorder 2>&1 | grep GENERATED
docker exec -it mysqlorder mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Groucho#90';

docker exec -it mysql1 bash 
bash-4.2#