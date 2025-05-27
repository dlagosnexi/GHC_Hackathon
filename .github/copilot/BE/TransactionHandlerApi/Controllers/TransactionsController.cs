using Microsoft.AspNetCore.Mvc;
using TransactionHandlerApi.DTOs;
using TransactionHandlerApi.Services;

namespace TransactionHandlerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            ITransactionService transactionService,
            ILogger<TransactionsController> logger)
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        // GET: api/transactions
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        // GET: api/transactions/TR-12345
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TransactionDto>> GetTransaction(string id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return Ok(transaction);
        }

        // GET: api/transactions/customer/5
        [HttpGet("customer/{customerId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByCustomer(long customerId)
        {
            var transactions = await _transactionService.GetTransactionsByCustomerIdAsync(customerId);
            return Ok(transactions);
        }

        // GET: api/transactions/category/2
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByCategory(int categoryId)
        {
            var transactions = await _transactionService.GetTransactionsByCategoryIdAsync(categoryId);
            return Ok(transactions);
        }

        // GET: api/transactions/daterange?startDate=2023-01-01&endDate=2023-01-31
        [HttpGet("daterange")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionsByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date must be before or equal to end date");
            }

            var transactions = await _transactionService.GetTransactionsByDateRangeAsync(startDate, endDate);
            return Ok(transactions);
        }

        // POST: api/transactions
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TransactionDto>> CreateTransaction(TransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdTransaction = await _transactionService.CreateTransactionAsync(transactionDto);

            return CreatedAtAction(
                nameof(GetTransaction),
                new { id = createdTransaction.Trans_Num },
                createdTransaction);
        }

        // PUT: api/transactions/TR-12345
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTransaction(string id, TransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedTransaction = await _transactionService.UpdateTransactionAsync(id, transactionDto);

            if (updatedTransaction == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/transactions/TR-12345
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTransaction(string id)
        {
            var result = await _transactionService.DeleteTransactionAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // GET: api/transactions/summary/category
        [HttpGet("summary/category")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TransactionSummaryDto>>> GetCategorySummary()
        {
            var summary = await _transactionService.GetTransactionsByCategoryAggregateAsync();
            return Ok(summary);
        }

        // GET: api/transactions/summary/monthly/2023
        [HttpGet("summary/monthly/{year}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<TransactionSummaryDto>>> GetMonthlySummary(int year)
        {
            if (year < 1900 || year > 2100)
            {
                return BadRequest("Year must be between 1900 and 2100");
            }

            var summary = await _transactionService.GetTransactionsByMonthAggregateAsync(year);
            return Ok(summary);
        }
    }
}