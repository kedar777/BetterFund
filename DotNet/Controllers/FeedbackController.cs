using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly P13CrowdfundingDbContext _context;

        public FeedbackController(P13CrowdfundingDbContext context)
        {
            _context = context;
        }

        // POST: api/feedback
        [HttpPost]
        public async Task<IActionResult> PostFeedback([FromBody] Feedback feedback)
        {
            // Optional: check if user exists
            var userExists = await _context.Users.AnyAsync(u => u.UserId == feedback.UserId);
            if (!userExists)
            {
                return BadRequest("Invalid user ID.");
            }

            // Avoid validation error due to navigation property
            feedback.User = null;

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully." });
        }

        // GET: api/feedback/1 (optional — to fetch user or feedback)
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.User)
                .FirstOrDefaultAsync(f => f.FeedbackId == id);

            if (feedback == null)
            {
                return NotFound();
            }

            return feedback;
        }
    }
}
