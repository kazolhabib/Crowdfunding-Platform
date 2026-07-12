import Campaign from "@/lib/models/Campaign";
import Contribution from "@/lib/models/Contribution";
import Report from "@/lib/models/Report";
import User from "@/lib/models/User";
import { createNotification } from "@/lib/notifications";

export async function deleteCampaignAndRefund(campaignId) {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) return null;

  // Credits are reserved when a contribution is submitted, so every contribution
  // must be refunded before an administrator permanently removes a campaign.
  const contributions = await Contribution.find({ campaign_id: campaign._id });
  const refunds = new Map();
  for (const contribution of contributions) {
    refunds.set(
      contribution.supporter_email,
      (refunds.get(contribution.supporter_email) || 0) + contribution.contribution_amount
    );
  }

  if (refunds.size) {
    await User.bulkWrite(
      Array.from(refunds, ([email, amount]) => ({
        updateOne: { filter: { email }, update: { $inc: { credits: amount } } },
      }))
    );
  }

  await Promise.all(
    contributions.map((contribution) =>
      createNotification({
        message: `Campaign "${campaign.title}" was removed by an administrator. Your ${contribution.contribution_amount} credit contribution has been refunded.`,
        toEmail: contribution.supporter_email,
        actionRoute: "/dashboard/my-contributions",
      })
    )
  );

  await Promise.all([
    Contribution.deleteMany({ campaign_id: campaign._id }),
    Report.deleteMany({ campaign_id: campaign._id }),
    Campaign.findByIdAndDelete(campaign._id),
  ]);

  await createNotification({
    message: `Your campaign "${campaign.title}" was removed by an administrator.`,
    toEmail: campaign.creator_email,
    actionRoute: "/dashboard/my-campaigns",
  });

  return campaign;
}
