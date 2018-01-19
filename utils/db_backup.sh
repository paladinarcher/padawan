#!/bin/bash
cd /home/ec2-user/prod_data
sudo docker exec production_database_1 /bin/bash -c 'cd /data/db && mongodump'
bak_date=`date +"%Y_%m_%d"`
tar -zcvf prod_db_$bak_date.tar.gz dump
mv prod_db_$bak_date.tar.gz /home/ec2-user/bak
