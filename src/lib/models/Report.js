import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  campaign_title: { type: String, required: true, trim: true },
  reporter_name: { type: String, required: true, trim: true },
  reporter_email: { type: String, required: true, lowercase: true, trim: true },
  reason: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;
