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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_type`
--

LOCK TABLES `account_type` WRITE;
/*!40000 ALTER TABLE `account_type` DISABLE KEYS */;
INSERT INTO `account_type` VALUES (2,'Admin',NULL),(3,'Crew',1),(19,'Crew',2),(20,'Crew',3),(1,'Master Admin',NULL);
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
INSERT INTO `available_sessions` VALUES ('2018-08-07',297,1,1,6,6),('2018-08-07',298,1,1,6,6),('2018-08-07',299,1,1,6,6),('2018-08-07',300,1,1,6,6),('2018-08-07',301,1,1,6,6),('2018-08-07',302,1,1,6,6),('2018-08-07',303,1,1,6,6),('2018-08-07',304,1,1,6,6),('2018-08-07',305,1,1,6,6),('2018-08-07',306,1,1,6,6),('2018-08-07',307,1,1,6,6),('2018-08-07',308,1,1,6,6),('2018-08-07',309,1,1,6,6),('2018-08-07',310,1,1,6,6),('2018-08-07',311,1,1,6,6),('2018-08-07',312,1,1,6,6),('2018-08-07',313,1,1,6,6),('2018-08-07',314,1,1,6,6),('2018-08-07',315,1,1,6,6),('2018-08-07',316,1,1,6,6),('2018-08-07',317,1,1,6,6),('2018-08-07',318,1,1,6,6),('2018-08-07',319,1,1,6,6),('2018-08-07',320,1,1,6,6),('2018-08-07',321,1,2,0,6),('2018-08-07',322,1,2,6,6),('2018-08-07',323,1,2,6,6),('2018-08-07',324,1,2,6,6),('2018-08-07',325,1,2,6,6),('2018-08-07',326,1,2,6,6),('2018-08-07',327,1,2,6,6),('2018-08-07',328,1,2,6,6),('2018-08-07',329,1,2,6,6),('2018-08-07',330,1,2,4,4),('2018-08-07',331,1,2,4,4),('2018-08-07',332,1,2,4,4),('2018-08-07',333,1,2,4,4),('2018-08-07',334,1,2,4,4),('2018-08-07',335,1,2,4,4),('2018-08-07',336,1,2,4,4),('2018-08-07',337,1,2,4,4),('2018-08-07',338,1,2,4,4),('2018-08-07',339,1,2,6,6),('2018-08-07',340,1,2,6,6),('2018-08-07',341,1,2,6,6),('2018-08-07',342,1,2,6,6),('2018-08-07',343,1,2,6,6),('2018-08-07',344,1,2,6,6),('2018-08-08',297,1,1,7,7),('2018-08-08',298,1,1,7,7),('2018-08-08',299,1,1,7,7),('2018-08-08',300,1,1,7,7),('2018-08-08',301,1,1,7,7),('2018-08-08',302,1,1,7,7),('2018-08-08',303,1,1,7,7),('2018-08-08',304,1,1,7,7),('2018-08-08',305,1,1,7,7),('2018-08-08',306,1,1,7,7),('2018-08-08',307,1,1,7,7),('2018-08-08',308,1,1,7,7),('2018-08-08',309,1,1,7,7),('2018-08-08',310,1,1,7,7),('2018-08-08',311,1,1,7,7),('2018-08-08',312,1,1,7,7),('2018-08-08',313,1,1,7,7),('2018-08-08',314,1,1,7,7),('2018-08-08',315,1,1,7,7),('2018-08-08',316,1,1,7,7),('2018-08-08',317,1,1,7,7),('2018-08-08',318,1,1,7,7),('2018-08-08',319,1,1,7,7),('2018-08-08',320,1,1,7,7),('2018-08-08',321,1,2,0,6),('2018-08-08',322,1,2,6,6),('2018-08-08',323,1,2,6,6),('2018-08-08',324,1,2,6,6),('2018-08-08',325,1,2,6,6),('2018-08-08',326,1,2,6,6),('2018-08-08',327,1,2,6,6),('2018-08-08',328,1,2,6,6),('2018-08-08',329,1,2,6,6),('2018-08-08',330,1,2,6,6),('2018-08-08',331,1,2,6,6),('2018-08-08',332,1,2,6,6),('2018-08-08',333,1,2,6,6),('2018-08-08',334,1,2,6,6),('2018-08-08',335,1,2,6,6),('2018-08-08',336,1,2,6,6),('2018-08-08',337,1,2,6,6),('2018-08-08',338,1,2,6,6),('2018-08-08',339,1,2,6,6),('2018-08-08',340,1,2,6,6),('2018-08-08',341,1,2,6,6),('2018-08-08',342,1,2,6,6),('2018-08-08',343,1,2,6,6),('2018-08-08',344,1,2,6,6),('2018-08-08',877,26,56,4,4),('2018-08-08',878,26,56,4,4),('2018-08-08',879,26,56,4,4),('2018-08-08',880,26,56,4,4),('2018-08-08',881,26,56,4,4),('2018-08-08',882,26,56,4,4),('2018-08-08',883,26,56,4,4),('2018-08-08',884,26,56,4,4),('2018-08-08',885,26,56,4,4),('2018-08-08',886,26,56,4,4),('2018-08-08',887,26,56,4,4),('2018-08-08',888,26,56,4,4),('2018-08-08',889,26,56,4,4),('2018-08-08',890,26,56,4,4),('2018-08-08',891,26,56,4,4),('2018-08-08',892,26,56,4,4),('2018-08-09',297,1,1,7,7),('2018-08-09',298,1,1,7,7),('2018-08-09',299,1,1,7,7),('2018-08-09',300,1,1,6,7),('2018-08-09',301,1,1,0,7),('2018-08-09',302,1,1,0,7),('2018-08-09',303,1,1,0,7),('2018-08-09',304,1,1,0,7),('2018-08-09',305,1,1,0,7),('2018-08-09',306,1,1,0,7),('2018-08-09',307,1,1,7,7),('2018-08-09',308,1,1,0,7),('2018-08-09',309,1,1,0,7),('2018-08-09',310,1,1,0,7),('2018-08-09',311,1,1,0,7),('2018-08-09',312,1,1,2,7),('2018-08-09',313,1,1,1,7),('2018-08-09',314,1,1,5,7),('2018-08-09',315,1,1,2,7),('2018-08-09',316,1,1,2,7),('2018-08-09',317,1,1,0,7),('2018-08-09',318,1,1,0,7),('2018-08-09',319,1,1,0,7),('2018-08-09',320,1,1,0,7),('2018-08-09',321,1,2,4,6),('2018-08-09',322,1,2,0,6),('2018-08-09',323,1,2,0,6),('2018-08-09',324,1,2,6,6),('2018-08-09',325,1,2,6,6),('2018-08-09',326,1,2,6,6),('2018-08-09',327,1,2,6,6),('2018-08-09',328,1,2,6,6),('2018-08-09',329,1,2,6,6),('2018-08-09',330,1,2,6,6),('2018-08-09',331,1,2,6,6),('2018-08-09',332,1,2,6,6),('2018-08-09',333,1,2,6,6),('2018-08-09',334,1,2,6,6),('2018-08-09',335,1,2,6,6),('2018-08-09',336,1,2,0,6),('2018-08-09',337,1,2,0,6),('2018-08-09',338,1,2,0,6),('2018-08-09',339,1,2,0,6),('2018-08-09',340,1,2,0,6),('2018-08-09',341,1,2,1,6),('2018-08-09',342,1,2,0,6),('2018-08-09',343,1,2,0,6),('2018-08-09',344,1,2,6,6),('2018-08-09',877,26,56,0,4),('2018-08-09',878,26,56,0,4),('2018-08-09',879,26,56,0,4),('2018-08-09',880,26,56,0,4),('2018-08-09',881,26,56,0,4),('2018-08-09',882,26,56,3,4),('2018-08-09',883,26,56,3,4),('2018-08-09',884,26,56,3,4),('2018-08-09',885,26,56,3,4),('2018-08-09',886,26,56,4,4),('2018-08-09',887,26,56,4,4),('2018-08-09',888,26,56,4,4),('2018-08-09',889,26,56,4,4),('2018-08-09',890,26,56,4,4),('2018-08-09',891,26,56,4,4),('2018-08-09',892,26,56,4,4),('2018-08-10',297,1,1,0,7),('2018-08-10',298,1,1,0,7),('2018-08-10',299,1,1,0,7),('2018-08-10',300,1,1,0,7),('2018-08-10',301,1,1,0,7),('2018-08-10',302,1,1,0,7),('2018-08-10',303,1,1,0,7),('2018-08-10',304,1,1,0,7),('2018-08-10',305,1,1,0,7),('2018-08-10',306,1,1,0,7),('2018-08-10',307,1,1,0,7),('2018-08-10',308,1,1,0,7),('2018-08-10',309,1,1,4,7),('2018-08-10',310,1,1,0,7),('2018-08-10',311,1,1,0,7),('2018-08-10',312,1,1,0,7),('2018-08-10',313,1,1,0,7),('2018-08-10',314,1,1,0,7),('2018-08-10',315,1,1,0,7),('2018-08-10',316,1,1,0,7),('2018-08-10',317,1,1,0,7),('2018-08-10',318,1,1,0,7),('2018-08-10',319,1,1,0,7),('2018-08-10',320,1,1,4,7),('2018-08-10',321,1,2,0,6),('2018-08-10',322,1,2,0,6),('2018-08-10',323,1,2,0,6),('2018-08-10',324,1,2,0,6),('2018-08-10',325,1,2,0,6),('2018-08-10',326,1,2,0,6),('2018-08-10',327,1,2,0,6),('2018-08-10',328,1,2,0,6),('2018-08-10',329,1,2,0,6),('2018-08-10',330,1,2,0,6),('2018-08-10',331,1,2,0,6),('2018-08-10',332,1,2,0,6),('2018-08-10',333,1,2,0,6),('2018-08-10',334,1,2,0,6),('2018-08-10',335,1,2,0,6),('2018-08-10',336,1,2,0,6),('2018-08-10',337,1,2,0,6),('2018-08-10',338,1,2,0,6),('2018-08-10',339,1,2,0,6),('2018-08-10',340,1,2,0,6),('2018-08-10',341,1,2,0,6),('2018-08-10',342,1,2,0,6),('2018-08-10',343,1,2,0,6),('2018-08-10',344,1,2,0,6),('2018-08-10',877,26,56,0,4),('2018-08-10',878,26,56,0,4),('2018-08-10',879,26,56,0,4),('2018-08-10',880,26,56,0,4),('2018-08-10',881,26,56,0,4),('2018-08-10',882,26,56,0,4),('2018-08-10',883,26,56,0,4),('2018-08-10',884,26,56,0,4),('2018-08-10',885,26,56,0,4),('2018-08-10',886,26,56,0,4),('2018-08-10',887,26,56,0,4),('2018-08-10',888,26,56,0,4),('2018-08-10',889,26,56,0,4),('2018-08-10',890,26,56,0,4),('2018-08-10',891,26,56,0,4),('2018-08-10',892,26,56,3,4);
/*!40000 ALTER TABLE `available_sessions` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`available_sessions_BEFORE_UPDATE` BEFORE UPDATE ON `available_sessions` FOR EACH ROW
BEGIN
	IF NEW.noBooked > NEW.capacity THEN
		SET NEW.noBooked = NEW.capacity;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_details`
