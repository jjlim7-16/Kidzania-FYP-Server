CREATE TABLE `stations` (
  `station_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(45) NOT NULL,
  `description` varchar(500) NOT NULL,
  `station_start` time NOT NULL,
  `station_end` time NOT NULL,
  `is_active` boolean NOT NULL,
  `imagepath` varchar(150) NOT NULL,
  PRIMARY KEY (`station_id`),
  UNIQUE KEY `station_name` (`station_name`));

CREATE TABLE `station_roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `noOfReservedSlots` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `durationInMins` int(11) NOT NULL,
  `imagepath` varchar(150) NOT NULL,
  PRIMARY KEY (`station_id`, `role_id`),
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
  `capacity` int(11) NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `station_role_idx` (`station_id`,`role_id`),
  CONSTRAINT `station_role` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `station_roles` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `session` (`station_id`, `role_id`, `session_start`)
);

CREATE TABLE `booking_limit` (
  `limit_id` int NOT NULL AUTO_INCREMENT,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `booking_limit` int(11) NULL, -- NOT NULL REFERS TO NO. OF BOOKINGS ALLOWED || NULL - NO LIMITATION IMPOSED
  PRIMARY KEY (`limit_id`),
  KEY `sessions_idx` (`station_id`,`role_id`),
  CONSTRAINT `session_date` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `sessions` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `station_role` (`session_date`, `station_id`, `role_id`)
);

CREATE TABLE `available_sessions` (
  `session_date` date NOT NULL,
  `session_id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `noBooked` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  #`booking_limit` int(11) NULL, -- NOT NULL REFERS TO NO. OF BOOKINGS ALLOWED || NULL - NO LIMITATION IMPOSED
  PRIMARY KEY (`session_date`,`session_id`),
  UNIQUE KEY `available_sessions_idx` (`session_date`, `session_id`),
  KEY `sessions_idx` (`session_id`),
  CONSTRAINT `sessions` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `booking_details` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `rfid` varchar(45) NOT NULL,
  `time_in` time NULL,
  `queue_no` varchar(5) NOT NULL,
  `booking_status` varchar(45) NOT NULL, -- Confirmed | Cancelled | Not Admitted | Admitted
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking` (`session_id`, `session_date`, `rfid`, `booking_status`),
  KEY `available_sessions_fk_idx` (`session_date`,`session_id`),
  CONSTRAINT `available_sessions_fk` FOREIGN KEY (`session_date`,`session_id`) REFERENCES `available_sessions` (`session_date`,`session_id`)
  ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `account_type` (
  `account_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type` varchar(45) NOT NULL,
  `station_id` int(11) NULL,
  primary key (`account_type_id`),
  KEY `account_type_idx` (`account_type_id`),
  CONSTRAINT `station_fk` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `account_type` (`account_type`, `station_id`)
);

CREATE TABLE `user_accounts` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type_id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password_hash` varchar(150) NOT NULL,
  # name varchar(45) NOT NULL,
  primary key (`user_id`),
  CONSTRAINT `account_type_fk` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`account_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `username` (`username`)
);
