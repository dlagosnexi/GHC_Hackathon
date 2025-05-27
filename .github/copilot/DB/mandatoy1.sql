-- Create the database
CREATE DATABASE MyDatabase;
GO

USE MyDatabase;
GO

-- Table: Profession
CREATE TABLE Profession (
    ProfessionId INT IDENTITY PRIMARY KEY,
    ProfessionDescription NVARCHAR(300)
);

-- Table: Category
CREATE TABLE Category (
    CategoryId INT IDENTITY PRIMARY KEY,
    CategoryDescription NVARCHAR(200)
);

-- Table: Gender
CREATE TABLE Gender (
    GenderId INT IDENTITY PRIMARY KEY,
    Gender NVARCHAR(20)
);

-- Table: Customer
CREATE TABLE Customer (
    CustomerId BIGINT IDENTITY PRIMARY KEY,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    GenderId INT,
    DateOfBirth DATE,
    City NVARCHAR(100),
    ProfessionId INT,
    FOREIGN KEY (GenderId) REFERENCES Gender(GenderId),
    FOREIGN KEY (ProfessionId) REFERENCES Profession(ProfessionId)
);

-- Table: Transaction
CREATE TABLE [Transaction] (
    Trans_Num NVARCHAR(50) PRIMARY KEY,
    Amount DECIMAL(18,2),
    Trans_Date DATE,
    Trans_Time TIME,
    CategoryId INT,
    CustomerId BIGINT,
    FOREIGN KEY (CategoryId) REFERENCES Category(CategoryId),
    FOREIGN KEY (CustomerId) REFERENCES Customer(CustomerId)
);











