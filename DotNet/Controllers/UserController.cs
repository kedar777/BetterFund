// UserController.cs
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using System.Linq;

namespace UserDashboard_Dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly P13CrowdfundingDbContext _context;
        public UserController(P13CrowdfundingDbContext context) => _context = context;

        [HttpGet]
        public IActionResult Index() => Ok(_context.Users.ToList());

        [HttpGet("profile/{userId}")]
        public IActionResult GetUserProfile(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null) return NotFound("User not found");

            var campaignCount = _context.Campaigns.Count(c => c.UserId == userId);
            var activeCampaignCount = _context.Campaigns.Count(c => c.UserId == userId && c.Status == "active");

            var walletIds = _context.Wallets.Where(w => w.UserId == userId).Select(w => w.WalletId).ToList();
            var totalContributed = _context.Donations.Where(d => walletIds.Contains(d.WalletId))
                                                     .Sum(d => (decimal?)d.Amount) ?? 0;

            return Ok(new
            {
                name = user.Uname,
                email = user.Email,
                totalContributed,
                campaignsCreated = campaignCount,
                activeCampaigns = activeCampaignCount,
                phoneno = user.PhoneNo,
                adharno = user.AdharNo
            });
        }

        //campaigns owned by user 
        [HttpGet("{userId}/campaigns")]
        public IActionResult GetUserCampaigns(int userId)
        {
            var campaigns = _context.Campaigns
                .Where(c => c.UserId == userId)
                .Select(c => new
                {
                    CampaignId = c.CampaignId,
                    Title = c.Title,
                    TargetAmt = c.TargetAmt,
                    CreatedAt = c.StartDate.ToString("yyyy-MM-dd"),
                    EndAt = c.EndDate.ToString("yyyy-MM-dd"),
                    Status = c.Status ?? "pending",
                    Wallet = new { Amount = c.Wallet!.CurBalance },
                    Contributors = c.Donations.Select(d => d.WalletId).Distinct().Count()
                })
                .ToList();

            return Ok(campaigns);
        }

        // donations made by user
        [HttpGet("{userId}/contributions")]
        public IActionResult GetUserContributions(int userId)
        {
            var contributions = _context.Donations
                .Where(d => d.Wallet.UserId == userId)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    Amount = d.Amount,
                    DonatedAt = d.DonationTime!.Value,
                    Campaign = new
                    {
                        d.Campaign!.CampaignId,
                        d.Campaign.Title
                    }
                })
                .ToList();

            return Ok(contributions);
        }
    }
}