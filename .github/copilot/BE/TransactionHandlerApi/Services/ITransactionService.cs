using TransactionHandlerApi.DTOs;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Services
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync();
        Task<TransactionDto?> GetTransactionByIdAsync(string transNum);
        Task<IEnumerable<TransactionDto>> GetTransactionsByCustomerIdAsync(long customerId);
        Task<IEnumerable<TransactionDto>> GetTransactionsByCategoryIdAsync(int categoryId);
        Task<IEnumerable<TransactionDto>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<TransactionDto> CreateTransactionAsync(TransactionDto transactionDto);
        Task<TransactionDto?> UpdateTransactionAsync(string transNum, TransactionDto transactionDto);
        Task<bool> DeleteTransactionAsync(string transNum);
        Task<IEnumerable<TransactionSummaryDto>> GetTransactionsByCategoryAggregateAsync();
        Task<IEnumerable<TransactionSummaryDto>> GetTransactionsByMonthAggregateAsync(int year);
    }
}
