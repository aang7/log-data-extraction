#!/bin/bash
. ./utils.lib

# NOTE: This file does the same as logextract.sh
# but was modified to parse just one file at a time.
# the file has to be passed through as the first argument
FILE_EXTENSION=".log"
DIRECTORY="mediciones" # this is the directory where the log files are in
file="$DIRECTORY/$1" # first argument: the file name in the folder named as $DIRECTORY 
DIR="../GeneratedData"
TEMP_FILE_NAME="temp_$1"
echo "$TEMP_FILE_NAME"
# ALGORITHM
# read files
# create temp file to save grep result
# filter lines getting the line number

echo "$file"
echo "$DIR"

mkdir -p $DIR # create folder if does not exists


if [[ ${file: -${#FILE_EXTENSION}} == $FILE_EXTENSION ]]; # checks if file has the FILE_EXTENSION criteria
then
    # get lines with specified lenght (min: 510 chars max: 511)
    grep -anx '.\{510,511\}' $file > "$DIR/$TEMP_FILE_NAME"

    # replace ':' with '-'
    sed -ri 's/[:]+/-/g' "$DIR/$TEMP_FILE_NAME"

    # read temp file and filter the desired GeneratedCSV
    input="$DIR/$TEMP_FILE_NAME"

    i=0
    while IFS= read -r line
    do

	i=$((i+1))
	delimeter='-'
	SplitLineByDelimeter line delimeter split_result
	line_number="${split_result[0]}"
	data="${split_result[-1]}" # encoded data from the ekm metering

	re='^[0-9a-zA-Z]+$' # regex to check if variable is alphanumeric
	if [[ $data =~ $re ]] ;
	then
	    date_line_number=$(($line_number - 2))
	    # printf " line number: $line_number - 2 : $date_line_number\n"
	    # show that line
	    date_line=$(sed -n "${date_line_number}p" "$file")
	    date_line_clean=$(echo ${date_line%demos*}) # remove from word demos to the end of line
	    # add date to temp file
	    sed -i "${i}s/$/-${date_line_clean}/" "$input"

	fi


    done < "$input"


    # create new file with temp info
    delimeter='/'
    SplitLineByDelimeter file delimeter split_result

    new_file_name=$(echo "$DIR/${split_result[-1]}.filtered")
    cp $input $new_file_name

    echo "file: $file has $i rows of data"
fi

rm $input

exit 0
