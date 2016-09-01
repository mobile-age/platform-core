#!/bin/bash

. scripts/config.sh

deploy_container () {

#	This function is used for the containers creation.	
#	Arguments:
#		$1: The name of the container
#		$2: The name of the docker image

	if [ $# -ne 2 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker run -d -t --name $1 $2

		return $?
	fi

}
