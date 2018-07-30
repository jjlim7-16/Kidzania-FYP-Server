# Set Event Scheduler
SET GLOBAL event_scheduler = ON;

# Create Event Schedule - Everyday at 9:00AM
CREATE EVENT IF NOT EXISTS `seed_daily_sessions_event`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-06-25 9:00:00' ON COMPLETION PRESERVE ENABLE 
  DO
    INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT current_date(), session_id, s.station_id, s.role_id, 0, capacity
	FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
	AND b.session_date = current_date()
	INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true;

# Create Event Schedule - Everyday at 1PM
# FOR TESTING PURPOSES
CREATE EVENT IF NOT EXISTS `seed_test`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-07-10 13:00:00' 
    ENDS '2018-07-30 13:00:00' ON COMPLETION PRESERVE ENABLE
  DO
    INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT current_date(), session_id, s.station_id, s.role_id, 0, capacity
	FROM sessions s LEFT JOIN booking_limit b ON s.role_id = b.role_id 
	AND b.session_date = current_date()
	INNER JOIN stations st ON st.station_id = s.station_id AND st.is_active = true;

# DELETE FROM available_sessions where session_date = current_date();
SELECT * FROM available_sessions where session_date = current_date();


CREATE EVENT IF NOT EXISTS `delete_past_limit_setting`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-07-26 20:00:00' ON COMPLETION PRESERVE ENABLE
  DO
    DELETE FROM `kidzania_v3`.booking_limit WHERE current_date() >= session_date;

SHOW PROCESSLIST;
# DROP EVENT IF EXISTS `seed_daily_sessions_event`;
# DROP EVENT IF EXISTS `seed_test`;
# DROP EVENT IF EXISTS `delete_past_limit_setting`;
SHOW EVENTS FROM `kidzania_v3`;