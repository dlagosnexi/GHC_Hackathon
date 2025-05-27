using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionHandlerApi.Data;
using TransactionHandlerApi.Models;

namespace TransactionHandlerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProfessionsController> _logger;

        public ProfessionsController(
            ApplicationDbContext context,
            ILogger<ProfessionsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/professions
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Profession>>> GetProfessions()
        {
            return await _context.Professions.ToListAsync();
        }

        // GET: api/professions/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Profession>> GetProfession(int id)
        {
            var profession = await _context.Professions.FindAsync(id);

            if (profession == null)
            {
                return NotFound();
            }

            return profession;
        }

        // POST: api/professions
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Profession>> CreateProfession(Profession profession)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Professions.Add(profession);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfession), new { id = profession.ProfessionId }, profession);
        }

        // PUT: api/professions/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfession(int id, Profession profession)
        {
            if (id != profession.ProfessionId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(profession).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfessionExists(id))
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

        // DELETE: api/professions/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProfession(int id)
        {
            var profession = await _context.Professions.FindAsync(id);
            if (profession == null)
            {
                return NotFound();
            }

            // Check if profession has customers
            bool hasCustomers = await _context.Customers.AnyAsync(c => c.ProfessionId == id);
            if (hasCustomers)
            {
                return BadRequest("Cannot delete profession with existing customers.");
            }

            _context.Professions.Remove(profession);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProfessionExists(int id)
        {
            return _context.Professions.Any(e => e.ProfessionId == id);
        }
    }
}
