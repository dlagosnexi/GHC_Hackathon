using System.ComponentModel.DataAnnotations;

namespace TransactionHandlerApi.Models
{    public class Gender
    {
        [Key]
        public int GenderId { get; set; }
          [Required]
        [StringLength(20)]
        public string GenderName { get; set; } = null!;
        
        // Navigation property
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
