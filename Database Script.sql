CREATE TABLE `stations` (
  `station_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(45) NOT NULL,
  `durationInMins` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `noOfReservedSlots` int(11) DEFAULT NULL,
  `station_start` time DEFAULT NULL,
  `station_end` time DEFAULT NULL,
  `date_added` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `imagepath` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`station_id`),
  UNIQUE KEY `station_name` (`station_name`));

CREATE TABLE `station_roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `capacity` int(11) NOT NULL,
  `date_added` date NOT NULL,
  `date_updated` date NOT NULL,
  `imagepath` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`role_id`,`station_id`),
  KEY `station_id_idx` (`station_id`),
  CONSTRAINT `station_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `role_name` (`role_name`)
);

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `session_start` time NOT NULL,
  `session_end` time NOT NULL,
  `date_added` date NOT NULL,
  `date_updated` date NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`session_id`,`station_id`, `role_id`),
  KEY `station_role_idx` (`station_id`,`role_id`),
  CONSTRAINT `station_role` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `station_roles` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `session` (`station_id`, `role_id`, `session_start`)
);

CREATE TABLE `available_sessions` (
  `session_date` date NOT NULL,
  `session_id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `noBooked` int(11) NOT NULL,
  PRIMARY KEY (`session_date`,`session_id`,`station_id`, `role_id`),
  KEY `sessions_idx` (`session_id`,`station_id`,`role_id`),
  CONSTRAINT `sessions` FOREIGN KEY (`session_id`, `station_id`, `role_id`) REFERENCES `sessions` (`session_id`, `station_id`, `role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `booking_details` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `rfid` varchar(45) DEFAULT NULL,
  `queue_no` int(11) DEFAULT NULL,
  `booking_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `available_sessions_fk_idx` (`session_date`,`session_id`,`station_id`,`role_id`),
  CONSTRAINT `available_sessions_fk` FOREIGN KEY (`session_date`,`session_id`,`station_id`,`role_id`) REFERENCES `available_sessions` (`session_date`,`session_id`,`station_id`,`role_id`)
);

CREATE TABLE `user_accounts` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password_hash` varchar(150) NOT NULL,
  # name varchar(45) NOT NULL,
  primary key (`user_id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `account_type` (
  `account_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type` varchar(45) NOT NULL,
  primary key (`account_type_id`),
  UNIQUE KEY `account_type` (`account_type`)
);

CREATE TABLE `user_account_type` (
  `user_id` int(11) NOT NULL,
  `account_type_id` int(11) NOT NULL,
  primary key (`user_id`, `account_type_id`),
  KEY `user_account_type_idx` (`user_id`,`account_type_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user_accounts` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `account_type_id` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`account_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
);
