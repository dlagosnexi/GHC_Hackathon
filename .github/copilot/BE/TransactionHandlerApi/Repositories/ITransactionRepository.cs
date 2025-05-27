using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Repositories
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
        Task<Transaction?> GetTransactionByIdAsync(string transNum);
        Task<IEnumerable<Transaction>> GetTransactionsByCustomerIdAsync(long customerId);
        Task<IEnumerable<Transaction>> GetTransactionsByCategoryIdAsync(int categoryId);
        Task<IEnumerable<Transaction>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Transaction> CreateTransactionAsync(Transaction transaction);
        Task<Transaction?> UpdateTransactionAsync(Transaction transaction);
        Task<bool> DeleteTransactionAsync(string transNum);
        Task<bool> ExistsAsync(string transNum);
    }
}
