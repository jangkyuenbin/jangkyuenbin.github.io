#!/bin/bash

source $DR_DIR/bin/scripts_wrapper.sh

CONFIG_FILE=$DR_CONFIG
CURRENT_UPLOAD_MODEL=$(grep -e "^DR_LOCAL_S3_MODEL_PREFIX" ${CONFIG_FILE} | awk '{split($0,a,"="); print a[2] }')
WAITING_FILES_PATH=$DR_DIR/DRAutomationRunner/waiting_files/
CUSTOM_TARGET=$(echo s3://$DR_LOCAL_S3_BUCKET/$DR_LOCAL_S3_CUSTOM_FILES_PREFIX/)
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

function waiting()
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

dr-stop-training

for file in $WAITING_FILES_PATH*
do
    if test -d $file
	then
		WL_DIR_NAME=${file##*/}
		WL_MODEL_NAME=${file##*/}
		WL_DONE_FLAG="${WL_DIR_NAME}_DONE"
		OLD_IFS="$IFS"
		IFS="_"
		array=($WL_DIR_NAME)
		IFS="$OLD_IFS"
		#echo "数组的元素为: ${array[*]}"
		if [ ! -f $file/../.$WL_DONE_FLAG ];
		then
			echo "---------------------------------------------"
			if [ ${#array[@]} -gt 1 ]
			then
				WL_DIR_NAME=${array[${#array[@]} - 1]}
				PRE_MODLE_NAME=${array[0]}
				for((i=1;i<${#array[@]} - 1;i++)) 
				do
					PRE_MODLE_NAME="$PRE_MODLE_NAME#${array[i]}"
				done
				echo 启动接续训练模式!接续模型参数位于: "${WL_MODEL_PREFIX}${PRE_MODLE_NAME}"
				echo 检查是否有对应模型文件！
				S3_PATH="s3://$DR_LOCAL_S3_BUCKET/${WL_MODEL_PREFIX}${PRE_MODLE_NAME}"
				S3_FILES=$(aws ${DR_LOCAL_PROFILE_ENDPOINT_URL} s3 ls ${S3_PATH} | wc -l)
				if [[ "$S3_FILES" -gt 0 ]];
				then
					echo "模型文件存在！继续处理"
				else
					echo $S3_PATH
					echo "模型文件不存在，跳过此模型训练！"
					continue
				fi
				echo 修改环境变量 $CONFIG_FILE
				sed -i "s/^DR_LOCAL_S3_PRETRAINED=.*/DR_LOCAL_S3_PRETRAINED=True/g"  $CONFIG_FILE
				sed -i "s/^DR_LOCAL_S3_PRETRAINED_PREFIX=.*/DR_LOCAL_S3_PRETRAINED_PREFIX=${WL_MODEL_PREFIX}${PRE_MODLE_NAME}/g"  $CONFIG_FILE
			else
				echo 修改环境变量 $CONFIG_FILE
				sed -i "s/^DR_LOCAL_S3_PRETRAINED=.*/DR_LOCAL_S3_PRETRAINED=False/g"  $CONFIG_FILE
			fi
			WL_VERSION_NAME=$(echo $WL_DIR_NAME | awk '{split($0,a,"-"); print a[1] }')
			WL_TRAINING_TIME=$(echo $WL_DIR_NAME | awk '{split($0,a,"-"); print a[2] }')
			
			HOUR_FLAG=$(echo $WL_TRAINING_TIME | grep "h")
			MINUTE_FLAG=$(echo $WL_TRAINING_TIME | grep "m")
			SECOND_FLAG=$(echo $WL_TRAINING_TIME | grep "s")
			if [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" == "" ]];
			then
				WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
				#echo "c1: $WL_TRAINING_TIME"
			elif [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" != "" ]];
			then
				WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
				WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/m/m /g')
				#echo "c2: $WL_TRAINING_TIME"
			elif [[ "$HOUR_FLAG" == "" ]] && [[ "$MINUTE_FLAG" != "" ]] && [[ "$SECOND_FLAG" != "" ]];
			then
				WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/m/m /g')
				#echo "c3: $WL_TRAINING_TIME"
			elif [[ "$HOUR_FLAG" != "" ]] && [[ "$MINUTE_FLAG" == "" ]] && [[ "$SECOND_FLAG" != "" ]];
			then
				WL_TRAINING_TIME=$(echo $WL_TRAINING_TIME | sed 's/h/h /g')
				#echo "c4: $WL_TRAINING_TIME"
			fi
			
			if [[ "$HOUR_FLAG" == "" ]]
			then
				HOUR_NUMBER=0
				MINUTE_STRING=$WL_TRAINING_TIME
			else
				HOUR_NUMBER=$(echo $WL_TRAINING_TIME | awk '{split($0,a,"h"); print a[1] }')
				MINUTE_STRING=$(echo $WL_TRAINING_TIME | awk '{split($0,a,"h"); print a[2] }')
			fi
			if [[ "$MINUTE_FLAG" == "" ]]
			then
				MINUTE_NUMBER=0
				SECOND_STRING=$MINUTE_STRING
			else
				MINUTE_NUMBER=$(echo $MINUTE_STRING | awk '{split($0,a,"m"); print a[1] }')
				SECOND_STRING=$(echo $MINUTE_STRING | awk '{split($0,a,"m"); print a[2] }')
			fi
			if [[ "$SECOND_FLAG" == "" ]]
			then
				SECOND_NUMBER=0
			else
				SECOND_NUMBER=$(echo $SECOND_STRING | awk '{split($0,a,"s"); print a[1] }')
			fi
			TOTAL_SECOND=0
			#echo 小时数: $HOUR_NUMBER
			#echo 分钟数: $MINUTE_NUMBER
			#echo 秒数: $SECOND_NUMBER
			
			if [[ "$HOUR_NUMBER" != "" ]]
			then
				TOTAL_SECOND=`expr $TOTAL_SECOND + $HOUR_NUMBER \* 3600`
			fi
			if [[ "$MINUTE_NUMBER" != "" ]]
			then
				TOTAL_SECOND=`expr $TOTAL_SECOND + $MINUTE_NUMBER \* 60`
			fi
			if [[ "$SECOND_NUMBER" != "" ]]
			then
				TOTAL_SECOND=`expr $TOTAL_SECOND + $SECOND_NUMBER`
			fi
			TOTAL_MSECOND=`expr $TOTAL_SECOND \* 10`
			#echo 总毫秒数: $TOTAL_MSECOND
			
			echo 当前环境变量模型文件名: $CURRENT_UPLOAD_MODEL "--> ${WL_MODEL_PREFIX}${WL_MODEL_NAME}"
			sed -i "s/^DR_LOCAL_S3_MODEL_PREFIX=.*/DR_LOCAL_S3_MODEL_PREFIX=${WL_MODEL_PREFIX}${WL_MODEL_NAME}/g"  $CONFIG_FILE
			
			echo 模型参数版本: $WL_VERSION_NAME 模型训练时间: $WL_TRAINING_TIME
			
			echo 从文件夹 $file/ 上传到 $CUSTOM_TARGET
			echo $(aws $DR_LOCAL_PROFILE_ENDPOINT_URL s3 rm --recursive $CUSTOM_TARGET)
			touch $file/.$WL_DONE_FLAG
			echo $(aws $DR_LOCAL_PROFILE_ENDPOINT_URL s3 sync $file/ $CUSTOM_TARGET)
			mv $file/.$WL_DONE_FLAG $file/../
			echo "上传文件到s3桶中... $(sleep 3s)"
			
			wl-update-env
			echo $(grep -e "^DR_LOCAL_S3_MODEL_PREFIX=" ${CONFIG_FILE})
			echo $(grep -e "^DR_LOCAL_S3_PRETRAINED=" ${CONFIG_FILE})
			echo $(grep -e "^DR_LOCAL_S3_PRETRAINED_PREFIX=" ${CONFIG_FILE})
			echo "更新s3桶环境变量中... $(sleep 3s)"
			$DR_DIR/scripts/training/start.sh -q
			echo "开始训练 $(date)"
			#sleep $WL_TRAINING_TIME
			waiting $TOTAL_MSECOND
			dr-stop-training
			echo "等待暂停中... $(sleep 5s)"
			echo "结束训练 $(date)"
			echo "---------------------------------------------"
		fi
    fi
done