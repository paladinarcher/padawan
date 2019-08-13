#!/bin/bash
#cd /home/ec2-user/prod_data
#sudo docker exec production_database_1 /bin/bash -c 'cd /data/db && mongodump'
#bak_date=`date +"%Y_%m_%d"`
#tar -zcvf prod_db_$bak_date.tar.gz dump
#mv prod_db_$bak_date.tar.gz /home/ec2-user/bak
#scp -i ~/.ssh/rigel-alpha.pem /home/ec2-user/bak/prod_db_$bak_date.tar.gz ec2-user@stage.developerlevel.com:/home/ec2-user/ext_bak/


processLine() {
  line=$1
  dir_name="$(echo $line | sed 's/.\/\([^\/]*\)\/dump/\1/g')"
  bak_data=`date +"%Y_%m_%d"`
  file_name="$dir_name-$bak_data.tar.gz"
  echo "Processing $dir_name from $line to $file_name"
  pushd $line/..
  pwd
  tar -zcvf $file_name dump
  mv $file_name ~ec2-user/bak
  if [ "$HOSTNAME" = "stage.developerlevel.com" ]; then
    echo "On stage, not copying remotely"
  else
    echo "On $HOSTNAME, sending backup to stage"
    ssh -i ~ec2-user/.ssh/rigel-alpha.pem ec2-user@stage.developerlevel.com "mkdir -p ~ec2-user/ext_bak/$HOSTNAME"
    scp -i ~ec2-user/.ssh/rigel-alpha.pem ~ec2-user/bak/$file_name ec2-user@stage.developerlevel.com:/home/ec2-user/ext_bak/$HOSTNAME
  fi
  popd
  pwd
}
export -f processLine
sudo docker container ls --format '{{.Names}}' | grep 'database' | xarg -I{} /bin/bash -c "echo {}; sudo docker exec {} /bin/bash -c 'cd /data/db && mongodump'"
pushd ~ec2-user
find . -type d | grep dump\$ | grep -v src | xargs -t -n1 -P1 bash -c 'processLine "$@"' _
popd