CREATE DATABASE IF NOT EXISTS vacations_blog;

USE vacations_blog;

CREATE TABLE IF NOT EXISTS users(
    user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_first_name VARCHAR(255) NOT NULL,
    user_last_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role ENUM('user', 'admin') NOT NULL
);

INSERT INTO users (user_first_name, user_last_name, user_email, user_password, user_role)
VALUES
('Aviv', 'Cohen', 'avivcohen@gmail.com', '$2b$10$7zHfQBsV1Jw/f9rgjNxV6.iMnMKBhXiBoFPkgd16Gdt1pXb5vWb5C', 'user'), -- סיסמא: password123
('Roni', 'Levi', 'ronilevi@gmail.com', '$2b$10$zOqcfPTNVu2M9QowF4D1k.2nnsH8Bd9/jklFq8xXfXrRlmq8s57m6', 'user'), -- סיסמא: password456
('Gilor', 'Cohen', 'gilor6811@gmail.com', '$2b$10$BP/dq.vJaWZzAJwf2fRmq.k6LVcBeG/eNNjXp1W3//12R5iD5Yn2S', 'user'); 


INSERT INTO users (user_first_name, user_last_name, user_email, user_password, user_role)
VALUES
('Noa', 'Israeli', 'noaisraeli@gmail.com', '$2b$10$6jp8X43j2iyDO7IMeB7/0JgnnU8YP8m/oLqzK7X9YReZvU2lHhAO6', 'admin'), -- סיסמא: adminpass789
('Gilor', 'Cohen', 'gilor6812@gmail.com', '$2b$10$BP/dq.vJaWZzAJwf2fRmq.k6LVcBeG/eNNjXp1W3//12R5iD5Yn2S', 'admin'); 


CREATE TABLE IF NOT EXISTS vacations(
    vacations_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    vacation_destination VARCHAR(255) NOT NULL,
    vacation_description TEXT NOT NULL, 
    vacation_start_date DATE NOT NULL, 
    vacation_end_date DATE NOT NULL, 
    vacation_price INT NOT NULL, 
    vacation_image TEXT NOT NULL
);

INSERT INTO vacations 
(vacation_destination, vacation_description, vacation_start_date, vacation_end_date, vacation_price, vacation_image)
VALUES
('Paris, France', 'Discover the magic of Paris, the city of love, with its romantic streets, world-famous Eiffel Tower, exquisite French cuisine, and charming cafes. Enjoy breathtaking views from Montmartre and stroll along the Seine River for an unforgettable experience.', '2025-03-10', '2025-03-17', 1500, 'files/images/Paris.jpg'),
('Tokyo, Japan', 'Immerse yourself in the vibrant culture of Tokyo, a city that blends the ultramodern with the traditional. Experience the cherry blossoms in Ueno Park, savor authentic sushi, and visit historical sites like the Meiji Shrine and the Tokyo Tower.', '2025-04-01', '2025-04-10', 2000, 'files/images/Tokyo.jpg'),
('New York, USA', 'Dive into the dynamic energy of New York City, where iconic landmarks like Times Square, Central Park, and the Statue of Liberty await. Indulge in world-class dining, Broadway shows, and endless shopping opportunities.', '2025-06-15', '2025-06-20', 1800, 'files/images/New_York.jpg'),
('Rome, Italy', 'Step into history as you explore Rome, a city filled with ancient ruins like the Colosseum, Roman Forum, and Pantheon. Relish authentic Italian dishes and gelato while wandering through the beautiful piazzas and fountains.', '2025-05-05', '2025-05-12', 1600, 'files/images/Rome.jpg'),
('Bali, Indonesia', 'Escape to Bali, a tropical paradise known for its stunning beaches, lush green rice terraces, and vibrant culture. Rejuvenate your soul with yoga retreats, explore sacred temples, and enjoy vibrant local markets.', '2025-07-01', '2025-07-08', 1400, 'files/images/Bali.jpg'),
('Sydney, Australia', 'Discover the beauty of Sydney, home to iconic landmarks like the Sydney Opera House and Harbour Bridge. Bask in the sunshine on Bondi Beach, explore Darling Harbour, and enjoy breathtaking coastal walks.', '2025-08-10', '2025-08-20', 2100, 'files/images/Sydney.jpg'),
('Cape Town, South Africa', 'Experience the vibrant culture and natural beauty of Cape Town. Take a cable car ride up Table Mountain, visit Robben Island, and explore the Cape Winelands for an unforgettable adventure.', '2025-09-15', '2025-09-25', 1700, 'files/images/Cape_Town.jpg'),
('Rio de Janeiro, Brazil', 'Join the excitement of Rio de Janeiro, famous for its lively carnival, stunning beaches like Copacabana, and breathtaking views from the Christ the Redeemer statue. Experience samba music and vibrant nightlife.', '2025-02-20', '2025-02-28', 1900, 'files/images/Rio_de_Janeiro.jpg'),
('Santorini, Greece', 'Admire the beauty of Santorini, an island known for its whitewashed buildings, deep blue waters, and stunning sunsets. Explore charming villages, volcanic beaches, and indulge in Greek delicacies.', '2025-06-10', '2025-06-17', 1500, 'files/images/Santorini.jpg'),
('Dubai, UAE', 'Visit the futuristic city of Dubai, where luxury meets tradition. Explore breathtaking skyscrapers like the Burj Khalifa, shop in world-famous malls, and enjoy a desert safari with thrilling dune bashing.', '2025-11-01', '2025-11-10', 2500, 'files/images/Dubai.jpg'),
('Machu Picchu, Peru', 'Discover the ancient wonders of Machu Picchu, nestled in the Andes Mountains. Hike through stunning trails, explore Inca ruins, and soak in the spiritual energy of this world heritage site.', '2025-10-05', '2025-10-15', 2200, 'files/images/Machu_Picchu.jpg'),
('Queenstown, New Zealand', 'Explore the adventure capital of the world, Queenstown. Try thrilling activities like bungee jumping, jet boating, and skydiving. Enjoy serene lakes, majestic mountains, and local wineries.', '2025-12-10', '2025-12-20', 2300, 'files/images/Queenstown.jpg');


CREATE TABLE IF NOT EXISTS follow(
    user_id INT,
    vacations_id INT,
    CONSTRAINT fk_follow_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_follow_vacation FOREIGN KEY (vacations_id) REFERENCES vacations(vacations_id) ON DELETE CASCADE
);


INSERT INTO follow (user_id, vacations_id)
VALUES 
(1, 1),
(1, 4),
(1, 7),
(1, 10),
(2, 2),
(2, 5),
(2, 8),
(2, 11),
(3, 3),
(3, 6),
(3, 9),
(3, 12);
