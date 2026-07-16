import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

const SEED_USERS = [
  {
    name: "Alex Admin",
    email: "admin@demo.com",
    role: "Admin",
    credits: 1000,
  },
  {
    name: "John Supporter",
    email: "supporter@demo.com",
    role: "Supporter",
    credits: 500,
  },
  {
    name: "Jane Creator",
    email: "creator@demo.com",
    role: "Creator",
    credits: 200,
  },
];

const SEED_CAMPAIGNS = [
  {
    title: "EcoFilter: Clean Water for Rural Schools",
    story: "We are developing a low-cost, gravity-powered water filtration system that removes bacteria and heavy metals. This campaign aims to fund the installation of 50 EcoFilter units in remote schools, providing clean drinking water to over 10,000 children.",
    category: "Health",
    funding_goal: 5000,
    minimum_contribution: 10,
    amount_raised: 4200,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    reward_info: "Donate $50 or more to receive a personalized certificate of contribution and a digital photo album showing the installed filtration units at the schools.",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
  {
    title: "SolarGrid: Portable Solar Kits for Emergency Relief",
    story: "In areas hit by natural disasters, power grid failure cuts off communication and medical assistance. Our SolarGrid kits fold into a backpack and provide 100W of clean energy with integrated battery storage. Funding will purchase parts for our first emergency response shipment.",
    category: "Technology",
    funding_goal: 8000,
    minimum_contribution: 25,
    amount_raised: 6850,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    reward_info: "Contribute $100 to get a custom SolarGrid micro power bank with engraving.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
  {
    title: "Project ReGrow: Community Urban Agroforestry",
    story: "Transforming empty urban lots into productive agroforests. We will plant fruit trees, native vegetables, and build composting structures that the local neighborhood will manage, reducing food desert spaces and building community integration.",
    category: "Community",
    funding_goal: 3000,
    minimum_contribution: 5,
    amount_raised: 2900,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    reward_info: "Backers of $25 or more are invited to the launch planting day and receive a basket of the first seasonal harvest.",
    image_url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
  {
    title: "Visualizing Hope: Community Art Murals",
    story: "This project brings local artists together with youths to paint interactive murals on public library walls. Each mural will tell stories of hope, diversity, and resilience, turning gray concrete walls into vibrant, inspiring spaces.",
    category: "Art",
    funding_goal: 1500,
    minimum_contribution: 15,
    amount_raised: 800,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    reward_info: "Get a high-quality postcard set of all completed mural designs.",
    image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
  {
    title: "SensiArm: 3D-Printed Prosthetics for Children",
    story: "SensiArm utilizes 3D printing and open-source electronics to create high-functioning prosthetic limbs for children. Because kids grow quickly, standard prosthetics are financially out of reach. Our scalable solution cuts the cost by 95% and can be re-sized easily.",
    category: "Technology",
    funding_goal: 12000,
    minimum_contribution: 30,
    amount_raised: 9200,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    reward_info: "Donate $150 and sponsor a full custom prosthetic fitting for a child. You'll receive progress updates and thank you letter from the child.",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
  {
    title: "ReCycle Hub: Empowering Local Waste Collectors",
    story: "Providing electric tricycles and heavy-duty sorting equipment to informal waste collectors. This increases their daily income, improves their safety conditions, and ensures clean plastic, cardboard, and metal are recycled instead of ending up in landfills.",
    category: "Community",
    funding_goal: 6000,
    minimum_contribution: 10,
    amount_raised: 1500,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    reward_info: "Receive a handmade wallet constructed entirely from upcycled plastic collected by our recycling hubs.",
    image_url: "https://images.unsplash.com/photo-1532996127610-534f49d52bb5?auto=format&fit=crop&q=80&w=600",
    creator_email: "creator@demo.com",
    creator_name: "Jane Creator",
    status: "approved",
  },
];

export async function GET() {
  try {
    await connectDB();
    
    // Seed campaigns
    await Campaign.deleteMany({});
    await Campaign.insertMany(SEED_CAMPAIGNS);

    // Hash password "password123" for demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const usersToInsert = SEED_USERS.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    // Seed users
    await User.deleteMany({ email: { $in: ["admin@demo.com", "supporter@demo.com", "creator@demo.com"] } });
    await User.insertMany(usersToInsert);

    return NextResponse.json({
      success: true,
      message: "Seeded campaigns and users successfully. Password for demo users is 'password123'.",
    });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during seeding." },
      { status: 500 }
    );
  }
}
