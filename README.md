# Q-zee Backend Server

## Project File Structure
```bash
├── Database Scripts          # Database Scripts Directory
├── Images                    # Image Directory
├── Routes                    # API Routes Directory
│   ├── accountRouter.js      # User Accounts API
│   ├── bookingRouter.js      # Booking Details API
│   ├── dashboardRouter.js    # Dashboard Metrics API
│   ├── limitRouter.js        # Booking Limits API
│   ├── reservationRouter.js  # VIP Reservations API
│   ├── roleRouter.js         # Roles API
│   ├── sessionRouter.js      # Role-playing Sessions API
│   └── stationRouter.js      # Stations (Establishments) API
|
└── Src                       # Startup Directory
    ├── app.js                # Server Startup
    ├── auth.js               # Authentication API
    ├── config.js             # Server Configuration
    ├── dashboard.js          # Socket-Dashboard API
    ├── databasePool.js       # Database Pool Connection
    ├── passport.js           # Configuration for Passport Authentication
    └── seedData.js           # Generation of Sessions Data Functions  
```

## Pre-Requisites
* Install MySQL Community Server v5.7 (Full)
* Install Git
* Install Node.js v8.11.3

```bash
# Install yarn
$ npm i -g yarn

# Clone Github Repository of Backend Server
$ git clone https://github.com/jjlim7-16/Kidzania-FYP-Server.git
```

## MySQL Database Setup
1. Run MySQL Workbench as Administrator

2. Import Database Script by navigating to the Data Import Page. Select the 'Import from Self-Contained File' option and upload the Database Script file located in the Project Folder

![](2018-08-03-15-04-33.png)

3. Navigate to Options File; Activate event Scheduler (ON)

![](2018-08-03-15-06-25.png)

4. Navigate to Startup/Shutdown. Ensure the server is **started**.

![](2018-08-03-15-03-38.png)

## Network Configuration

1. Navigate to Control Panel **>** Network and Internet **>** Network and Sharing Center

2. Select **Change adapter settings**

3. Right-click on **Local Area Connection** and click on **Properties**


## Deploy Server
Navigate to the project folder & open command line or powershell
```bash
# Build & Run Server In Production Mode
$ yarn deploy
```

