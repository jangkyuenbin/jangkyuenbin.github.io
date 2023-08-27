#!/bin/bash

source $DR_DIR/bin/scripts_wrapper.sh

CONFIG_FILE=$DR_DIR/shellScript/run.env
#CONFIG_FILE=$DR_CONFIG
CURRENT_UPLOAD_MODEL=$(grep -e "^DR_LOCAL_S3_MODEL_PREFIX" ${CONFIG_FILE} | awk '{split($0,a,"="); print a[2] }')

WL_MODEL_PREFIX="rl-deepracer-"

function wl-update-env {

  if [[ -f "$DR_DIR/system.env" ]]
  then
    LINES=$(grep -v '^#' $DR_DIR/system.env)
    for l in $LINES; do
      env_var=$(echo $l | cut -f1 -d\=)
      env_val=$(echo $l | cut -f2 -d\=)
      eval "export $env_var=$env_val"
    done
  else
    echo "File system.env does not exist."
    return 1
  fi

  if [[ -f "$DR_CONFIG" ]]
  then
    LINES=$(grep -v '^#' $DR_CONFIG)
    for l in $LINES; do
      env_var=$(echo $l | cut -f1 -d\=)
      env_val=$(echo $l | cut -f2 -d\=)
      eval "export $env_var=$env_val"
    done
  else
    echo "File run.env does not exist."
    return 1
  fi

  if [[ -z "${DR_RUN_ID}" ]]; then
    export DR_RUN_ID=0
  fi

  if [[ "${DR_DOCKER_STYLE,,}" == "swarm" ]];
  then
    export DR_ROBOMAKER_TRAIN_PORT=$(expr 8080 + $DR_RUN_ID)
    export DR_ROBOMAKER_EVAL_PORT=$(expr 8180 + $DR_RUN_ID)
    export DR_ROBOMAKER_GUI_PORT=$(expr 5900 + $DR_RUN_ID)
  else
    export DR_ROBOMAKER_TRAIN_PORT="8080-8089"
    export DR_ROBOMAKER_EVAL_PORT="8080-8089"
    export DR_ROBOMAKER_GUI_PORT="5901-5920"
  fi

}

function waiting01()
{
    total_stdy="$(($(stty size|cut -d' ' -f1)))"
	total_stdx="$(($(stty size|cut -d' ' -f2)))"

	head="Progress bar: "
	total=$[${total_stdx} - ${#head}*2]

	i=0
	loop=100
	while [ $i -lt $loop ]
	do
		let i=i+1
		
		per=$[${i}*${total}/${loop}]
		remain=$[${total} - ${per}]
		printf "\r\e[${total_stdy};0H${head}\e[42m%${per}s\e[47m%${remain}s\e[00m" "" ""
		sleep 0.1
	done

	echo ""
}

function waiting02()
{	
	total=$(($1))
    i=0
	pi=0
	str=""
	arry=("\\" "|" "/" "-")
	while [ $i -le $total ]
	do
		val=`expr $i \* 100`
		val=`expr $val / $total`
		let index=i%4
		printf "[%-100s] %d%c %c\r" "$str" "$val" "%" "${arry[$index]}"
		sleep 0.1
		let i=i+1
		if [[ $val -ge $pi ]]
		then
			str+="#"
			pi=`expr $pi + 1`
		fi
	done
	echo ""
}

#dr-stop-training
CUSTOM_TARGET=$(echo s3://$DR_LOCAL_S3_BUCKET/$DR_LOCAL_S3_CUSTOM_FILES_PREFIX/)
for file in $DR_DIR/shellScript/test_files/*
do
    if test -d $file
	then
		echo "---------------------------------------------"
		echo $file
		WL_DIR_NAME=${file##*/}
		echo $WL_DIR_NAME
		WL_VERSION_NAME=$(echo $WL_DIR_NAME | awk '{split($0,a,"-"); print a[1] }')
		WL_TRAINING_TIME=$(echo $WL_DIR_NAME | awk '{split($0,a,"-"); print a[2] }')
		HOUR_FLAG=$(echo $WL_TRAINING_TIME | grep "h")
		MINUTE_FLAG=$(echo $WL_TRAINING_TIME | grep "m")
		SECOND_FLAG=$(echo $WL_TRAINING_TIME | grep "s")
		if [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" == "" ]];
		then
			WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
			echo "c1: $WL_TRAINING_TIME"
		elif [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" != "" ]];
		then
			WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
			WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/m/m /g')
			echo "c2: $WL_TRAINING_TIME"
		elif [[ "$HOUR_FLAG" == "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" != "" ]];
		then
			WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/m/m /g')
			echo "c3: $WL_TRAINING_TIME"
		elif [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" == "" ]] && [[ "$SECOND_FLAG" != "" ]];
		then
			WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
			echo "c4: $WL_TRAINING_TIME"
		fi
		
		echo 模型参数版本: $WL_VERSION_NAME 模型训练时间: $WL_TRAINING_TIME
		waiting02 600
		echo "---------------------------------------------"
    fi
done