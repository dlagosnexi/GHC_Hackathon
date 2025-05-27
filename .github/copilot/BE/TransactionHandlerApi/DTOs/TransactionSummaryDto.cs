namespace TransactionHandlerApi.DTOs
{
    public class TransactionSummaryDto
    {
        public string Category { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public int TransactionCount { get; set; }
    }
}
