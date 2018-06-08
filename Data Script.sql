INSERT INTO stations (station_name, description, 
station_start, station_end, date_added, date_updated)
VALUES ('Aviation', 'Flyyy!', '10:00', '18:00', current_date(), current_date()),
('KFC', 'Good!', '10:00', '18:00', current_date(), current_date());

INSERT INTO station_roles (station_id, role_name, durationInMins, capacity, date_added, date_updated) 
VALUES (1, 'Pilot', 30, 4, current_date(), current_date()), (1, 'Cabin Crew', 30, 4, current_date(), current_date()),
(2, 'Chef', 20, 4, current_date(), current_date());