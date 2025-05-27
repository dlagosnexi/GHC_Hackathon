using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // Look for any existing data
                if (context.Categories.Any() && context.Genders.Any() && context.Professions.Any())
                {
                    return;   // DB has been seeded
                }
                
                // Seed Genders
                var genders = new Gender[]
                {
                    new Gender { GenderName = "Male" },
                    new Gender { GenderName = "Female" },
                    new Gender { GenderName = "Non-Binary" },
                    new Gender { GenderName = "Other" }
                };

                await context.Genders.AddRangeAsync(genders);
                
                // Seed Professions
                var professions = new Profession[]
                {
                    new Profession { ProfessionDescription = "Software Engineer" },
                    new Profession { ProfessionDescription = "Doctor" },
                    new Profession { ProfessionDescription = "Teacher" },
                    new Profession { ProfessionDescription = "Accountant" },
                    new Profession { ProfessionDescription = "Lawyer" },
                    new Profession { ProfessionDescription = "Sales Representative" },
                    new Profession { ProfessionDescription = "Marketing Specialist" },
                    new Profession { ProfessionDescription = "Student" }
                };

                await context.Professions.AddRangeAsync(professions);
                
                // Seed Categories
                var categories = new Category[]
                {
                    new Category { CategoryDescription = "Groceries" },
                    new Category { CategoryDescription = "Utilities" },
                    new Category { CategoryDescription = "Rent" },
                    new Category { CategoryDescription = "Transportation" },
                    new Category { CategoryDescription = "Entertainment" },
                    new Category { CategoryDescription = "Healthcare" },
                    new Category { CategoryDescription = "Education" },
                    new Category { CategoryDescription = "Dining Out" },
                    new Category { CategoryDescription = "Shopping" },
                    new Category { CategoryDescription = "Savings" },
                    new Category { CategoryDescription = "Investment" },
                    new Category { CategoryDescription = "Salary" },
                    new Category { CategoryDescription = "Bonus" },
                    new Category { CategoryDescription = "Other Income" },
                    new Category { CategoryDescription = "Other Expense" }
                };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
                
                // If you want to add sample customers and transactions, you could add them here
                if (!context.Customers.Any())
                {
                    var customers = new Customer[]
                    {
                        new Customer
                        {
                            FirstName = "John",
                            LastName = "Doe",
                            GenderId = 1, // Male
                            DateOfBirth = new DateTime(1985, 5, 15),
                            City = "New York",
                            ProfessionId = 1 // Software Engineer
                        },
                        new Customer
                        {
                            FirstName = "Jane",
                            LastName = "Smith",
                            GenderId = 2, // Female
                            DateOfBirth = new DateTime(1990, 8, 22),
                            City = "Los Angeles",
                            ProfessionId = 3 // Teacher
                        }
                    };

                    await context.Customers.AddRangeAsync(customers);
                    await context.SaveChangesAsync();
                    
                    // Sample transactions
                    var transactions = new Transaction[]
                    {
                        new Transaction
                        {
                            Trans_Num = "TR-20250101-123456",
                            Amount = 1500.00M,
                            Trans_Date = DateTime.Now.Date.AddDays(-15),
                            Trans_Time = new TimeSpan(14, 30, 0),
                            CategoryId = 12, // Salary
                            CustomerId = 1 // John Doe
                        },
                        new Transaction
                        {
                            Trans_Num = "TR-20250101-123457",
                            Amount = -50.25M,
                            Trans_Date = DateTime.Now.Date.AddDays(-10),
                            Trans_Time = new TimeSpan(18, 45, 0),
                            CategoryId = 1, // Groceries
                            CustomerId = 1 // John Doe
                        },
                        new Transaction
                        {
                            Trans_Num = "TR-20250101-123458",
                            Amount = -25.75M,
                            Trans_Date = DateTime.Now.Date.AddDays(-5),
                            Trans_Time = new TimeSpan(12, 15, 0),
                            CategoryId = 8, // Dining Out
                            CustomerId = 1 // John Doe
                        },
                        new Transaction
                        {
                            Trans_Num = "TR-20250101-123459",
                            Amount = 1200.00M,
                            Trans_Date = DateTime.Now.Date.AddDays(-20),
                            Trans_Time = new TimeSpan(9, 0, 0),
                            CategoryId = 12, // Salary
                            CustomerId = 2 // Jane Smith
                        },
                        new Transaction
                        {
                            Trans_Num = "TR-20250101-123460",
                            Amount = -35.50M,
                            Trans_Date = DateTime.Now.Date.AddDays(-8),
                            Trans_Time = new TimeSpan(16, 20, 0),
                            CategoryId = 5, // Entertainment
                            CustomerId = 2 // Jane Smith
                        }
                    };

                    await context.Transactions.AddRangeAsync(transactions);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
