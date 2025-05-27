using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Data;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GendersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GendersController> _logger;

        public GendersController(
            ApplicationDbContext context,
            ILogger<GendersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/genders
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Gender>>> GetGenders()
        {
            return await _context.Genders.ToListAsync();
        }

        // GET: api/genders/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Gender>> GetGender(int id)
        {
            var gender = await _context.Genders.FindAsync(id);

            if (gender == null)
            {
                return NotFound();
            }

            return gender;
        }

        // POST: api/genders
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Gender>> CreateGender(Gender gender)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Genders.Add(gender);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGender), new { id = gender.GenderId }, gender);
        }

        // PUT: api/genders/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateGender(int id, Gender gender)
        {
            if (id != gender.GenderId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(gender).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GenderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/genders/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteGender(int id)
        {
            var gender = await _context.Genders.FindAsync(id);
            if (gender == null)
            {
                return NotFound();
            }

            // Check if gender has customers
            bool hasCustomers = await _context.Customers.AnyAsync(c => c.GenderId == id);
            if (hasCustomers)
            {
                return BadRequest("Cannot delete gender with existing customers.");
            }

            _context.Genders.Remove(gender);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GenderExists(int id)
        {
            return _context.Genders.Any(e => e.GenderId == id);
        }
    }
}
