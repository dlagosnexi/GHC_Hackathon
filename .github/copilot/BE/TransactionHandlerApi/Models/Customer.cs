using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionHandlerApi.Models
{
    public class Customer
    {
        [Key]
        public long CustomerId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = null!;
        
        [Required]
        public int GenderId { get; set; }
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = null!;
        
        [Required]
        public int ProfessionId { get; set; }
        
        // Navigation properties
        [ForeignKey("GenderId")]
        public Gender Gender { get; set; } = null!;
        
        [ForeignKey("ProfessionId")]
        public Profession Profession { get; set; } = null!;
        
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
