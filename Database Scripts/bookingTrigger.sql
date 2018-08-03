CREATE DEFINER=`root`@`localhost` TRIGGER `booking_details_AFTER_UPDATE` AFTER UPDATE ON `booking_details` FOR EACH ROW BEGIN
	if new.booking_status = 'Cancelled' THEN
		UPDATE available_sessions SET noBooked = noBooked - 1
		WHERE session_id = NEW.session_id AND session_date = current_date();
	END IF;
END
