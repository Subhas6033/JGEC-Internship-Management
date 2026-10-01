import mongoose from "mongoose";
import { Organisation } from "../models/organisation.models.js";

const MONGO_URI = process.env.MONGO_URI;

const companies = [
  // IITS
  {
    organisationName: "Indian Institute of Technology Kharagpur",
    organisationSite: "https://www.iitkgp.ac.in",
    organisationLocation: "Kharagpur, West Bengal",
  },
  {
    organisationName: "Indian Institute of Technology Bombay",
    organisationSite: "https://www.iitb.ac.in",
    organisationLocation: "Mumbai, Maharashtra",
  },
  {
    organisationName: "Indian Institute of Technology Madras",
    organisationSite: "https://www.iitm.ac.in",
    organisationLocation: "Chennai, Tamil Nadu",
  },
  {
    organisationName: "Indian Institute of Technology Kanpur",
    organisationSite: "https://www.iitk.ac.in",
    organisationLocation: "Kanpur, Uttar Pradesh",
  },
  {
    organisationName: "Indian Institute of Technology Delhi",
    organisationSite: "https://home.iitd.ac.in",
    organisationLocation: "New Delhi, Delhi",
  },
  {
    organisationName: "Indian Institute of Technology Guwahati",
    organisationSite: "https://www.iitg.ac.in",
    organisationLocation: "Guwahati, Assam",
  },
  {
    organisationName: "Indian Institute of Technology Roorkee",
    organisationSite: "https://www.iitr.ac.in",
    organisationLocation: "Roorkee, Uttarakhand",
  },
  {
    organisationName: "Indian Institute of Technology (BHU) Varanasi",
    organisationSite: "https://iitbhu.ac.in",
    organisationLocation: "Varanasi, Uttar Pradesh",
  },
  {
    organisationName: "Indian Institute of Technology Hyderabad",
    organisationSite: "https://iith.ac.in",
    organisationLocation: "Hyderabad, Telangana",
  },
  {
    organisationName: "Indian Institute of Technology Indore",
    organisationSite: "https://www.iiti.ac.in",
    organisationLocation: "Indore, Madhya Pradesh",
  },
  {
    organisationName: "Indian Institute of Technology Dhanbad",
    organisationSite: "https://www.iitism.ac.in",
    organisationLocation: "Dhanbad, Jharkhand",
  },
  {
    organisationName: "Indian Institute of Technology Ropar",
    organisationSite: "https://www.iitrpr.ac.in",
    organisationLocation: "Rupnagar, Punjab",
  },
  {
    organisationName: "Indian Institute of Technology Bhubaneswar",
    organisationSite: "https://www.iitbbs.ac.in",
    organisationLocation: "Bhubaneswar, Odisha",
  },
  {
    organisationName: "Indian Institute of Technology Gandhinagar",
    organisationSite: "https://iitgn.ac.in",
    organisationLocation: "Gandhinagar, Gujarat",
  },
  {
    organisationName: "Indian Institute of Technology Jodhpur",
    organisationSite: "https://iitj.ac.in",
    organisationLocation: "Jodhpur, Rajasthan",
  },
  {
    organisationName: "Indian Institute of Technology Patna",
    organisationSite: "https://www.iitp.ac.in",
    organisationLocation: "Patna, Bihar",
  },
  {
    organisationName: "Indian Institute of Technology Mandi",
    organisationSite: "https://iitmandi.ac.in",
    organisationLocation: "Mandi, Himachal Pradesh",
  },
  {
    organisationName: "Indian Institute of Technology Tirupati",
    organisationSite: "https://www.iittp.ac.in",
    organisationLocation: "Tirupati, Andhra Pradesh",
  },
  {
    organisationName: "Indian Institute of Technology Palakkad",
    organisationSite: "https://iitpkd.ac.in",
    organisationLocation: "Palakkad, Kerala",
  },
  {
    organisationName: "Indian Institute of Technology Bhilai",
    organisationSite: "https://www.iitbhilai.ac.in",
    organisationLocation: "Bhilai, Chhattisgarh",
  },
  {
    organisationName: "Indian Institute of Technology Goa",
    organisationSite: "https://iitgoa.ac.in",
    organisationLocation: "Goa",
  },
  {
    organisationName: "Indian Institute of Technology Jammu",
    organisationSite: "https://iitjammu.ac.in",
    organisationLocation: "Jammu, Jammu and Kashmir",
  },
  {
    organisationName: "Indian Institute of Technology Dharwad",
    organisationSite: "https://www.iitdh.ac.in",
    organisationLocation: "Dharwad, Karnataka",
  },

  // NITs
  {
    organisationName: "National Institute of Technology Agartala",
    organisationSite: "https://nita.ac.in",
    organisationLocation: "Agartala, Tripura",
  },
  {
    organisationName:
      "Motilal Nehru National Institute of Technology Allahabad",
    organisationSite: "https://www.mnnit.ac.in",
    organisationLocation: "Prayagraj, Uttar Pradesh",
  },
  {
    organisationName: "Maulana Azad National Institute of Technology Bhopal",
    organisationSite: "https://www.manit.ac.in",
    organisationLocation: "Bhopal, Madhya Pradesh",
  },
  {
    organisationName: "National Institute of Technology Calicut",
    organisationSite: "https://nitc.ac.in",
    organisationLocation: "Kozhikode, Kerala",
  },
  {
    organisationName: "National Institute of Technology Durgapur",
    organisationSite: "https://nitdgp.ac.in",
    organisationLocation: "Durgapur, West Bengal",
  },
  {
    organisationName: "National Institute of Technology Hamirpur",
    organisationSite: "https://nith.ac.in",
    organisationLocation: "Hamirpur, Himachal Pradesh",
  },
  {
    organisationName: "Malaviya National Institute of Technology Jaipur",
    organisationSite: "https://www.mnit.ac.in",
    organisationLocation: "Jaipur, Rajasthan",
  },
  {
    organisationName:
      "Dr. B. R. Ambedkar National Institute of Technology Jalandhar",
    organisationSite: "https://www.nitj.ac.in",
    organisationLocation: "Jalandhar, Punjab",
  },
  {
    organisationName: "National Institute of Technology Jamshedpur",
    organisationSite: "https://www.nitjsr.ac.in",
    organisationLocation: "Jamshedpur, Jharkhand",
  },
  {
    organisationName: "National Institute of Technology Kurukshetra",
    organisationSite: "https://nitkkr.ac.in",
    organisationLocation: "Kurukshetra, Haryana",
  },
  {
    organisationName: "Visvesvaraya National Institute of Technology Nagpur",
    organisationSite: "https://vnit.ac.in",
    organisationLocation: "Nagpur, Maharashtra",
  },
  {
    organisationName: "National Institute of Technology Patna",
    organisationSite: "https://www.nitp.ac.in",
    organisationLocation: "Patna, Bihar",
  },
  {
    organisationName: "National Institute of Technology Raipur",
    organisationSite: "https://nitrr.ac.in",
    organisationLocation: "Raipur, Chhattisgarh",
  },
  {
    organisationName: "National Institute of Technology Rourkela",
    organisationSite: "https://nitrkl.ac.in",
    organisationLocation: "Rourkela, Odisha",
  },
  {
    organisationName: "National Institute of Technology Silchar",
    organisationSite: "https://www.nits.ac.in",
    organisationLocation: "Silchar, Assam",
  },
  {
    organisationName: "National Institute of Technology Srinagar",
    organisationSite: "https://nitsri.ac.in",
    organisationLocation: "Srinagar, Jammu and Kashmir",
  },
  {
    organisationName:
      "Sardar Vallabhbhai National Institute of Technology Surat",
    organisationSite: "https://www.svnit.ac.in",
    organisationLocation: "Surat, Gujarat",
  },
  {
    organisationName: "National Institute of Technology Karnataka Surathkal",
    organisationSite: "https://www.nitk.ac.in",
    organisationLocation: "Surathkal, Karnataka",
  },
  {
    organisationName: "National Institute of Technology Tiruchirappalli",
    organisationSite: "https://www.nitt.edu",
    organisationLocation: "Tiruchirappalli, Tamil Nadu",
  },
  {
    organisationName: "National Institute of Technology Warangal",
    organisationSite: "https://www.nitw.ac.in",
    organisationLocation: "Warangal, Telangana",
  },
  {
    organisationName: "National Institute of Technology Arunachal Pradesh",
    organisationSite: "https://www.nitap.ac.in",
    organisationLocation: "Yupia, Arunachal Pradesh",
  },
  {
    organisationName: "National Institute of Technology Delhi",
    organisationSite: "https://nitdelhi.ac.in",
    organisationLocation: "Delhi",
  },
  {
    organisationName: "National Institute of Technology Goa",
    organisationSite: "https://www.nitgoa.ac.in",
    organisationLocation: "Cuncolim, Goa",
  },
  {
    organisationName: "National Institute of Technology Manipur",
    organisationSite: "https://nitmanipur.ac.in",
    organisationLocation: "Imphal, Manipur",
  },
  {
    organisationName: "National Institute of Technology Meghalaya",
    organisationSite: "https://www.nitm.ac.in",
    organisationLocation: "Shillong, Meghalaya",
  },
  {
    organisationName: "National Institute of Technology Mizoram",
    organisationSite: "https://www.nitmz.ac.in",
    organisationLocation: "Aizawl, Mizoram",
  },
  {
    organisationName: "National Institute of Technology Nagaland",
    organisationSite: "https://nitnagaland.ac.in",
    organisationLocation: "Chumoukedima, Nagaland",
  },
  {
    organisationName: "National Institute of Technology Puducherry",
    organisationSite: "https://www.nitpy.ac.in",
    organisationLocation: "Karaikal, Puducherry",
  },
  {
    organisationName: "National Institute of Technology Sikkim",
    organisationSite: "https://nitsikkim.ac.in",
    organisationLocation: "Ravangla, Sikkim",
  },
  {
    organisationName: "National Institute of Technology Uttarakhand",
    organisationSite: "https://nituk.ac.in",
    organisationLocation: "Srinagar, Uttarakhand",
  },
  {
    organisationName: "National Institute of Technology Andhra Pradesh",
    organisationSite: "https://nitandhra.ac.in",
    organisationLocation: "Tadepalligudem, Andhra Pradesh",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Clear existing Organisation data
    await Organisation.deleteMany({});

    // Insert all IITs
    const insertedCompanies = await Organisation.insertMany(companies);

    console.log(`${insertedCompanies.length} IITs inserted successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
