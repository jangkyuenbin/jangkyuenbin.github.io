#!/bin/bash

tracks=('2022_october_open' 'Aragon' 'arctic_pro_cw' '2022_september_open_cw' 'arctic_open_ccw' 'Tokyo_Training_track' '2022_october_pro' 'Spain_track' 'China_track' 'Straight_track' '2022_march_open_cw' '2022_march_pro' 'thunder_hill_pro_cw' 'caecer_loop' '2022_april_pro_ccw' 'dubai_open_ccw' 'penbay_open_ccw' 'reInvent2019_track' 'penbay_open_cw' '2022_october_pro_ccw' '2022_august_open' 'morgan_open' 'reInvent2019_wide_mirrored' '2022_summit_speedway_cw' 'New_York_Track' 'arctic_open' '2022_june_pro_cw' 'Vegas_track' 'caecer_gp' '2022_june_open' 'morgan_pro' 'New_York_Eval_Track' 'penbay_pro' 'thunder_hill_pro' '2022_july_pro_cw' 'LGSWide' '2022_october_open_ccw' '2022_may_open' 'Canada_Training' 'reInvent2019_wide_ccw' '2022_july_open' '2022_reinvent_champ' 'FS_June2020' '2022_june_pro' '2022_march_pro_ccw' 'China_eval_track' '2022_july_pro' 'Singapore' 'Mexico_track_eval' '2022_september_open_ccw' 'jyllandsringen_open_ccw' 'reInvent2019_track_cw' '2022_june_pro_ccw' '2022_summit_speedway_ccw' '2022_september_open' '2022_may_pro_ccw' 'red_star_open' '2022_october_open_cw' 'arctic_pro' 'hamption_pro' '2022_june_open_cw' 'red_star_pro_cw' 'reInvent2019_track_ccw' 'jyllandsringen_pro_cw' 'thunder_hill_open' '2022_april_pro_cw' 'H_track' '2022_august_pro_ccw' 'arctic_open_cw' '2022_may_open_cw' 'penbay_pro_cw' '2022_april_open' 'jyllandsringen_open_cw' 'Belille' '2022_april_open_ccw' '2022_april_open_cw' 'red_star_pro' 'AWS_track' 'July_2020' '2022_may_open_ccw' 'penbay_open' '2022_march_open' '2022_may_pro' '2022_august_open_cw' 'Albert' 'hamption_open' 'arctic_pro_ccw' 'Mexico_track' '2022_summit_speedway_mini' '2022_october_pro_cw' 'reInvent2019_wide_cw' '2022_may_pro_cw' 'penbay_pro_ccw' 'jyllandsringen_pro' 'jyllandsringen_open' '2022_august_pro' '2022_september_pro_ccw' '2022_july_pro_ccw' '2022_september_pro' 'Oval_track' 'Canada_Eval' '2022_june_open_ccw' 'reInvent2019_wide' 'Virtual_May19_Train_track' '2022_summit_speedway' 'dubai_open' 'London_Loop_Train' '2022_august_pro_cw' 'Monaco' 'thunder_hill_pro_ccw' 'reinvent_base' 'Bowtie_track' '2022_september_pro_cw' '2022_april_pro' 'jyllandsringen_pro_ccw' '2022_august_open_ccw' 'dubai_pro' 'AmericasGeneratedInclStart' '2022_march_pro_cw' 'red_star_pro_ccw' 'Austin' 'dubai_open_cw' '2022_march_open_ccw')

