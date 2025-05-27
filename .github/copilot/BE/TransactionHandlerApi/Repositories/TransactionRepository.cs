using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Data;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;
        
        public TransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Customer)
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<Transaction?> GetTransactionByIdAsync(string transNum)
        {
            return await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Customer)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Trans_Num == transNum);
        }
        
        public async Task<IEnumerable<Transaction>> GetTransactionsByCustomerIdAsync(long customerId)
        {
            return await _context.Transactions
                .Where(t => t.CustomerId == customerId)
                .Include(t => t.Category)
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<IEnumerable<Transaction>> GetTransactionsByCategoryIdAsync(int categoryId)
        {
            return await _context.Transactions
                .Where(t => t.CategoryId == categoryId)
                .Include(t => t.Customer)
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<IEnumerable<Transaction>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Transactions
                .Where(t => t.Trans_Date >= startDate && t.Trans_Date <= endDate)
                .Include(t => t.Category)
                .Include(t => t.Customer)
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }
        
        public async Task<Transaction?> UpdateTransactionAsync(Transaction transaction)
        {
            var existingTransaction = await _context.Transactions.FindAsync(transaction.Trans_Num);
            
            if (existingTransaction == null)
            {
                return null;
            }
            
            _context.Entry(existingTransaction).CurrentValues.SetValues(transaction);
            await _context.SaveChangesAsync();
            
            return transaction;
        }
        
        public async Task<bool> DeleteTransactionAsync(string transNum)
        {
            var transaction = await _context.Transactions.FindAsync(transNum);
            
            if (transaction == null)
            {
                return false;
            }
            
            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        public async Task<bool> ExistsAsync(string transNum)
        {
            return await _context.Transactions.AnyAsync(t => t.Trans_Num == transNum);
        }
    }
}
