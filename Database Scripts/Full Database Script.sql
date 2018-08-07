-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: kidzania_v3
-- ------------------------------------------------------
-- Server version	5.7.22-log

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_type`
--

LOCK TABLES `account_type` WRITE;
/*!40000 ALTER TABLE `account_type` DISABLE KEYS */;
INSERT INTO `account_type` VALUES (2,'Admin',NULL),(3,'Crew',1),(1,'Master Admin',NULL);
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
  UNIQUE KEY `available_sessions_idx` (`session_date`,`session_id`),
  KEY `sessions_idx` (`session_id`),
  CONSTRAINT `sessions` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `available_sessions`
--

LOCK TABLES `available_sessions` WRITE;
/*!40000 ALTER TABLE `available_sessions` DISABLE KEYS */;
INSERT INTO `available_sessions` VALUES ('2018-08-07',297,1,1,0,6),('2018-08-07',298,1,1,0,6),('2018-08-07',299,1,1,0,6),('2018-08-07',300,1,1,0,6),('2018-08-07',301,1,1,0,6),('2018-08-07',302,1,1,0,6),('2018-08-07',303,1,1,0,6),('2018-08-07',304,1,1,0,6),('2018-08-07',305,1,1,0,6),('2018-08-07',306,1,1,0,6),('2018-08-07',307,1,1,0,6),('2018-08-07',308,1,1,0,6),('2018-08-07',309,1,1,0,6),('2018-08-07',310,1,1,0,6),('2018-08-07',311,1,1,0,6),('2018-08-07',312,1,1,0,6),('2018-08-07',313,1,1,0,6),('2018-08-07',314,1,1,0,6),('2018-08-07',315,1,1,0,6),('2018-08-07',316,1,1,0,6),('2018-08-07',317,1,1,0,6),('2018-08-07',318,1,1,0,6),('2018-08-07',319,1,1,0,6),('2018-08-07',320,1,1,0,6),('2018-08-07',321,1,2,0,4),('2018-08-07',322,1,2,0,4),('2018-08-07',323,1,2,0,4),('2018-08-07',324,1,2,0,4),('2018-08-07',325,1,2,0,4),('2018-08-07',326,1,2,0,4),('2018-08-07',327,1,2,0,4),('2018-08-07',328,1,2,0,4),('2018-08-07',329,1,2,0,4),('2018-08-07',330,1,2,0,4),('2018-08-07',331,1,2,0,4),('2018-08-07',332,1,2,0,4),('2018-08-07',333,1,2,0,4),('2018-08-07',334,1,2,0,4),('2018-08-07',335,1,2,0,4),('2018-08-07',336,1,2,0,4),('2018-08-07',337,1,2,0,4),('2018-08-07',338,1,2,0,4),('2018-08-07',339,1,2,0,4),('2018-08-07',340,1,2,0,4),('2018-08-07',341,1,2,0,4),('2018-08-07',342,1,2,0,4),('2018-08-07',343,1,2,0,4),('2018-08-07',344,1,2,0,4);
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
  `time_in` time DEFAULT NULL,
  `queue_no` varchar(5) NOT NULL,
  `booking_status` varchar(45) NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking` (`session_id`,`session_date`,`rfid`,`booking_status`),
  KEY `available_sessions_fk_idx` (`session_date`,`session_id`),
  CONSTRAINT `available_sessions_fk` FOREIGN KEY (`session_date`, `session_id`) REFERENCES `available_sessions` (`session_date`, `session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_details`
--

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_details` ENABLE KEYS */;
UNLOCK TABLES;

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
  `booking_limit` int(11) NOT NULL,
  PRIMARY KEY (`limit_id`),
  UNIQUE KEY `station_role` (`session_date`,`station_id`,`role_id`),
  KEY `sessions_idx` (`station_id`,`role_id`),
  CONSTRAINT `session_date` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `sessions` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_limit`
--

LOCK TABLES `booking_limit` WRITE;
/*!40000 ALTER TABLE `booking_limit` DISABLE KEYS */;
INSERT INTO `booking_limit` VALUES (12,'2018-08-08',1,1,8);
/*!40000 ALTER TABLE `booking_limit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_date` date NOT NULL,
  `station_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `reservedFrom` time NOT NULL,
  `reservedTo` time NOT NULL,
  `noOfReservedSlots` int(11) DEFAULT NULL,
  `remarks` varchar(100) NOT NULL,
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `reservation_index` (`session_date`,`station_id`,`role_id`,`reservedFrom`,`reservedTo`),
  KEY `station_roles_fk_idx` (`station_id`,`role_id`),
  CONSTRAINT `station_roles_fk` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `station_roles` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (8,'2018-08-02',1,2,'11:00:00','15:00:00',NULL,'Birthday Party!'),(20,'2018-08-02',1,2,'15:00:00','17:00:00',NULL,'Birthday Party'),(23,'2018-08-06',1,2,'11:00:00','15:00:00',NULL,'Birthday Party: John'),(24,'2018-08-06',1,2,'10:00:00','10:20:00',NULL,'asd'),(25,'2018-08-06',1,2,'10:20:00','11:00:00',NULL,'Party'),(26,'2018-08-07',1,1,'10:00:00','12:00:00',NULL,'Party');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`reservations_BEFORE_INSERT` BEFORE INSERT ON `reservations` FOR EACH ROW
BEGIN
	DECLARE reservation INT;
    #SELECT reservation_id INTO reservation FROM reservations
    #WHERE session_date = NEW.session_date 
    #AND ((NEW.reservedFrom >= reservedFrom 
    #AND NEW.reservedTo <= reservedTo) 
    #OR (NEW.reservedFrom < reservedFrom AND NEW.reservedTo > reservedTo));
    
    SELECT reservation_id INTO reservation FROM reservations
	WHERE session_date = current_date() AND role_id = NEW.role_id 
	AND ((NEW.reservedFrom > reservedFrom AND NEW.reservedFrom < reservedTo)
    OR (NEW.reservedTo >= reservedFrom AND NEW.reservedTo <= reservedTo)
	OR (NEW.reservedFrom <= reservedFrom AND NEW.reservedTo >= reservedTo))
    LIMIT 1;
    
    IF reservation IS NOT NULL THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'reservation exists';
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
) ENGINE=InnoDB AUTO_INCREMENT=589 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (297,1,1,'10:00:00','10:20:00',6),(298,1,1,'10:20:00','10:40:00',6),(299,1,1,'10:40:00','11:00:00',6),(300,1,1,'11:00:00','11:20:00',6),(301,1,1,'11:20:00','11:40:00',6),(302,1,1,'11:40:00','12:00:00',6),(303,1,1,'12:00:00','12:20:00',6),(304,1,1,'12:20:00','12:40:00',6),(305,1,1,'12:40:00','13:00:00',6),(306,1,1,'13:00:00','13:20:00',6),(307,1,1,'13:20:00','13:40:00',6),(308,1,1,'13:40:00','14:00:00',6),(309,1,1,'14:00:00','14:20:00',6),(310,1,1,'14:20:00','14:40:00',6),(311,1,1,'14:40:00','15:00:00',6),(312,1,1,'15:00:00','15:20:00',6),(313,1,1,'15:20:00','15:40:00',6),(314,1,1,'15:40:00','16:00:00',6),(315,1,1,'16:00:00','16:20:00',6),(316,1,1,'16:20:00','16:40:00',6),(317,1,1,'16:40:00','17:00:00',6),(318,1,1,'17:00:00','17:20:00',6),(319,1,1,'17:20:00','17:40:00',6),(320,1,1,'17:40:00','18:00:00',6),(321,1,2,'10:00:00','10:20:00',4),(322,1,2,'10:20:00','10:40:00',4),(323,1,2,'10:40:00','11:00:00',4),(324,1,2,'11:00:00','11:20:00',4),(325,1,2,'11:20:00','11:40:00',4),(326,1,2,'11:40:00','12:00:00',4),(327,1,2,'12:00:00','12:20:00',4),(328,1,2,'12:20:00','12:40:00',4),(329,1,2,'12:40:00','13:00:00',4),(330,1,2,'13:00:00','13:20:00',4),(331,1,2,'13:20:00','13:40:00',4),(332,1,2,'13:40:00','14:00:00',4),(333,1,2,'14:00:00','14:20:00',4),(334,1,2,'14:20:00','14:40:00',4),(335,1,2,'14:40:00','15:00:00',4),(336,1,2,'15:00:00','15:20:00',4),(337,1,2,'15:20:00','15:40:00',4),(338,1,2,'15:40:00','16:00:00',4),(339,1,2,'16:00:00','16:20:00',4),(340,1,2,'16:20:00','16:40:00',4),(341,1,2,'16:40:00','17:00:00',4),(342,1,2,'17:00:00','17:20:00',4),(343,1,2,'17:20:00','17:40:00',4),(344,1,2,'17:40:00','18:00:00',4);
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
  `capacity` int(11) NOT NULL,
  `imagepath` varchar(150) NOT NULL,
  PRIMARY KEY (`role_id`,`station_id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `station_id_idx` (`station_id`),
  CONSTRAINT `station_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`station_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_roles`
--

LOCK TABLES `station_roles` WRITE;
/*!40000 ALTER TABLE `station_roles` DISABLE KEYS */;
INSERT INTO `station_roles` VALUES (1,1,'Pilot',6,'Role-Pilot.png'),(2,1,'Cabin Crew',4,'Role-Cabin Crew.png');
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
  `durationInMins` int(11) NOT NULL DEFAULT '30',
  `imagepath` varchar(150) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  PRIMARY KEY (`station_id`),
  UNIQUE KEY `station_name` (`station_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,'Aviation Academy','Get a rare opportunity to be inside a cockpit and have a taste of what it feels like to operate an aircraft! Work in the sky as you flash your brightest smile and serve the passengers on board the flight as an esteemed Cabin Crew!','10:00:00','18:00:00',20,'Aviation Academy.jpg',1);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`add_account_type_AFTER_INSERT` AFTER INSERT ON `stations` FOR EACH ROW
BEGIN
	INSERT INTO account_type (account_type, station_id)
    VALUES ('Crew', NEW.station_id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,2,'jj','$2b$10$QvU4Fj69uIsMe/mpTF32n.WlfXmlvxHfsgmlJqRm1w8xxjBpj7N6m'),(2,3,'crew-aviation','$2a$10$pyMYtPfIvE.PAboF3cIx9.IsyW73voMIRxFINohzgeV0I2BxwnrEu'),(7,2,'vincent','$2b$10$u0q0EM6iFIkTHYVApaPCeuhwALZciooF1cGWDI6S1oW571OuLcVz6'),(8,2,'kenneth','$2b$10$2N8v2A9xDQRqfYXpvCXs5e1MBoIxWGpozoD7heR1lyX5xtQzI5J9m'),(9,1,'master','$2b$10$2N8v2A9xDQRqfYXpvCXs5e1MBoIxWGpozoD7heR1lyX5xtQzI5J9m');
/*!40000 ALTER TABLE `user_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'kidzania_v3'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `delete_past_limit_setting` */;
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
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `delete_past_limit_setting` ON SCHEDULE EVERY 1 DAY STARTS '2018-07-26 20:00:00' ON COMPLETION PRESERVE ENABLE DO DELETE FROM booking_limit WHERE current_date() >= session_date */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `seed_daily_sessions_event` */;;
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
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `seed_test` ON SCHEDULE EVERY 1 DAY STARTS '2018-07-10 13:30:00' ENDS '2018-08-06 13:30:00' ON COMPLETION PRESERVE DISABLE DO INSERT INTO available_sessions 
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

-- Dump completed on 2018-08-07 12:36:12