track_size=${#tracks[*]}
let track_size--
echo "赛道总数量: ${track_size}"

#重新计算数组，将原数组剔除，然后重新挨个加到原数组
update_track(){
	local a=0
	unset tracks[$track_index]
	for jj in `echo ${tracks[*]}`
	do
		tracks[$a]=$jj
		let a++
	done
}

#不能超过数组长度
if [ $1 -ge ${track_size} ];then
	echo "不能超过赛道总数量"
	exit
fi

source $DR_DIR/bin/scripts_wrapper.sh

CONFIG_FILE=$DR_CONFIG
CURRENT_UPLOAD_MODEL=$(grep -e "^DR_LOCAL_S3_MODEL_PREFIX" ${CONFIG_FILE} | awk '{split($0,a,"="); print a[2] }')
CUSTOM_TARGET=$(echo s3://$DR_LOCAL_S3_BUCKET/$DR_LOCAL_S3_CUSTOM_FILES_PREFIX/)
WL_MODEL_PREFIX="multi-track01-"
PARA_PATH=$DR_DIR/DRAutomationRunner/multi

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

function run()
{
	local current_model=$1
	local prev_model=$2
	local index=$(($3))
	S3_PATH="s3://$DR_LOCAL_S3_BUCKET/${WL_MODEL_PREFIX}${current_model}"
	S3_FILES=$(aws ${DR_LOCAL_PROFILE_ENDPOINT_URL} s3 ls ${S3_PATH} | wc -l)
	
	echo "EPOCH: ${index} 更换赛道: ${current_model}"
	echo "修改环境变量 ${CONFIG_FILE}"
	sed -i "s/^DR_WORLD_NAME=.*/DR_WORLD_NAME=${current_model}/g" $CONFIG_FILE
	if [ ${index} -eq 0 ]
	then
		sed -i "s/^DR_LOCAL_S3_PRETRAINED=.*/DR_LOCAL_S3_PRETRAINED=False/g" $CONFIG_FILE
	else
		sed -i "s/^DR_LOCAL_S3_PRETRAINED=.*/DR_LOCAL_S3_PRETRAINED=True/g" $CONFIG_FILE
	fi
	sed -i "s/^DR_LOCAL_S3_PRETRAINED_PREFIX=.*/DR_LOCAL_S3_PRETRAINED_PREFIX=${WL_MODEL_PREFIX}${prev_model}/g" $CONFIG_FILE
	
	echo "当前环境变量模型文件名: ${CURRENT_UPLOAD_MODEL} -->  ${WL_MODEL_PREFIX}${current_model}"
	sed -i "s/^DR_LOCAL_S3_MODEL_PREFIX=.*/DR_LOCAL_S3_MODEL_PREFIX=${WL_MODEL_PREFIX}${current_model}/g" $CONFIG_FILE
	sed -i "s/^DR_LOCAL_S3_PRETRAINED_CHECKPOINT=.*/DR_LOCAL_S3_PRETRAINED_CHECKPOINT=last/g" $CONFIG_FILE
	
	echo "从文件夹 [${PARA_PATH}/] 上传到 [${CUSTOM_TARGET}]"
	echo $(aws $DR_LOCAL_PROFILE_ENDPOINT_URL s3 rm --recursive $CUSTOM_TARGET | sed "s/delete/\ndelete/g" | sed '1d')
	echo $(aws $DR_LOCAL_PROFILE_ENDPOINT_URL s3 sync $PARA_PATH/ $CUSTOM_TARGET)
	echo "上传文件到s3桶中... $(sleep 3s)"
	
	wl-update-env
	echo "[更新后部分run.env参数]"
	echo $(grep -e "^DR_WORLD_NAME=" ${CONFIG_FILE})
	echo $(grep -e "^DR_LOCAL_S3_PRETRAINED_CHECKPOINT=" ${CONFIG_FILE})
	echo $(grep -e "^DR_LOCAL_S3_MODEL_PREFIX=" ${CONFIG_FILE})
	echo $(grep -e "^DR_LOCAL_S3_PRETRAINED=" ${CONFIG_FILE})
	echo $(grep -e "^DR_LOCAL_S3_PRETRAINED_PREFIX=" ${CONFIG_FILE})
	echo "更新s3桶环境变量中... $(sleep 3s)"
	if [[ "$S3_FILES" -gt 0 ]];
	then
		echo "[删除旧模型文件 ${S3_PATH} ]"
		$DR_DIR/scripts/training/start.sh -q -v -w
	else
		echo "[创建新模型文件 ${S3_PATH} ]"
		$DR_DIR/scripts/training/start.sh -q -v
	fi
	echo "开始训练 $(date)"
	waiting $4
	dr-stop-training
	echo "等待暂停中... $(sleep 5s)"
	echo "结束训练 $(date)"
}

dr-stop-training

PREV_MODEL_PREFIX="NONE"
#根据下标来删除数组中的元素
for i in `seq 0 $1`
do
	echo "---------------------------------------------"
	
	track_index=`echo $[RANDOM%track_size]`
	#输出一下	
	run ${tracks[$track_index]} ${PREV_MODEL_PREFIX} ${i} 6000
	PREV_MODEL_PREFIX=${tracks[$track_index]}
	update_track
	let track_size--
	echo "---------------------------------------------"
done

echo "Finetune赛道: $2"
run $2 ${PREV_MODEL_PREFIX} `expr $i + 1` 12000

sed -i "s/^DR_LOCAL_S3_PRETRAINED_CHECKPOINT=.*/DR_LOCAL_S3_PRETRAINED_CHECKPOINT=best/g" $CONFIG_FILE