using TransactionHandlerApi.DTOs;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(long id);
        Task<CustomerDto> CreateCustomerAsync(CustomerDto customerDto);
        Task<CustomerDto?> UpdateCustomerAsync(long id, CustomerDto customerDto);
        Task<bool> DeleteCustomerAsync(long id);
    }
}
