CREATE USER canyons WITH PASSWORD 'canyons';
ALTER USER canyons WITH SUPERUSER;
CREATE DATABASE CANYONS WITH OWNER=canyons
                             LC_COLLATE='en_US.utf8'
                             LC_CTYPE='en_US.utf8'
                             ENCODING='UTF8'
                             TEMPLATE=template0;
