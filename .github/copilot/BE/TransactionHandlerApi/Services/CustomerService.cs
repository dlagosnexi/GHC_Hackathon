using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Data;
using TransactionHandlerApi.DTOs;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CustomerService> _logger;
        
        public CustomerService(
            ApplicationDbContext context,
            ILogger<CustomerService> logger)
        {
            _context = context;
            _logger = logger;
        }
        
        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            try
            {
                var customers = await _context.Customers
                    .Include(c => c.Gender)
                    .Include(c => c.Profession)
                    .AsNoTracking()
                    .ToListAsync();
                
                return customers.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all customers");
                throw;
            }
        }
        
        public async Task<CustomerDto?> GetCustomerByIdAsync(long id)
        {
            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Gender)
                    .Include(c => c.Profession)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CustomerId == id);
                
                return customer != null ? MapToDto(customer) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer with ID {CustomerId}", id);
                throw;
            }
        }
        
        public async Task<CustomerDto> CreateCustomerAsync(CustomerDto customerDto)
        {
            try
            {
                var customer = MapToEntity(customerDto);
                
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                
                // Reload the customer with related data
                await _context.Entry(customer)
                    .Reference(c => c.Gender)
                    .LoadAsync();
                
                await _context.Entry(customer)
                    .Reference(c => c.Profession)
                    .LoadAsync();
                
                return MapToDto(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                throw;
            }
        }
        
        public async Task<CustomerDto?> UpdateCustomerAsync(long id, CustomerDto customerDto)
        {
            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Gender)
                    .Include(c => c.Profession)
                    .FirstOrDefaultAsync(c => c.CustomerId == id);
                
                if (customer == null)
                {
                    return null;
                }
                
                // Update properties
                customer.FirstName = customerDto.FirstName;
                customer.LastName = customerDto.LastName;
                customer.GenderId = customerDto.GenderId;
                customer.DateOfBirth = customerDto.DateOfBirth;
                customer.City = customerDto.City;
                customer.ProfessionId = customerDto.ProfessionId;
                
                await _context.SaveChangesAsync();
                
                return MapToDto(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer with ID {CustomerId}", id);
                throw;
            }
        }
        
        public async Task<bool> DeleteCustomerAsync(long id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    return false;
                }
                
                // Check if customer has transactions
                bool hasTransactions = await _context.Transactions.AnyAsync(t => t.CustomerId == id);
                if (hasTransactions)
                {
                    throw new InvalidOperationException("Cannot delete customer with existing transactions.");
                }
                
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting customer with ID {CustomerId}", id);
                throw;
            }
        }
        
        // Helper methods
        private CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                GenderId = customer.GenderId,
                DateOfBirth = customer.DateOfBirth,
                City = customer.City,
                ProfessionId = customer.ProfessionId,
                GenderName = customer.Gender?.GenderName,
                ProfessionDescription = customer.Profession?.ProfessionDescription
            };
        }
        
        private Customer MapToEntity(CustomerDto dto)
        {
            return new Customer
            {
                CustomerId = dto.CustomerId ?? 0,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                GenderId = dto.GenderId,
                DateOfBirth = dto.DateOfBirth,
                City = dto.City,
                ProfessionId = dto.ProfessionId
            };
        }
    }
}
