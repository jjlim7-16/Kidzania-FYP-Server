-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: kidzania_v3
-- ------------------------------------------------------
-- Server version	5.6.40-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_type`
--

DROP TABLE IF EXISTS `account_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_type` (
  `account_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type` varchar(45) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`account_type_id`),
  UNIQUE KEY `account_type` (`account_type`,`station_id`),
  KEY `account_type_idx` (`account_type_id`),
  KEY `station_fk` (`station_id`),
  CONSTRAINT `station_fk` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_type`
--

LOCK TABLES `account_type` WRITE;
/*!40000 ALTER TABLE `account_type` DISABLE KEYS */;
INSERT INTO `account_type` VALUES (1,'Admin',NULL),(2,'Crew',1);
/*!40000 ALTER TABLE `account_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `available_sessions`
--

DROP TABLE IF EXISTS `available_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `available_sessions` (
  `session_date` date NOT NULL,
  `session_id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `noBooked` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  PRIMARY KEY (`session_date`,`session_id`),
  KEY `sessions_idx` (`session_id`),
  CONSTRAINT `sessions` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `available_sessions`
--

LOCK TABLES `available_sessions` WRITE;
/*!40000 ALTER TABLE `available_sessions` DISABLE KEYS */;
INSERT INTO `available_sessions` VALUES ('2018-07-20',1,1,1,4,4),('2018-07-20',2,1,1,1,4),('2018-07-20',3,1,1,0,4),('2018-07-20',4,1,1,0,4),('2018-07-20',5,1,1,0,4),('2018-07-20',6,1,1,0,4),('2018-07-20',7,1,1,0,4),('2018-07-20',8,1,1,1,4),('2018-07-20',9,1,1,0,4),('2018-07-20',10,1,1,0,4),('2018-07-20',11,1,1,0,4),('2018-07-20',12,1,1,0,4),('2018-07-20',13,1,1,0,4),('2018-07-20',14,1,1,0,4),('2018-07-20',15,1,1,0,4),('2018-07-20',16,1,1,0,4),('2018-07-20',17,1,2,0,4),('2018-07-20',18,1,2,0,4),('2018-07-20',19,1,2,0,4),('2018-07-20',20,1,2,0,4),('2018-07-20',21,1,2,0,4),('2018-07-20',22,1,2,0,4),('2018-07-20',23,1,2,0,4),('2018-07-20',24,1,2,0,4),('2018-07-20',25,1,2,0,4),('2018-07-20',26,1,2,0,4),('2018-07-20',27,1,2,0,4),('2018-07-20',28,1,2,0,4),('2018-07-20',29,1,2,0,4),('2018-07-20',30,1,2,0,4),('2018-07-20',31,1,2,0,4),('2018-07-20',32,1,2,0,4),('2018-07-20',57,3,6,3,4),('2018-07-20',58,3,6,0,4),('2018-07-20',59,3,6,0,4),('2018-07-20',60,3,6,0,4),('2018-07-20',61,3,6,0,4),('2018-07-20',62,3,6,0,4),('2018-07-20',63,3,6,0,4),('2018-07-20',64,3,6,0,4),('2018-07-20',65,3,6,0,4),('2018-07-20',66,3,6,0,4),('2018-07-20',67,3,6,0,4),('2018-07-20',68,3,6,0,4),('2018-07-20',69,3,6,0,4),('2018-07-20',70,3,6,0,4),('2018-07-20',71,3,6,0,4),('2018-07-20',72,3,6,0,4),('2018-07-20',73,3,6,0,4),('2018-07-20',74,3,6,0,4),('2018-07-20',75,3,6,0,4),('2018-07-20',76,3,6,0,4),('2018-07-20',77,3,6,0,4),('2018-07-20',78,3,6,0,4),('2018-07-20',79,3,6,0,4),('2018-07-20',80,3,6,0,4),('2018-07-21',1,1,1,0,4),('2018-07-21',2,1,1,0,4),('2018-07-21',3,1,1,0,4),('2018-07-21',4,1,1,0,4),('2018-07-21',5,1,1,0,4),('2018-07-21',6,1,1,0,4),('2018-07-21',7,1,1,0,4),('2018-07-21',8,1,1,0,4),('2018-07-21',9,1,1,0,4),('2018-07-21',10,1,1,0,4),('2018-07-21',11,1,1,0,4),('2018-07-21',12,1,1,0,4),('2018-07-21',13,1,1,0,4),('2018-07-21',14,1,1,0,4),('2018-07-21',15,1,1,0,4),('2018-07-21',16,1,1,0,4),('2018-07-21',17,1,2,0,4),('2018-07-21',18,1,2,0,4),('2018-07-21',19,1,2,0,4),('2018-07-21',20,1,2,0,4),('2018-07-21',21,1,2,0,4),('2018-07-21',22,1,2,0,4),('2018-07-21',23,1,2,0,4),('2018-07-21',24,1,2,0,4),('2018-07-21',25,1,2,0,4),('2018-07-21',26,1,2,0,4),('2018-07-21',27,1,2,0,4),('2018-07-21',28,1,2,0,4),('2018-07-21',29,1,2,0,4),('2018-07-21',30,1,2,0,4),('2018-07-21',31,1,2,0,4),('2018-07-21',32,1,2,0,4),('2018-07-22',1,1,1,0,4),('2018-07-22',2,1,1,0,4),('2018-07-22',3,1,1,0,4),('2018-07-22',4,1,1,0,4),('2018-07-22',5,1,1,0,4),('2018-07-22',6,1,1,0,4),('2018-07-22',7,1,1,0,4),('2018-07-22',8,1,1,0,4),('2018-07-22',9,1,1,0,4),('2018-07-22',10,1,1,0,4),('2018-07-22',11,1,1,0,4),('2018-07-22',12,1,1,0,4),('2018-07-22',13,1,1,0,4),('2018-07-22',14,1,1,0,4),('2018-07-22',15,1,1,0,4),('2018-07-22',16,1,1,0,4),('2018-07-22',17,1,2,0,4),('2018-07-22',18,1,2,0,4),('2018-07-22',19,1,2,0,4),('2018-07-22',20,1,2,0,4),('2018-07-22',21,1,2,0,4),('2018-07-22',22,1,2,0,4),('2018-07-22',23,1,2,0,4),('2018-07-22',24,1,2,0,4),('2018-07-22',25,1,2,0,4),('2018-07-22',26,1,2,0,4),('2018-07-22',27,1,2,0,4),('2018-07-22',28,1,2,0,4),('2018-07-22',29,1,2,0,4),('2018-07-22',30,1,2,0,4),('2018-07-22',31,1,2,0,4),('2018-07-22',32,1,2,0,4),('2018-07-22',57,3,6,0,4),('2018-07-22',58,3,6,0,4),('2018-07-22',59,3,6,0,4),('2018-07-22',60,3,6,0,4),('2018-07-22',61,3,6,0,4),('2018-07-22',62,3,6,0,4),('2018-07-22',63,3,6,0,4),('2018-07-22',64,3,6,0,4),('2018-07-22',65,3,6,0,4),('2018-07-22',66,3,6,0,4),('2018-07-22',67,3,6,0,4),('2018-07-22',68,3,6,0,4),('2018-07-22',69,3,6,0,4),('2018-07-22',70,3,6,0,4),('2018-07-22',71,3,6,0,4),('2018-07-22',72,3,6,0,4),('2018-07-22',73,3,6,0,4),('2018-07-22',74,3,6,0,4),('2018-07-22',75,3,6,0,4),('2018-07-22',76,3,6,0,4),('2018-07-22',77,3,6,0,4),('2018-07-22',78,3,6,0,4),('2018-07-22',79,3,6,0,4),('2018-07-22',80,3,6,0,4),('2018-07-23',1,1,1,0,4),('2018-07-23',2,1,1,0,4),('2018-07-23',3,1,1,0,4),('2018-07-23',4,1,1,0,4),('2018-07-23',5,1,1,0,4),('2018-07-23',6,1,1,0,4),('2018-07-23',7,1,1,0,4),('2018-07-23',8,1,1,0,4),('2018-07-23',9,1,1,0,4),('2018-07-23',10,1,1,0,4),('2018-07-23',11,1,1,0,4),('2018-07-23',12,1,1,0,4),('2018-07-23',13,1,1,0,4),('2018-07-23',14,1,1,0,4),('2018-07-23',15,1,1,0,4),('2018-07-23',16,1,1,0,4),('2018-07-23',17,1,2,0,4),('2018-07-23',18,1,2,0,4),('2018-07-23',19,1,2,0,4),('2018-07-23',20,1,2,0,4),('2018-07-23',21,1,2,0,4),('2018-07-23',22,1,2,0,4),('2018-07-23',23,1,2,0,4),('2018-07-23',24,1,2,0,4),('2018-07-23',25,1,2,0,4),('2018-07-23',26,1,2,0,4),('2018-07-23',27,1,2,0,4),('2018-07-23',28,1,2,0,4),('2018-07-23',29,1,2,0,4),('2018-07-23',30,1,2,0,4),('2018-07-23',31,1,2,0,4),('2018-07-23',32,1,2,0,4),('2018-07-23',57,3,6,0,4),('2018-07-23',58,3,6,0,4),('2018-07-23',59,3,6,0,4),('2018-07-23',60,3,6,0,4),('2018-07-23',61,3,6,0,4),('2018-07-23',62,3,6,0,4),('2018-07-23',63,3,6,0,4),('2018-07-23',64,3,6,0,4),('2018-07-23',65,3,6,0,4),('2018-07-23',66,3,6,0,4),('2018-07-23',67,3,6,0,4),('2018-07-23',68,3,6,0,4),('2018-07-23',69,3,6,0,4),('2018-07-23',70,3,6,0,4),('2018-07-23',71,3,6,0,4),('2018-07-23',72,3,6,0,4),('2018-07-23',73,3,6,0,4),('2018-07-23',74,3,6,0,4),('2018-07-23',75,3,6,0,4),('2018-07-23',76,3,6,0,4),('2018-07-23',77,3,6,0,4),('2018-07-23',78,3,6,0,4),('2018-07-23',79,3,6,0,4),('2018-07-23',80,3,6,0,4),('2018-07-23',113,8,9,0,4),('2018-07-23',114,8,9,0,4),('2018-07-23',115,8,9,0,4),('2018-07-23',116,8,9,0,4),('2018-07-23',117,8,9,0,4),('2018-07-23',118,8,9,0,4),('2018-07-23',119,8,9,0,4),('2018-07-23',120,8,9,0,4),('2018-07-23',121,8,9,0,4),('2018-07-23',122,8,9,0,4),('2018-07-23',123,8,9,0,4),('2018-07-23',124,8,9,0,4),('2018-07-23',125,8,9,0,4),('2018-07-23',126,8,9,0,4),('2018-07-23',127,8,9,0,4),('2018-07-23',128,8,9,0,4);
/*!40000 ALTER TABLE `available_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_details`
--

DROP TABLE IF EXISTS `booking_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_details` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `rfid` varchar(45) NOT NULL,
  `queue_no` varchar(5) NOT NULL,
  `booking_status` varchar(45) NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking` (`session_id`,`session_date`,`rfid`,`booking_status`),
  KEY `available_sessions_fk_idx` (`session_date`,`session_id`),
  CONSTRAINT `available_sessions_fk` FOREIGN KEY (`session_date`, `session_id`) REFERENCES `available_sessions` (`session_date`, `session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_details`
--

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
INSERT INTO `booking_details` VALUES (47,1,'2018-07-20',1,1,'e0001','A0001','Confirmed'),(48,1,'2018-07-20',1,1,'e0002','A0002','Confirmed'),(49,1,'2018-07-20',1,1,'e0003','A0003','Confirmed'),(50,1,'2018-07-20',1,1,'e0004','A0004','Confirmed'),(51,57,'2018-07-20',3,6,'e0001','A0001','Confirmed'),(52,57,'2018-07-20',3,6,'e0002','A0002','Confirmed'),(53,57,'2018-07-20',3,6,'e0003','A0003','Confirmed'),(55,8,'2018-07-20',1,1,'test','A0005','Booked');
/*!40000 ALTER TABLE `booking_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`check_booking_limit_BEFORE_INSERT` 
BEFORE INSERT ON `booking_details` FOR EACH ROW
BEGIN
	DECLARE user_booking_count, booking_limit, numBooked, cap INT;
    DECLARE has_current_booking TINYINT;
    SELECT DISTINCT (CASE WHEN (rfid IS NOT NULL) THEN TRUE END) INTO has_current_booking
    FROM booking_details 
	WHERE rfid = NEW.rfid AND booking_status='Confirmed'
	AND session_date = NEW.session_date;
    
    IF has_current_booking IS NULL THEN
		SELECT noBooked, capacity INTO numBooked, cap FROM available_sessions
		WHERE session_id = NEW.session_id AND session_date = NEW.session_date;
		
		IF numBooked < cap THEN    
			SELECT b.booking_limit INTO booking_limit FROM booking_limit b
			WHERE b.role_id = NEW.role_id AND b.session_date = NEW.session_date;
			IF booking_limit is not null THEN
				SELECT COUNT(*) INTO user_booking_count FROM booking_details 
				WHERE session_date = NEW.session_date AND booking_status='Confirmed'
				AND rfid = NEW.rfid AND role_id = NEW.role_id;
				
				IF user_booking_count IS NOT NULL AND user_booking_count > booking_limit THEN
					# PREVENT BOOKING IF USER BOOKING IS PAST LIMIT
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = 'User Has Reached Booking Limit For Station';
				END IF;
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Max Capacity Reached';
		END IF;
	ELSE
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'User Has Current Booking!';
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`booking_details_AFTER_INSERT` 
AFTER INSERT ON `booking_details` FOR EACH ROW
BEGIN
	UPDATE available_sessions SET noBooked = noBooked + 1
    WHERE session_id = NEW.session_id AND session_date = NEW.session_date;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `booking_limit`
--

DROP TABLE IF EXISTS `booking_limit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_limit` (
  `limit_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `booking_limit` int(11) DEFAULT NULL,
  PRIMARY KEY (`limit_id`),
  UNIQUE KEY `station_role` (`session_date`,`station_id`,`role_id`),
  KEY `sessions_idx` (`station_id`,`role_id`),
  CONSTRAINT `session_date` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `sessions` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_limit`
--

LOCK TABLES `booking_limit` WRITE;
/*!40000 ALTER TABLE `booking_limit` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_limit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `session_start` time NOT NULL,
  `session_end` time NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session` (`station_id`,`role_id`,`session_start`),
  KEY `station_role_idx` (`station_id`,`role_id`),
  CONSTRAINT `station_role` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `station_roles` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,1,1,'10:00:00','10:30:00',4),(2,1,1,'10:30:00','11:00:00',4),(3,1,1,'11:00:00','11:30:00',4),(4,1,1,'11:30:00','12:00:00',4),(5,1,1,'12:00:00','12:30:00',4),(6,1,1,'12:30:00','13:00:00',4),(7,1,1,'13:00:00','13:30:00',4),(8,1,1,'13:30:00','14:00:00',4),(9,1,1,'14:00:00','14:30:00',4),(10,1,1,'14:30:00','15:00:00',4),(11,1,1,'15:00:00','15:30:00',4),(12,1,1,'15:30:00','16:00:00',4),(13,1,1,'16:00:00','16:30:00',4),(14,1,1,'16:30:00','17:00:00',4),(15,1,1,'17:00:00','17:30:00',4),(16,1,1,'17:30:00','18:00:00',4),(17,1,2,'10:00:00','10:30:00',4),(18,1,2,'10:30:00','11:00:00',4),(19,1,2,'11:00:00','11:30:00',4),(20,1,2,'11:30:00','12:00:00',4),(21,1,2,'12:00:00','12:30:00',4),(22,1,2,'12:30:00','13:00:00',4),(23,1,2,'13:00:00','13:30:00',4),(24,1,2,'13:30:00','14:00:00',4),(25,1,2,'14:00:00','14:30:00',4),(26,1,2,'14:30:00','15:00:00',4),(27,1,2,'15:00:00','15:30:00',4),(28,1,2,'15:30:00','16:00:00',4),(29,1,2,'16:00:00','16:30:00',4),(30,1,2,'16:30:00','17:00:00',4),(31,1,2,'17:00:00','17:30:00',4),(32,1,2,'17:30:00','18:00:00',4),(57,3,6,'10:00:00','10:20:00',4),(58,3,6,'10:20:00','10:40:00',4),(59,3,6,'10:40:00','11:00:00',4),(60,3,6,'11:00:00','11:20:00',4),(61,3,6,'11:20:00','11:40:00',4),(62,3,6,'11:40:00','12:00:00',4),(63,3,6,'12:00:00','12:20:00',4),(64,3,6,'12:20:00','12:40:00',4),(65,3,6,'12:40:00','13:00:00',4),(66,3,6,'13:00:00','13:20:00',4),(67,3,6,'13:20:00','13:40:00',4),(68,3,6,'13:40:00','14:00:00',4),(69,3,6,'14:00:00','14:20:00',4),(70,3,6,'14:20:00','14:40:00',4),(71,3,6,'14:40:00','15:00:00',4),(72,3,6,'15:00:00','15:20:00',4),(73,3,6,'15:20:00','15:40:00',4),(74,3,6,'15:40:00','16:00:00',4),(75,3,6,'16:00:00','16:20:00',4),(76,3,6,'16:20:00','16:40:00',4),(77,3,6,'16:40:00','17:00:00',4),(78,3,6,'17:00:00','17:20:00',4),(79,3,6,'17:20:00','17:40:00',4),(80,3,6,'17:40:00','18:00:00',4),(113,8,9,'10:00:00','10:30:00',4),(114,8,9,'10:30:00','11:00:00',4),(115,8,9,'11:00:00','11:30:00',4),(116,8,9,'11:30:00','12:00:00',4),(117,8,9,'12:00:00','12:30:00',4),(118,8,9,'12:30:00','13:00:00',4),(119,8,9,'13:00:00','13:30:00',4),(120,8,9,'13:30:00','14:00:00',4),(121,8,9,'14:00:00','14:30:00',4),(122,8,9,'14:30:00','15:00:00',4),(123,8,9,'15:00:00','15:30:00',4),(124,8,9,'15:30:00','16:00:00',4),(125,8,9,'16:00:00','16:30:00',4),(126,8,9,'16:30:00','17:00:00',4),(127,8,9,'17:00:00','17:30:00',4),(128,8,9,'17:30:00','18:00:00',4);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station_roles`
--

DROP TABLE IF EXISTS `station_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `station_roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `noOfReservedSlots` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `durationInMins` int(11) NOT NULL,
  `imagepath` varchar(150) NOT NULL,
  PRIMARY KEY (`role_id`,`station_id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `station_id_idx` (`station_id`),
  CONSTRAINT `station_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_roles`
--

LOCK TABLES `station_roles` WRITE;
/*!40000 ALTER TABLE `station_roles` DISABLE KEYS */;
INSERT INTO `station_roles` VALUES (1,1,'Pilot',2,4,30,'Role-Pilot.png'),(2,1,'Cabin Crew',2,4,30,'Role-Cabin Crew.png'),(6,3,'Pizza Chef',2,4,20,'Role-Pizza Chef.jpeg'),(9,8,'Chef',2,4,30,'Role-Chef.jpeg'),(10,8,'Waiter',2,4,30,'Role-Waiter.jpeg');
/*!40000 ALTER TABLE `station_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stations` (
  `station_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(45) NOT NULL,
  `description` varchar(500) NOT NULL,
  `station_start` time NOT NULL,
  `station_end` time NOT NULL,
  `imagepath` varchar(150) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  PRIMARY KEY (`station_id`),
  UNIQUE KEY `station_name` (`station_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,'Aviation Academy','Get a rare opportunity to be inside a cockpit and have a taste of \nwhat it feels like to operate an aircraft! Work in the sky as you flash your brightest \nsmile and serve the passengers on board the flight as an esteemed Cabin Crew!','10:00:00','18:00:00','Aviation Academy.jpg',1),(3,'Pizza Shop','Create your own pizza, and have the freedom to arrange the delicious \npizza ingredients on it. Learn more about the ingredients and the dough, and \nwatch it all come together at the Pizza Shop.','10:00:00','18:00:00','Pizza Shop.png',1),(8,'Chicken Restaurant','Learn the steps to maintain food hygiene and assemble your very own delicious, finger lickin’ good burger. Enjoy it yourself thereafter, or share it with your loved ones.','10:00:00','18:00:00','Chicken Restaurant.png',1);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_accounts`
--

DROP TABLE IF EXISTS `user_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_accounts` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type_id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password_hash` varchar(150) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `account_type_fk` (`account_type_id`),
  CONSTRAINT `account_type_fk` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`account_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,1,'jj','$2a$10$pyMYtPfIvE.PAboF3cIx9.IsyW73voMIRxFINohzgeV0I2BxwnrEu');
/*!40000 ALTER TABLE `user_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'kidzania_v3'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `seed_daily_sessions_event` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8 */ ;;
/*!50003 SET character_set_results = utf8 */ ;;
/*!50003 SET collation_connection  = utf8_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `seed_daily_sessions_event` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-25 09:00:00' ON COMPLETION PRESERVE ENABLE DO INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT current_date(), session_id, s.station_id, s.role_id, 0, capacity
	FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
	AND b.session_date = current_date()
	INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `seed_test` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8 */ ;;
/*!50003 SET character_set_results = utf8 */ ;;
/*!50003 SET collation_connection  = utf8_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `seed_test` ON SCHEDULE EVERY 1 DAY STARTS '2018-07-10 13:00:00' ENDS '2018-07-30 13:00:00' ON COMPLETION PRESERVE ENABLE DO INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT current_date(), session_id, s.station_id, s.role_id, 0, capacity
	FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
	AND b.session_date = current_date()
	INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-24  9:08:18