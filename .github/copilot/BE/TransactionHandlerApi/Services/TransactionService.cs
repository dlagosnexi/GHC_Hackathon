using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Data;
using TransactionHandlerApi.DTOs;
using TransactionHandlerApi.Models;
using TransactionHandlerApi.Repositories;

namespace TransactionHandlerApi.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TransactionService> _logger;
        
        public TransactionService(
            ITransactionRepository transactionRepository, 
            ApplicationDbContext context,
            ILogger<TransactionService> logger)
        {
            _transactionRepository = transactionRepository;
            _context = context;
            _logger = logger;
        }
        
        public async Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync()
        {
            try
            {
                var transactions = await _transactionRepository.GetAllTransactionsAsync();
                return transactions.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all transactions");
                throw;
            }
        }
        
        public async Task<TransactionDto?> GetTransactionByIdAsync(string transNum)
        {
            try
            {
                var transaction = await _transactionRepository.GetTransactionByIdAsync(transNum);
                return transaction != null ? MapToDto(transaction) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction with ID {TransNum}", transNum);
                throw;
            }
        }
        
        public async Task<IEnumerable<TransactionDto>> GetTransactionsByCustomerIdAsync(long customerId)
        {
            try
            {
                var transactions = await _transactionRepository.GetTransactionsByCustomerIdAsync(customerId);
                return transactions.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for customer {CustomerId}", customerId);
                throw;
            }
        }
        
        public async Task<IEnumerable<TransactionDto>> GetTransactionsByCategoryIdAsync(int categoryId)
        {
            try
            {
                var transactions = await _transactionRepository.GetTransactionsByCategoryIdAsync(categoryId);
                return transactions.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for category {CategoryId}", categoryId);
                throw;
            }
        }
        
        public async Task<IEnumerable<TransactionDto>> GetTransactionsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                var transactions = await _transactionRepository.GetTransactionsByDateRangeAsync(startDate, endDate);
                return transactions.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions between {StartDate} and {EndDate}", startDate, endDate);
                throw;
            }
        }
        
        public async Task<TransactionDto> CreateTransactionAsync(TransactionDto transactionDto)
        {
            try
            {
                var transaction = MapToEntity(transactionDto);
                
                // If the transaction number wasn't provided, generate one
                if (string.IsNullOrEmpty(transaction.Trans_Num))
                {
                    transaction.Trans_Num = GenerateTransactionNumber();
                }
                
                var result = await _transactionRepository.CreateTransactionAsync(transaction);
                return MapToDto(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction");
                throw;
            }
        }
        
        public async Task<TransactionDto?> UpdateTransactionAsync(string transNum, TransactionDto transactionDto)
        {
            try
            {
                if (!await _transactionRepository.ExistsAsync(transNum))
                {
                    return null;
                }
                
                var transaction = MapToEntity(transactionDto);
                transaction.Trans_Num = transNum; // Ensure the ID is set correctly
                
                var result = await _transactionRepository.UpdateTransactionAsync(transaction);
                return result != null ? MapToDto(result) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating transaction with ID {TransNum}", transNum);
                throw;
            }
        }
        
        public async Task<bool> DeleteTransactionAsync(string transNum)
        {
            try
            {
                return await _transactionRepository.DeleteTransactionAsync(transNum);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting transaction with ID {TransNum}", transNum);
                throw;
            }
        }
        
        public async Task<IEnumerable<TransactionSummaryDto>> GetTransactionsByCategoryAggregateAsync()
        {
            try
            {
                var categorySummary = await _context.Transactions
                    .Include(t => t.Category)
                    .AsNoTracking()
                    .GroupBy(t => new { t.Category.CategoryDescription })
                    .Select(g => new TransactionSummaryDto
                    {
                        Category = g.Key.CategoryDescription,
                        TotalAmount = g.Sum(t => t.Amount),
                        TransactionCount = g.Count()
                    })
                    .OrderByDescending(s => s.TotalAmount)
                    .ToListAsync();
                
                return categorySummary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category aggregate data");
                throw;
            }
        }
        
        public async Task<IEnumerable<TransactionSummaryDto>> GetTransactionsByMonthAggregateAsync(int year)
        {
            try
            {
                var monthlySummary = await _context.Transactions
                    .Where(t => t.Trans_Date.Year == year)
                    .AsNoTracking()
                    .GroupBy(t => t.Trans_Date.Month)
                    .Select(g => new TransactionSummaryDto
                    {
                        Category = GetMonthName(g.Key),
                        TotalAmount = g.Sum(t => t.Amount),
                        TransactionCount = g.Count()
                    })
                    .OrderBy(s => GetMonthNumber(s.Category))
                    .ToListAsync();
                
                return monthlySummary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving monthly aggregate data for year {Year}", year);
                throw;
            }
        }
        
        // Helper methods
        private TransactionDto MapToDto(Transaction transaction)
        {
            return new TransactionDto
            {
                Trans_Num = transaction.Trans_Num,
                Amount = transaction.Amount,
                Trans_Date = transaction.Trans_Date,
                Trans_Time = transaction.Trans_Time,
                CategoryId = transaction.CategoryId,
                CustomerId = transaction.CustomerId,
                CategoryDescription = transaction.Category?.CategoryDescription,
                CustomerFullName = transaction.Customer != null 
                    ? $"{transaction.Customer.FirstName} {transaction.Customer.LastName}" 
                    : null
            };
        }
        
        private Transaction MapToEntity(TransactionDto dto)
        {
            return new Transaction
            {
                Trans_Num = dto.Trans_Num ?? string.Empty,
                Amount = dto.Amount,
                Trans_Date = dto.Trans_Date,
                Trans_Time = dto.Trans_Time,
                CategoryId = dto.CategoryId,
                CustomerId = dto.CustomerId
            };
        }
        
        private string GenerateTransactionNumber()
        {
            // Format: TR-{YearMonthDay}-{Random6Digits}
            return $"TR-{DateTime.Now:yyyyMMdd}-{new Random().Next(100000, 999999)}";
        }
        
        private string GetMonthName(int month)
        {
            return month switch
            {
                1 => "January",
                2 => "February",
                3 => "March",
                4 => "April",
                5 => "May",
                6 => "June",
                7 => "July",
                8 => "August",
                9 => "September",
                10 => "October",
                11 => "November",
                12 => "December",
                _ => "Unknown"
            };
        }
        
        private int GetMonthNumber(string monthName)
        {
            return monthName switch
            {
                "January" => 1,
                "February" => 2,
                "March" => 3,
                "April" => 4,
                "May" => 5,
                "June" => 6,
                "July" => 7,
                "August" => 8,
                "September" => 9,
                "October" => 10,
                "November" => 11,
                "December" => 12,
                _ => 0
            };
        }
    }
}