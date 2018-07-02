INSERT INTO stations (station_name, description, station_start, station_end, date_added, date_updated)
VALUES ('Aviation', 'Flyyy!', '10:00', '18:00', current_date(), current_date()),
('KFC', 'Good!', '10:00', '18:00', current_date(), current_date());

INSERT INTO station_roles (station_id, role_name, durationInMins, capacity, date_added, date_updated) 
VALUES (1, 'Pilot', 30, 4, current_date(), current_date()), (1, 'Cabin Crew', 30, 4, current_date(), current_date()),
(2, 'Chef', 20, 4, current_date(), current_date());

INSERT INTO booking_details (session_date, session_id, station_id, role_id, rfid, queue_no, booking_status)
VALUES (current_date(), 1233, 1, 1, 'e0001', 1, 'Confirmed'), (current_date(), 1233, 1, 1, 'e0002', 2, 'Confirmed'),
(current_date(), 1233, 1, 1, 'e0003', 3, 'Confirmed'),
(current_date(), 1233, 1, 1, 'e0004', 4, 'Cancelled'),
(current_date(), 1233, 1, 1, 'e0005', 5, 'Confirmed'),
(current_date(), 1233, 1, 1, 'e0004', 6, 'Confirmed');

INSERT INTO account_type VALUES ('Admin'), ('Crew');

# Password: 123123
INSERT INTO user_accounts (account_type_id, username, password_hash)
VALUES (1, 'jj', '$2a$10$pyMYtPfIvE.PAboF3cIx9.IsyW73voMIRxFINohzgeV0I2BxwnrEu');

SELECT * FROM user_accounts;