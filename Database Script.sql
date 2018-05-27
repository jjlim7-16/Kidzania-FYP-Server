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
  PRIMARY KEY (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `station_roles` (
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `capacity` int(11) NOT NULL,
  `date_added` date NOT NULL,
  `date_updated` date NOT NULL,
  `imagepath` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`station_id`,`role_name`),
  KEY `station_id_idx` (`station_id`),
  CONSTRAINT `station_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `session_start` time DEFAULT NULL,
  `session_end` time DEFAULT NULL,
  `date_added` date NOT NULL,
  `date_updated` date NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`session_id`,`station_id`,`role_name`),
  KEY `station_role_idx` (`station_id`,`role_name`),
  CONSTRAINT `station_role` FOREIGN KEY (`station_id`, `role_name`) REFERENCES `station_roles` (`station_id`, `role_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `available_booking_slots` (
  `session_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `capacity` int(11) NOT NULL,
  `noBooked` int(11) NOT NULL,
  `noOfVip` int(11) DEFAULT NULL,
  PRIMARY KEY (`session_id`,`station_id`,`role_name`,`session_date`),
  KEY `sessions_idx` (`session_id`,`station_id`,`role_name`),
  CONSTRAINT `sessions` FOREIGN KEY (`session_id`, `station_id`, `role_name`) REFERENCES `sessions` (`session_id`, `station_id`, `role_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `booking_details` (
  `booking_details_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `rfid` varchar(45) DEFAULT NULL,
  `queue_no` int(11) DEFAULT NULL,
  `booking_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`booking_details_id`,`session_id`,`booking_date`,`station_id`,`role_name`),
  KEY `available_booking_fk_idx` (`session_id`,`station_id`,`role_name`,`booking_date`),
  CONSTRAINT `available_booking_fk` FOREIGN KEY (`session_id`, `station_id`, `role_name`, `booking_date`) REFERENCES `available_booking_slots` (`session_id`, `station_id`, `role_name`, `session_date`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

