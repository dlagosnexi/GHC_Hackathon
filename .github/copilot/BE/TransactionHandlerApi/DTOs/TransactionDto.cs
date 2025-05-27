using System.ComponentModel.DataAnnotations;

namespace TransactionHandlerApi.DTOs
{
    public class TransactionDto
    {
        public string? Trans_Num { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public DateTime Trans_Date { get; set; }
        
        [Required]
        public TimeSpan Trans_Time { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        public long CustomerId { get; set; }
        
        // Additional properties for display
        public string? CategoryDescription { get; set; }
        public string? CustomerFullName { get; set; }
    }
}
