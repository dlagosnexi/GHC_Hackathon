using System.ComponentModel.DataAnnotations;

namespace TransactionHandlerApi.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string CategoryDescription { get; set; } = null!;
        
        // Navigation property
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
