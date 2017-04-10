	
	# Shell Script for pushing code to heroku.
	# Remote name - origin, url - git.heroku.com/onetimejobs.git
	# Browse to project's root directory and initialise git repository and create remote before running this script
	
	echo "Pushing code to heroku. Remote - origin"
	response=

	echo -n "Enter a name for this commit [$commitName] > "
	read response
		
	if [ -n "$response" ]; then
	commitName=$response
	fi
	
	git add .
	git commit -m "$response"
	git push heroku master
	heroku ps:scale web=1
	heroku open
	
	# TODO - log heroku in local directory
	#SCRIPTPATH=$(dirname "$SCRIPT")
	#echo "Writing logs in /$SCRIPTPATH/logs/herokuLogs.txt"
	#heroku logs --tail >> "$SCRIPTPATH" + "/logs/herokuLogs.txt"
	
	echo "Exiting script"
    exit 1
