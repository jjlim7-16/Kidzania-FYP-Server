# Set Event Scheduler
SET GLOBAL event_scheduler = ON;

# Create Event Schedule - Everyday at 9:00AM
CREATE EVENT IF NOT EXISTS `seed_daily_sessions_event`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-06-25 9:30:00' ON COMPLETION PRESERVE ENABLE 
  DO
    INSERT INTO available_sessions 
	(session_date, session_id, station_id, role_id, noBooked, capacity)
	SELECT date, session_id, station_id, role_id, SUM(noBooked) as noBooked, capacity 
	FROM (SELECT current_date() as date, ss.session_id, ss.station_id, ss.role_id, 
	CASE WHEN noOfReservedSlots IS NULL THEN 0 ELSE noOfReservedSlots END as noBooked, capacity
	FROM sessions ss
	INNER JOIN stations st ON st.station_id = ss.station_id AND st.is_active = true
	LEFT JOIN reservations r ON r.session_id = ss.session_id AND r.session_date = current_date()) x
	GROUP BY session_id;

# DELETE FROM available_sessions where session_date = current_date();
SELECT * FROM available_sessions where session_date = current_date();


CREATE EVENT IF NOT EXISTS `delete_past_limit_setting`
ON SCHEDULE
	EVERY 1 DAY
    STARTS '2018-07-26 20:00:00' ON COMPLETION PRESERVE ENABLE
  DO
    DELETE FROM booking_limit WHERE current_date() >= session_date;

SHOW PROCESSLIST;
# DROP EVENT IF EXISTS `seed_daily_sessions_event`;
# DROP EVENT IF EXISTS `seed_test`;
# DROP EVENT IF EXISTS `delete_past_limit_setting`;
SHOW EVENTS FROM `kidzania_v3`;