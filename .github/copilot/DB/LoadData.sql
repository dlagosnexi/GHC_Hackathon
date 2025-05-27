-- 1. Create a staging table to load raw data
CREATE TABLE Staging_Transactions (
    Trans_Num NVARCHAR(50),
    Amount DECIMAL(18,2),
    Trans_Date DATE,
    Trans_Time TIME,
    CategoryDescription NVARCHAR(200),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Gender NVARCHAR(20),
    DateOfBirth DATE,
    City NVARCHAR(100),
    ProfessionDescription NVARCHAR(300)
);

-- 2. Bulk insert data from the CSV file (run this on SQL Server, adjust path as needed)
BULK INSERT Staging_Transactions
FROM 'data/italian_credit_card_transactions.csv'
WITH (
    FIRSTROW = 2, -- skip header if present
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    TABLOCK,
    CODEPAGE = '65001' -- for UTF-8
);

-- 3. Insert unique values into lookup tables
INSERT INTO Profession (ProfessionDescription)
SELECT DISTINCT ProfessionDescription FROM Staging_Transactions
WHERE ProfessionDescription IS NOT NULL AND ProfessionDescription NOT IN (SELECT ProfessionDescription FROM Profession);

INSERT INTO Category (CategoryDescription)
SELECT DISTINCT CategoryDescription FROM Staging_Transactions
WHERE CategoryDescription IS NOT NULL AND CategoryDescription NOT IN (SELECT CategoryDescription FROM Category);

INSERT INTO Gender (Gender)
SELECT DISTINCT Gender FROM Staging_Transactions
WHERE Gender IS NOT NULL AND Gender NOT IN (SELECT Gender FROM Gender);

-- 4. Insert customers
INSERT INTO Customer (FirstName, LastName, GenderId, DateOfBirth, City, ProfessionId)
SELECT DISTINCT
    s.FirstName,
    s.LastName,
    g.GenderId,
    s.DateOfBirth,
    s.City,
    p.ProfessionId
FROM Staging_Transactions s
JOIN Gender g ON s.Gender = g.Gender
JOIN Profession p ON s.ProfessionDescription = p.ProfessionDescription
WHERE NOT EXISTS (
    SELECT 1 FROM Customer c
    WHERE c.FirstName = s.FirstName AND c.LastName = s.LastName AND c.DateOfBirth = s.DateOfBirth AND c.City = s.City
);

-- 5. Insert transactions
INSERT INTO [Transaction] (Trans_Num, Amount, Trans_Date, Trans_Time, CategoryId, CustomerId)
SELECT
    s.Trans_Num,
    s.Amount,
    s.Trans_Date,
    s.Trans_Time,
    c.CategoryId,
    cu.CustomerId
FROM Staging_Transactions s
JOIN Category c ON s.CategoryDescription = c.CategoryDescription
JOIN Customer cu ON s.FirstName = cu.FirstName AND s.LastName = cu.LastName AND s.DateOfBirth = cu.DateOfBirth AND s.City = cu.City;

-- 6. (Optional) Drop the staging table after loading
-- DROP TABLE Staging_Transactions;

