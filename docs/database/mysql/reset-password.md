SET @email='', @passwd='', @salt=MD5(RAND()); 
UPDATE customer_entity SET password_hash = CONCAT(SHA2(CONCAT(@salt, @passwd), 256), ':', @salt, ':1') WHERE email = @email;



SET @email='', @passwd='Admin@123', @salt=MD5(RAND()); 
UPDATE customer_entity SET password_hash = CONCAT(SHA2(CONCAT(@salt, @passwd), 256), ':', @salt, ':1') WHERE email = @email;


