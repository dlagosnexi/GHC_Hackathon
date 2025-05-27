using System.ComponentModel.DataAnnotations;

namespace TransactionHandlerApi.DTOs
{
    public class CustomerDto
    {
        public long? CustomerId { get; set; }
        
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
        
        // Additional properties for display
        public string? GenderName { get; set; }
        public string? ProfessionDescription { get; set; }
        
        // Full name convenience property
        public string FullName => $"{FirstName} {LastName}";
        
        // Age calculation
        public int Age => CalculateAge(DateOfBirth);
        
        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            
            if (dateOfBirth.Date > today.AddYears(-age))
            {
                age--;
            }
            
            return age;
        }
    }
}
