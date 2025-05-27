using System.ComponentModel.DataAnnotations;

namespace TransactionHandlerApi.Models
{
    public class Profession
    {
        [Key]
        public int ProfessionId { get; set; }
        
        [Required]
        [StringLength(300)]
        public string ProfessionDescription { get; set; } = null!;
        
        // Navigation property
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
