INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com'),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com');

INSERT INTO properties (address, image_url, owner, price)
VALUES ('123 classic drive', 'https://ak-sharebnb.s3.us-west-1.amazonaws.com/Champion-List.jpg',
        'testuser', 315),
        ('456 newplace drive', 
        'https://ak-sharebnb.s3.us-west-1.amazonaws.com/this-is-fine-when-your-entire-team-is-toxic-and-2034205.png',
        'testadmin', 620);