# Set Event Scheduler
SET GLOBAL event_scheduler = ON;

# Create Event Schedule - Everyday at 9:00AM
CREATE EVENT IF NOT EXISTS `seed_daily_sessions_event`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-06-25 9:00:00' ON COMPLETION PRESERVE ENABLE 
  DO
    INSERT INTO available_sessions (session_date, session_id, station_id, role_id, noBooked)
    SELECT current_date(), session_id, station_id, role_id, 0 FROM sessions;

# Create Event Schedule - Everyday at 13:00PM
# FOR TESTING PURPOSES
CREATE EVENT IF NOT EXISTS `seed_test`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-06-25 13:00:00' 
    ENDS '2018-07-5 13:00:00' ON COMPLETION PRESERVE ENABLE
  DO
    INSERT INTO available_sessions (session_date, session_id, station_id, role_id, noBooked)
    SELECT current_date(), session_id, station_id, role_id, 0 FROM sessions;

    
# DELETE FROM available_sessions where session_date = current_date();
SELECT * FROM available_sessions where session_date = current_date();

# DROP EVENT IF EXISTS `seed_daily_sessions_event`;
# DROP EVENT IF EXISTS `seed_test`;
SHOW EVENTS FROM `kidzania_fyp_v2`;