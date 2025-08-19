using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using System;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class DonateController : ControllerBase
{
    private readonly P13CrowdfundingDbContext _context;

    public DonateController(P13CrowdfundingDbContext context)
    {
        _context = context;
    }

    [HttpPost("{campaignId}")]
    public async Task<IActionResult> DonateToCampaign(int campaignId, [FromBody] DonationRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest("Invalid donation amount.");

        var campaign = await _context.Campaigns
            .Include(c => c.Wallet)
            .FirstOrDefaultAsync(c => c.CampaignId == campaignId);

        if (campaign == null)
            return NotFound("Campaign not found.");

        if (campaign.Wallet == null)
            return BadRequest("Campaign has no associated wallet.");

        if (campaign.Wallet.Amount + request.Amount > campaign.TargetAmt)
            return BadRequest("Donation exceeds target amount.");

        // Update wallet balance
        campaign.Wallet.Amount += request.Amount;
        campaign.Wallet.CurBalance += request.Amount;

        // Create a new donation record
        var donation = new Donation
        {
            Amount = request.Amount,
            Campaignid = campaign.CampaignId,
            WalletId = campaign.Wallet.WalletId,
            DonationTime = DateTime.Now
        };

        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Successfully donated ₹{request.Amount}" });
    }
}

public class DonationRequest
{
    public float Amount { get; set; }
}
