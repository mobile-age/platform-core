#!/bin/bash

. config.sh

create_container () {

#	This function is used for the containers creation.	
#	Arguments:
#		$1: The name of the container
#		$2: The name of the docker image


	if [ $# -ne 2 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker run --name $1 $2

		return $?
	fi

}


#create_container 'developer_usename' 'ubuntu14.04_python3_node:latest'
#x=$?
#echo $x