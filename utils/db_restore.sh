#!/bin/bash
show_usage() {
    echo "USAGE: $0 DB_INSTANCE RESTORE_FROM"
}

BAK_PATH=~/bak
if [[ "$2" == "" ]]; then
    show_usage
    exit 0
else
    if [[ "$1" == "production_database_1" ]]; then
        DATA_PATH=~/prod_data
    elif [[ "$1" == "staging_database_1" ]]; then
        DATA_PATH=~/stag_data
    else
        echo "Invalid database instance. Valid values are:"
        echo "- production_database_1"
        echo "- staging_database_1"
        exit 0
    fi
    cp $BAK_PATH/$2 $DATA_PATH
    cd $DATA_PATH
    tar xzvf $2
    sudo docker exec $1 /bin/bash -c 'cd /data/db && mongorestore dump/'
fi
