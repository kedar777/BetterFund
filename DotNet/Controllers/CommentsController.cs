using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using System.Threading.Tasks;
using System.Linq;

namespace UserDashboard_Dotnet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly P13CrowdfundingDbContext _ctx;

        public CommentsController(P13CrowdfundingDbContext ctx) => _ctx = ctx;

        // GET: api/comments?campaignId=123
        [HttpGet]
        public async Task<IActionResult> Get(int campaignId)
        {
            var comments = await _ctx.Comments
                .Where(c => c.CampaignId == campaignId)
                .OrderBy(c => c.CommentId)
                .Include(c => c.User)
                .Select(c => new
                {
                    c.CommentId,
                    c.Text,
                    c.UserId,
                    UserName = c.User.Uname
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/comments
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CommentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var comment = new Comment
            {
                CampaignId = dto.CampaignId,
                UserId = dto.UserId,
                Text = dto.Text
            };

            _ctx.Comments.Add(comment);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { campaignId = comment.CampaignId }, comment);
        }

        // DELETE: api/comments/5
        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var comment = await _ctx.Comments.FindAsync(id);
        //    if (comment == null) return NotFound();

        //    _ctx.Comments.Remove(comment);
        //    await _ctx.SaveChangesAsync();
        //    return NoContent();
        //}


    }

    public class CommentDto
    {
        public int CampaignId { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; } = null!;
    }
}