--

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
INSERT INTO `booking_details` VALUES (1,311,'2018-08-07',1,1,'e0005','22:25:00','A0001','Admitted'),(2,311,'2018-08-07',1,1,'e0007',NULL,'A0002','Not Admitted'),(3,311,'2018-08-07',1,1,'e0006','22:34:00','A0003','Admitted'),(4,311,'2018-08-07',1,1,'e0008',NULL,'A0004','Not Admitted'),(5,310,'2018-08-07',1,1,'e0005',NULL,'A0001','Confirmed'),(6,310,'2018-08-07',1,1,'e0007',NULL,'A0002','Confirmed'),(7,310,'2018-08-07',1,1,'e0006',NULL,'A0003','Confirmed'),(8,310,'2018-08-07',1,1,'e0008',NULL,'A0004','Confirmed'),(9,314,'2018-08-07',1,1,'e0005',NULL,'A0001','Confirmed'),(10,314,'2018-08-07',1,1,'e0007',NULL,'A0002','Confirmed'),(11,314,'2018-08-07',1,1,'e0006',NULL,'A0003','Confirmed'),(12,314,'2018-08-07',1,1,'e0008',NULL,'A0004','Confirmed'),(13,331,'2018-08-07',1,2,'e0005',NULL,'A0001','Confirmed'),(14,331,'2018-08-07',1,2,'e0007',NULL,'A0002','Confirmed'),(15,331,'2018-08-07',1,2,'e0006',NULL,'A0003','Confirmed'),(16,331,'2018-08-07',1,2,'e0008',NULL,'A0004','Confirmed'),(17,332,'2018-08-07',1,2,'e0005',NULL,'A0001','Cancelled'),(18,332,'2018-08-07',1,2,'e0007',NULL,'A0002','Cancelled'),(19,332,'2018-08-07',1,2,'e0006',NULL,'A0003','Cancelled'),(20,332,'2018-08-07',1,2,'e0008',NULL,'A0004','Cancelled'),(21,337,'2018-08-07',1,1,'e0004',NULL,'A0001','Confirmed'),(22,337,'2018-08-07',1,1,'e0001',NULL,'A0002','Confirmed'),(23,337,'2018-08-07',1,1,'e0003',NULL,'A0003','Confirmed'),(24,337,'2018-08-07',1,1,'e0002',NULL,'A0004','Confirmed'),(100,892,'2018-08-08',26,56,'asd',NULL,'Z0001','Confirmed'),(101,892,'2018-08-08',26,56,'zxc',NULL,'Z0002','Confirmed'),(102,892,'2018-08-08',26,56,'qwe',NULL,'Z0003','Confirmed'),(103,892,'2018-08-08',26,56,'asdfgh',NULL,'Z0004','Confirmed'),(105,892,'2018-08-08',26,56,'asdf',NULL,'Z0005','Confirmed'),(110,892,'2018-08-08',26,56,'asdfg',NULL,'Z0006','Confirmed'),(111,892,'2018-08-08',26,56,'qwer',NULL,'Z0007','Confirmed'),(112,892,'2018-08-08',26,56,'qwert',NULL,'Z0008','Confirmed'),(113,892,'2018-08-08',26,56,'qwerty',NULL,'Z0009','Confirmed'),(114,892,'2018-08-08',26,56,'zxcv',NULL,'Z0010','Confirmed'),(115,892,'2018-08-08',26,56,'1234',NULL,'Z0011','Confirmed'),(116,892,'2018-08-08',26,56,'12345',NULL,'Z0012','Confirmed'),(117,892,'2018-08-08',26,56,'123456',NULL,'Z0013','Confirmed'),(118,892,'2018-08-08',26,56,'zxcm',NULL,'Z0014','Confirmed'),(119,892,'2018-08-08',26,56,'asdl',NULL,'Z0015','Confirmed'),(120,892,'2018-08-08',26,56,'asdr',NULL,'Z0016','Confirmed'),(121,892,'2018-08-08',26,56,'aaa',NULL,'Z0017','Confirmed'),(122,892,'2018-08-08',26,56,'qweasd',NULL,'Z0018','Confirmed'),(123,892,'2018-08-08',26,56,'aaaa',NULL,'Z0019','Confirmed'),(124,892,'2018-08-08',26,56,'SSS',NULL,'Z0020','Confirmed'),(125,892,'2018-08-08',26,56,'AA',NULL,'Z0021','Confirmed'),(126,892,'2018-08-08',26,56,'as',NULL,'Z0022','Confirmed'),(128,892,'2018-08-08',26,56,'ass',NULL,'Z0023','Confirmed'),(129,892,'2018-08-08',26,56,'ss',NULL,'Z0024','Confirmed'),(130,892,'2018-08-08',26,56,'ddd',NULL,'Z0025','Confirmed'),(131,892,'2018-08-08',26,56,'dd',NULL,'Z0026','Confirmed'),(132,892,'2018-08-08',26,56,'de',NULL,'Z0027','Confirmed'),(133,892,'2018-08-08',26,56,'12',NULL,'Z0028','Confirmed'),(134,892,'2018-08-08',26,56,'11',NULL,'Z0029','Confirmed'),(135,892,'2018-08-08',26,56,'33',NULL,'Z0030','Confirmed'),(136,892,'2018-08-08',26,56,'66',NULL,'Z0031','Confirmed'),(137,892,'2018-08-08',26,56,'77',NULL,'Z0032','Confirmed'),(138,892,'2018-08-08',26,56,'7',NULL,'Z0033','Confirmed'),(139,882,'2018-08-09',26,56,'asd',NULL,'Z0001','Confirmed'),(140,882,'2018-08-09',26,56,'aa',NULL,'Z0002','Confirmed'),(142,882,'2018-08-09',26,56,'a',NULL,'Z0003','Confirmed'),(143,883,'2018-08-09',26,56,'z',NULL,'Z0004','Confirmed'),(144,883,'2018-08-09',26,56,'x',NULL,'Z0005','Confirmed'),(145,883,'2018-08-09',26,56,'c',NULL,'Z0006','Confirmed'),(146,884,'2018-08-09',26,56,'v',NULL,'Z0007','Confirmed'),(147,884,'2018-08-09',26,56,'1',NULL,'Z0008','Confirmed'),(148,885,'2018-08-09',26,56,'2',NULL,'Z0009','Confirmed'),(149,885,'2018-08-09',26,56,'3',NULL,'Z0010','Confirmed'),(150,885,'2018-08-09',26,56,'4',NULL,'Z0011','Confirmed'),(151,886,'2018-08-09',26,56,'q',NULL,'Z0012','Confirmed'),(152,884,'2018-08-09',26,56,'w',NULL,'Z0013','Confirmed'),(153,886,'2018-08-09',26,56,'b',NULL,'Z0014','Confirmed'),(154,889,'2018-08-09',26,56,'e',NULL,'Z0015','Confirmed'),(155,889,'2018-08-09',26,56,'r',NULL,'Z0016','Confirmed'),(156,888,'2018-08-09',26,56,'t',NULL,'Z0017','Confirmed'),(157,888,'2018-08-09',26,56,'ee',NULL,'Z0018','Confirmed'),(158,888,'2018-08-09',26,56,'y',NULL,'Z0019','Confirmed'),(159,890,'2018-08-09',26,56,'zz',NULL,'Z0020','Confirmed'),(160,889,'2018-08-09',26,56,'mm',NULL,'Z0021','Confirmed'),(161,886,'2018-08-09',26,56,'n',NULL,'Z0022','Confirmed'),(162,887,'2018-08-09',26,56,'qq',NULL,'Z0023','Confirmed'),(163,887,'2018-08-09',26,56,'0',NULL,'Z0024','Confirmed'),(164,891,'2018-08-09',26,56,'12',NULL,'Z0025','Confirmed'),(165,891,'2018-08-09',26,56,'zx',NULL,'Z0026','Confirmed'),(166,887,'2018-08-09',26,56,'123',NULL,'Z0027','Confirmed'),(167,886,'2018-08-09',26,56,'222',NULL,'Z0028','Confirmed'),(168,887,'2018-08-09',26,56,'444',NULL,'Z0029','Confirmed'),(169,888,'2018-08-09',26,56,'2222',NULL,'Z0030','Confirmed'),(170,890,'2018-08-09',26,56,'zxcv',NULL,'Z0031','Confirmed'),(171,890,'2018-08-09',26,56,'99',NULL,'Z0032','Confirmed'),(172,891,'2018-08-09',26,56,'8',NULL,'Z0033','Confirmed'),(173,891,'2018-08-09',26,56,'88',NULL,'Z0034','Confirmed'),(174,889,'2018-08-09',26,56,'7',NULL,'Z0035','Confirmed'),(175,890,'2018-08-09',26,56,'77',NULL,'Z0036','Confirmed'),(176,341,'2018-08-09',1,2,'gg',NULL,'A0037','Confirmed'),(177,312,'2018-08-09',1,1,'xxx',NULL,'A0038','Confirmed'),(178,312,'2018-08-09',1,1,'xx',NULL,'A0039','Confirmed'),(179,314,'2018-08-09',1,1,'xc',NULL,'A0040','Confirmed'),(180,313,'2018-08-09',1,1,'cv',NULL,'A0041','Confirmed'),(181,314,'2018-08-09',1,1,'1234',NULL,'A0042','Confirmed'),(182,314,'2018-08-09',1,1,'12345',NULL,'A0043','Confirmed'),(183,314,'2018-08-09',1,1,'az',NULL,'A0044','Confirmed'),(184,314,'2018-08-09',1,1,'zm',NULL,'A0045','Confirmed'),(185,315,'2018-08-09',1,1,'vb',NULL,'A0046','Confirmed'),(186,316,'2018-08-09',1,1,'bv',NULL,'A0047','Confirmed'),(187,316,'2018-08-09',1,1,'90',NULL,'A0048','Confirmed'),(188,315,'2018-08-09',1,1,'66',NULL,'A0049','Confirmed'),(189,309,'2018-08-10',1,1,'e0020',NULL,'A0001','Confirmed'),(190,309,'2018-08-10',1,1,'e00017',NULL,'A0002','Confirmed'),(191,309,'2018-08-10',1,1,'e0018',NULL,'A0003','Confirmed'),(192,309,'2018-08-10',1,1,'e00019',NULL,'A0004','Confirmed');
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
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`booking_details_AFTER_UPDATE` AFTER UPDATE ON `booking_details` FOR EACH ROW
BEGIN
	IF NEW.booking_status = 'Cancelled' THEN
		UPDATE available_sessions SET noBooked = noBooked - 1
		WHERE session_id = NEW.session_id AND session_date = current_date();
	END IF;
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
  `booking_limit` int(11) NOT NULL,
  PRIMARY KEY (`limit_id`),
  UNIQUE KEY `station_role` (`session_date`,`station_id`,`role_id`),
  KEY `sessions_idx` (`station_id`,`role_id`),
  CONSTRAINT `session_date` FOREIGN KEY (`station_id`, `role_id`) REFERENCES `sessions` (`station_id`, `role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_limit`
--

LOCK TABLES `booking_limit` WRITE;
/*!40000 ALTER TABLE `booking_limit` DISABLE KEYS */;
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
  `session_id` int(11) NOT NULL,
  `noOfReservedSlots` int(11) NOT NULL,
  `remarks` varchar(100) NOT NULL,
  PRIMARY KEY (`reservation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (6,'2018-08-09',321,2,'Birthday Party'),(7,'2018-08-09',321,2,'Birthday Party'),(12,'2018-08-09',300,5,'Birthday Party'),(16,'2018-08-09',300,1,'Birthday Party'),(17,'2018-08-09',307,7,'Birthday Party'),(18,'2018-08-10',320,4,'Birthday Party'),(19,'2018-08-10',892,3,'Birthday Party');
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
	DECLARE slotsLeft INT;
    DECLARE sessionDate DATE;
    SELECT session_date INTO sessionDate FROM available_sessions 
    WHERE session_date=current_date()
    LIMIT 1;
	IF NEW.session_date = current_date() AND sessionDate IS NOT NULL THEN
		SELECT (capacity-noBooked) INTO slotsLeft
		FROM available_sessions
		WHERE session_id=NEW.session_id AND session_date = current_date();
		
		IF slotsLeft <= 0 THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Fully Booked. There are no slots left';
		END IF;
        
        IF slotsLeft >= NEW.noOfReservedSlots THEN
			UPDATE available_sessions SET noBooked = noBooked + NEW.noOfReservedSlots 
			WHERE session_id = NEW.session_id 
			AND session_date = current_date();
		ELSE
			SET @message = CONCAT('Not enough slots. There are only ', slotsLeft, ' slots left');
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = @message;
		END IF;
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
) ENGINE=InnoDB AUTO_INCREMENT=957 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (297,1,1,'10:00:00','10:20:00',7),(298,1,1,'10:20:00','10:40:00',7),(299,1,1,'10:40:00','11:00:00',7),(300,1,1,'11:00:00','11:20:00',7),(301,1,1,'11:20:00','11:40:00',7),(302,1,1,'11:40:00','12:00:00',7),(303,1,1,'12:00:00','12:20:00',7),(304,1,1,'12:20:00','12:40:00',7),(305,1,1,'12:40:00','13:00:00',7),(306,1,1,'13:00:00','13:20:00',7),(307,1,1,'13:20:00','13:40:00',7),(308,1,1,'13:40:00','14:00:00',7),(309,1,1,'14:00:00','14:20:00',7),(310,1,1,'14:20:00','14:40:00',7),(311,1,1,'14:40:00','15:00:00',7),(312,1,1,'15:00:00','15:20:00',7),(313,1,1,'15:20:00','15:40:00',7),(314,1,1,'15:40:00','16:00:00',7),(315,1,1,'16:00:00','16:20:00',7),(316,1,1,'16:20:00','16:40:00',7),(317,1,1,'16:40:00','17:00:00',7),(318,1,1,'17:00:00','17:20:00',7),(319,1,1,'17:20:00','17:40:00',7),(320,1,1,'17:40:00','18:00:00',7),(321,1,2,'10:00:00','10:20:00',6),(322,1,2,'10:20:00','10:40:00',6),(323,1,2,'10:40:00','11:00:00',6),(324,1,2,'11:00:00','11:20:00',6),(325,1,2,'11:20:00','11:40:00',6),(326,1,2,'11:40:00','12:00:00',6),(327,1,2,'12:00:00','12:20:00',6),(328,1,2,'12:20:00','12:40:00',6),(329,1,2,'12:40:00','13:00:00',6),(330,1,2,'13:00:00','13:20:00',6),(331,1,2,'13:20:00','13:40:00',6),(332,1,2,'13:40:00','14:00:00',6),(333,1,2,'14:00:00','14:20:00',6),(334,1,2,'14:20:00','14:40:00',6),(335,1,2,'14:40:00','15:00:00',6),(336,1,2,'15:00:00','15:20:00',6),(337,1,2,'15:20:00','15:40:00',6),(338,1,2,'15:40:00','16:00:00',6),(339,1,2,'16:00:00','16:20:00',6),(340,1,2,'16:20:00','16:40:00',6),(341,1,2,'16:40:00','17:00:00',6),(342,1,2,'17:00:00','17:20:00',6),(343,1,2,'17:20:00','17:40:00',6),(344,1,2,'17:40:00','18:00:00',6),(797,3,47,'10:00:00','10:15:00',6),(798,3,47,'10:15:00','10:30:00',6),(799,3,47,'10:30:00','10:45:00',6),(800,3,47,'10:45:00','11:00:00',6),(801,3,47,'11:00:00','11:15:00',6),(802,3,47,'11:15:00','11:30:00',6),(803,3,47,'11:30:00','11:45:00',6),(804,3,47,'11:45:00','12:00:00',6),(805,3,47,'12:00:00','12:15:00',6),(806,3,47,'12:15:00','12:30:00',6),(807,3,47,'12:30:00','12:45:00',6),(808,3,47,'12:45:00','13:00:00',6),(809,3,47,'13:00:00','13:15:00',6),(810,3,47,'13:15:00','13:30:00',6),(811,3,47,'13:30:00','13:45:00',6),(812,3,47,'13:45:00','14:00:00',6),(813,3,47,'14:00:00','14:15:00',6),(814,3,47,'14:15:00','14:30:00',6),(815,3,47,'14:30:00','14:45:00',6),(816,3,47,'14:45:00','15:00:00',6),(817,3,47,'15:00:00','15:15:00',6),(818,3,47,'15:15:00','15:30:00',6),(819,3,47,'15:30:00','15:45:00',6),(820,3,47,'15:45:00','16:00:00',6),(821,3,47,'16:00:00','16:15:00',6),(822,3,47,'16:15:00','16:30:00',6),(823,3,47,'16:30:00','16:45:00',6),(824,3,47,'16:45:00','17:00:00',6),(825,3,47,'17:00:00','17:15:00',6),(826,3,47,'17:15:00','17:30:00',6),(827,3,47,'17:30:00','17:45:00',6),(828,3,47,'17:45:00','18:00:00',6),(877,2,56,'10:00:00','10:30:00',4),(878,2,56,'10:30:00','11:00:00',4),(879,2,56,'11:00:00','11:30:00',4),(880,2,56,'11:30:00','12:00:00',4),(881,2,56,'12:00:00','12:30:00',4),(882,2,56,'12:30:00','13:00:00',4),(883,2,56,'13:00:00','13:30:00',4),(884,2,56,'13:30:00','14:00:00',4),(885,2,56,'14:00:00','14:30:00',4),(886,2,56,'14:30:00','15:00:00',4),(887,2,56,'15:00:00','15:30:00',4),(888,2,56,'15:30:00','16:00:00',4),(889,2,56,'16:00:00','16:30:00',4),(890,2,56,'16:30:00','17:00:00',4),(891,2,56,'17:00:00','17:30:00',4),(892,2,56,'17:30:00','18:00:00',4),(925,3,58,'10:00:00','10:15:00',2),(926,3,58,'10:15:00','10:30:00',2),(927,3,58,'10:30:00','10:45:00',2),(928,3,58,'10:45:00','11:00:00',2),(929,3,58,'11:00:00','11:15:00',2),(930,3,58,'11:15:00','11:30:00',2),(931,3,58,'11:30:00','11:45:00',2),(932,3,58,'11:45:00','12:00:00',2),(933,3,58,'12:00:00','12:15:00',2),(934,3,58,'12:15:00','12:30:00',2),(935,3,58,'12:30:00','12:45:00',2),(936,3,58,'12:45:00','13:00:00',2),(937,3,58,'13:00:00','13:15:00',2),(938,3,58,'13:15:00','13:30:00',2),(939,3,58,'13:30:00','13:45:00',2),(940,3,58,'13:45:00','14:00:00',2),(941,3,58,'14:00:00','14:15:00',2),(942,3,58,'14:15:00','14:30:00',2),(943,3,58,'14:30:00','14:45:00',2),(944,3,58,'14:45:00','15:00:00',2),(945,3,58,'15:00:00','15:15:00',2),(946,3,58,'15:15:00','15:30:00',2),(947,3,58,'15:30:00','15:45:00',2),(948,3,58,'15:45:00','16:00:00',2),(949,3,58,'16:00:00','16:15:00',2),(950,3,58,'16:15:00','16:30:00',2),(951,3,58,'16:30:00','16:45:00',2),(952,3,58,'16:45:00','17:00:00',2),(953,3,58,'17:00:00','17:15:00',2),(954,3,58,'17:15:00','17:30:00',2),(955,3,58,'17:30:00','17:45:00',2),(956,3,58,'17:45:00','18:00:00',2);
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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_roles`
--

LOCK TABLES `station_roles` WRITE;
/*!40000 ALTER TABLE `station_roles` DISABLE KEYS */;
INSERT INTO `station_roles` VALUES (1,1,'Pilot',7,'Role-Pilot.png'),(2,1,'Cabin Crew',6,'Role-Cabin Crew.png'),(47,3,'Chicken Chef',6,'Role-Chicken Chef.jpeg'),(56,2,'Pizza Waiter',4,'Role-Pizza Waiter.png'),(58,3,'Waiter',2,'Role-Waiter.jpeg');
/*!40000 ALTER TABLE `station_roles` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `kidzania_v3`.`station_roles_AFTER_UPDATE` AFTER UPDATE ON `station_roles` FOR EACH ROW
BEGIN
	UPDATE sessions SET capacity=NEW.capacity
    WHERE role_id=NEW.role_id;
    UPDATE available_sessions SET capacity=NEW.capacity
    WHERE session_date=current_date() AND role_id=NEW.role_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stations` (
  `station_id` int(11) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(80) NOT NULL,
  `description` varchar(500) NOT NULL,
  `station_start` time NOT NULL,
  `station_end` time NOT NULL,
  `durationInMins` int(11) NOT NULL DEFAULT '30',
  `imagepath` varchar(150) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  PRIMARY KEY (`station_id`),
  UNIQUE KEY `station_name` (`station_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,'Aviation Academy','Get a rare opportunity to be inside a cockpit and have a taste of what it feels like to operate an aircraft! Work in the sky as you flash your brightest smile and serve the passengers on board the flight as an esteemed Cabin Crew!','10:00:00','18:00:00',20,'Aviation Academy.jpg',1),(2,'Pizza Shop','Create your own pizza, and have the freedom to arrange the delicious pizza ingredients on it. Learn more about the ingredients and the dough, and watch it all come together at the Pizza Shop.','10:00:00','18:00:00',30,'Pizza Shop.png',1),(3,'Chicken Restaurant','Chicken','10:00:00','18:00:00',15,'Chicken Restaurant.png',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,2,'jj','$2b$10$QvU4Fj69uIsMe/mpTF32n.WlfXmlvxHfsgmlJqRm1w8xxjBpj7N6m'),(2,3,'crew-aviation','$2a$10$pyMYtPfIvE.PAboF3cIx9.IsyW73voMIRxFINohzgeV0I2BxwnrEu'),(7,2,'vincent','$2b$10$u0q0EM6iFIkTHYVApaPCeuhwALZciooF1cGWDI6S1oW571OuLcVz6'),(8,2,'kenneth','$2b$10$2N8v2A9xDQRqfYXpvCXs5e1MBoIxWGpozoD7heR1lyX5xtQzI5J9m'),(9,1,'master','$2b$10$2N8v2A9xDQRqfYXpvCXs5e1MBoIxWGpozoD7heR1lyX5xtQzI5J9m'),(11,19,'crew-pizza','$2b$10$3XtAVAA0v6xeDdo5unmLn.xWLf/38B6pMZwnH58Z901Vy47rGAnDa'),(12,20,'crew-chicken','$2b$10$o84PzdYdV8SZa1pYw4LMwuX7VzZG6atSqYS9LwK8YkM4.iq9.jx5O');
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
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `seed_daily_sessions_event` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-25 09:30:00' ON COMPLETION PRESERVE ENABLE DO INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT current_date(), s.session_id, s.station_id, s.role_id, 
	CASE WHEN noOfReservedSlots IS NULL THEN 0 ELSE noOfReservedSlots END as noBooked, capacity
	FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
	AND b.session_date = current_date()
	INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true
	LEFT JOIN reservations r ON r.session_id = s.session_id AND r.session_date = current_date() */ ;;
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

-- Dump completed on 2018-08-10  2:00:16
