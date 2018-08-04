# Q-zee Backend Server

## Project File Structure
* Database Scripts: Contains scripts to be ran or imported to setup the databae
* Images: Where all images of stations/roles are stored
* Routes: Handles the routing of various APIs

	`| StationRouter.js` - 
* Src: Holds the 

## Setup & Installation

* Install MySQL Community Server v5.7 (Full) - https://dev.mysql.com/downloads/mysql/
* Install Git - https://git-scm.com/downloads
* Install Node.js v8.11.3 - https://nodejs.org/en/download/
* Install Yarn from CLI:
	```bash 
	$ npm i -g yarn
	```

## Setting Up MySQL Database
* Run MySQL Workbench as Administrator
* Import database script located in 'Database Script' Folder
* Run script: `SET GLOBAL EVENT_SCHEDULER = ON;`
* Ensure correct setting of username, password, and database in the */src/databasePool.js* file

## Network Configuration
* Navigate to Control Panel Network Settings and view the properties of the network the machine is currently on.

* Set Static IP Address by setting

## Deployment
```bash
# Clone project from Github Repository
$ git clone 'https://'

# Install dependencies
$ yarn install

# Set Environment to Production mode
$ SET NODE_ENV=production

# Deploy Server
$ yarn start
```

For more details, or if any bugs are found, please contact...
