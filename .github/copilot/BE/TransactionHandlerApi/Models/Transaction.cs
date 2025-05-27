using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionHandlerApi.Models
{
    public class Transaction
    {
        [Key]
        [StringLength(50)]
        public string Trans_Num { get; set; } = null!;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        [Required]
        [DataType(DataType.Date)]
        public DateTime Trans_Date { get; set; }
        
        [Required]
        [DataType(DataType.Time)]
        public TimeSpan Trans_Time { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        public long CustomerId { get; set; }
        
        // Navigation properties
        [ForeignKey("CategoryId")]
        public Category Category { get; set; } = null!;
        
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; } = null!;
    }
}
