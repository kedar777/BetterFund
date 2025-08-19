using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace UserDashboard_Dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuccessStoriesController : ControllerBase
    {
        private readonly P13CrowdfundingDbContext _context;
        public SuccessStoriesController(P13CrowdfundingDbContext context) => _context = context;

        /* ----------  GET ALL STORIES WITH IMAGE URL  ---------- */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var stories = await _context.SuccessStories
                .Select(s => new
                {
                    s.SuccessId,
                    s.Updates,
                    s.FundRaised,
                    ImageURL = $"/api/successstories/image/{s.SuccessId}"
                })
                .ToListAsync();

            return Ok(stories);
        }

        /* ----------  GET ONE STORY BY ID  ---------- */
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SuccessStory>> GetById(int id) =>
            await _context.SuccessStories.FindAsync(id) is { } story
                ? story
                : NotFound();

        /* ----------  GET IMAGE BY STORY ID  ---------- */
        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var story = await _context.SuccessStories.FindAsync(id);
            if (story == null || story.Images == null || story.Images.Length == 0)
                return NotFound();

            return File(story.Images, "image/jpeg"); // Adjust MIME type if needed
        }

        /* ----------  POST – MULTIPART/FORM-DATA  ---------- */
        public record CreateStoryForm(string Updates, float? FundRaised);

        [HttpPost]
        public async Task<ActionResult<SuccessStory>> Create(
            [FromForm] CreateStoryForm form,
            IFormFile? images)
        {
            if (string.IsNullOrWhiteSpace(form.Updates))
                return BadRequest("Updates text is required.");

            byte[]? imgBytes = null;
            if (images is { Length: > 0 })
            {
                await using var ms = new MemoryStream();
                await images.CopyToAsync(ms);
                imgBytes = ms.ToArray();
            }

            var entity = new SuccessStory
            {
                Updates = form.Updates,
                FundRaised = form.FundRaised,
                Images = imgBytes
            };

            _context.SuccessStories.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.SuccessId }, entity);
        }

        /* ----------  DELETE STORY BY ID  ---------- */
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var story = await _context.SuccessStories.FindAsync(id);
            if (story == null) return NotFound();

            _context.SuccessStories.Remove(story);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
