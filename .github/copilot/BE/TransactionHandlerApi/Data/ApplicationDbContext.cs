using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Profession> Professions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Transaction
            modelBuilder.Entity<Transaction>()
                .ToTable("Transaction");
            
            // Configure Customer relationships
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Gender)
                .WithMany(g => g.Customers)
                .HasForeignKey(c => c.GenderId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Profession)
                .WithMany(p => p.Customers)
                .HasForeignKey(c => c.ProfessionId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Configure Transaction relationships
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Customer)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
