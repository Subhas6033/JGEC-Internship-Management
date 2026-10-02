import mongoose from "mongoose";
import dotenv from "dotenv";
import { Organisation } from "../models/organisation.models.js";

dotenv.config({ path: "../.env" });

const organisations = [
  // ============================================================
  // IITs
  // ============================================================

  {
    organisationName: "Indian Institute of Technology Bhubaneswar",
    organisationType: "IIT",
    organisationSite: "https://www.iitbbs.ac.in",
    organisationLocation: "Bhubaneswar, Odisha",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Bombay",
    organisationType: "IIT",
    organisationSite: "https://www.iitb.ac.in",
    organisationLocation: "Mumbai, Maharashtra",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Delhi",
    organisationType: "IIT",
    organisationSite: "https://home.iitd.ac.in",
    organisationLocation: "New Delhi, Delhi",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Dhanbad",
    organisationType: "IIT",
    organisationSite: "https://www.iitism.ac.in",
    organisationLocation: "Dhanbad, Jharkhand",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Dharwad",
    organisationType: "IIT",
    organisationSite: "https://www.iitdh.ac.in",
    organisationLocation: "Dharwad, Karnataka",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Gandhinagar",
    organisationType: "IIT",
    organisationSite: "https://iitgn.ac.in",
    organisationLocation: "Gandhinagar, Gujarat",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Goa",
    organisationType: "IIT",
    organisationSite: "https://iitgoa.ac.in",
    organisationLocation: "Goa",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Guwahati",
    organisationType: "IIT",
    organisationSite: "https://www.iitg.ac.in",
    organisationLocation: "Guwahati, Assam",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Hyderabad",
    organisationType: "IIT",
    organisationSite: "https://iith.ac.in",
    organisationLocation: "Hyderabad, Telangana",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Indore",
    organisationType: "IIT",
    organisationSite: "https://www.iiti.ac.in",
    organisationLocation: "Indore, Madhya Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Jammu",
    organisationType: "IIT",
    organisationSite: "https://iitjammu.ac.in",
    organisationLocation: "Jammu, Jammu and Kashmir",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Jodhpur",
    organisationType: "IIT",
    organisationSite: "https://iitj.ac.in",
    organisationLocation: "Jodhpur, Rajasthan",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Kanpur",
    organisationType: "IIT",
    organisationSite: "https://www.iitk.ac.in",
    organisationLocation: "Kanpur, Uttar Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Kharagpur",
    organisationType: "IIT",
    organisationSite: "https://www.iitkgp.ac.in",
    organisationLocation: "Kharagpur, West Bengal",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Madras",
    organisationType: "IIT",
    organisationSite: "https://www.iitm.ac.in",
    organisationLocation: "Chennai, Tamil Nadu",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Mandi",
    organisationType: "IIT",
    organisationSite: "https://www.iitmandi.ac.in",
    organisationLocation: "Mandi, Himachal Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Palakkad",
    organisationType: "IIT",
    organisationSite: "https://iitpkd.ac.in",
    organisationLocation: "Palakkad, Kerala",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Patna",
    organisationType: "IIT",
    organisationSite: "https://www.iitp.ac.in",
    organisationLocation: "Patna, Bihar",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Ropar",
    organisationType: "IIT",
    organisationSite: "https://www.iitrpr.ac.in",
    organisationLocation: "Rupnagar, Punjab",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Roorkee",
    organisationType: "IIT",
    organisationSite: "https://www.iitr.ac.in",
    organisationLocation: "Roorkee, Uttarakhand",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Tirupati",
    organisationType: "IIT",
    organisationSite: "https://www.iittp.ac.in",
    organisationLocation: "Tirupati, Andhra Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology (BHU) Varanasi",
    organisationType: "IIT",
    organisationSite: "https://iitbhu.ac.in",
    organisationLocation: "Varanasi, Uttar Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Indian Institute of Technology Bhilai",
    organisationType: "IIT",
    organisationSite: "https://www.iitbhilai.ac.in",
    organisationLocation: "Bhilai, Chhattisgarh",
    organisationMail: "abc@gmail.com",
  },

  // ============================================================
  // NITs
  // ============================================================

  {
    organisationName: "National Institute of Technology Agartala",
    organisationType: "NIT",
    organisationSite: "https://nita.ac.in",
    organisationLocation: "Agartala, Tripura",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Arunachal Pradesh",
    organisationType: "NIT",
    organisationSite: "https://nitap.ac.in",
    organisationLocation: "Yupia, Arunachal Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Andhra Pradesh",
    organisationType: "NIT",
    organisationSite: "https://www.nitandhra.ac.in",
    organisationLocation: "Tadepalligudem, Andhra Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName:
      "Motilal Nehru National Institute of Technology Allahabad",
    organisationType: "NIT",
    organisationSite: "https://www.mnnit.ac.in",
    organisationLocation: "Prayagraj, Uttar Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Maulana Azad National Institute of Technology Bhopal",
    organisationType: "NIT",
    organisationSite: "https://www.manit.ac.in",
    organisationLocation: "Bhopal, Madhya Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Calicut",
    organisationType: "NIT",
    organisationSite: "https://nitc.ac.in",
    organisationLocation: "Kozhikode, Kerala",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Delhi",
    organisationType: "NIT",
    organisationSite: "https://nitdelhi.ac.in",
    organisationLocation: "Delhi",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Durgapur",
    organisationType: "NIT",
    organisationSite: "https://nitdgp.ac.in",
    organisationLocation: "Durgapur, West Bengal",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Goa",
    organisationType: "NIT",
    organisationSite: "https://www.nitgoa.ac.in",
    organisationLocation: "Cuncolim, Goa",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Hamirpur",
    organisationType: "NIT",
    organisationSite: "https://nith.ac.in",
    organisationLocation: "Hamirpur, Himachal Pradesh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName:
      "Dr. B. R. Ambedkar National Institute of Technology Jalandhar",
    organisationType: "NIT",
    organisationSite: "https://www.nitj.ac.in",
    organisationLocation: "Jalandhar, Punjab",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Jamshedpur",
    organisationType: "NIT",
    organisationSite: "https://www.nitjsr.ac.in",
    organisationLocation: "Jamshedpur, Jharkhand",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Karnataka, Surathkal",
    organisationType: "NIT",
    organisationSite: "https://www.nitk.ac.in",
    organisationLocation: "Surathkal, Karnataka",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Kurukshetra",
    organisationType: "NIT",
    organisationSite: "https://nitkkr.ac.in",
    organisationLocation: "Kurukshetra, Haryana",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "Malaviya National Institute of Technology Jaipur",
    organisationType: "NIT",
    organisationSite: "https://www.mnit.ac.in",
    organisationLocation: "Jaipur, Rajasthan",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Manipur",
    organisationType: "NIT",
    organisationSite: "https://nitmanipur.ac.in",
    organisationLocation: "Imphal, Manipur",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Meghalaya",
    organisationType: "NIT",
    organisationSite: "https://nitmeghalaya.in",
    organisationLocation: "Shillong, Meghalaya",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Mizoram",
    organisationType: "NIT",
    organisationSite: "https://www.nitmz.ac.in",
    organisationLocation: "Aizawl, Mizoram",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Nagaland",
    organisationType: "NIT",
    organisationSite: "https://nitnagaland.ac.in",
    organisationLocation: "Chumukedima, Nagaland",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Patna",
    organisationType: "NIT",
    organisationSite: "https://www.nitp.ac.in",
    organisationLocation: "Patna, Bihar",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Puducherry",
    organisationType: "NIT",
    organisationSite: "https://nitpy.ac.in",
    organisationLocation: "Karaikal, Puducherry",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Raipur",
    organisationType: "NIT",
    organisationSite: "https://nitrr.ac.in",
    organisationLocation: "Raipur, Chhattisgarh",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Rourkela",
    organisationType: "NIT",
    organisationSite: "https://www.nitrkl.ac.in",
    organisationLocation: "Rourkela, Odisha",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Sikkim",
    organisationType: "NIT",
    organisationSite: "https://nitsikkim.ac.in",
    organisationLocation: "Ravangla, Sikkim",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Silchar",
    organisationType: "NIT",
    organisationSite: "https://www.nits.ac.in",
    organisationLocation: "Silchar, Assam",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Srinagar",
    organisationType: "NIT",
    organisationSite: "https://nitsri.ac.in",
    organisationLocation: "Srinagar, Jammu and Kashmir",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName:
      "Sardar Vallabhbhai National Institute of Technology Surat",
    organisationType: "NIT",
    organisationSite: "https://www.svnit.ac.in",
    organisationLocation: "Surat, Gujarat",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Tiruchirappalli",
    organisationType: "NIT",
    organisationSite: "https://www.nitt.edu",
    organisationLocation: "Tiruchirappalli, Tamil Nadu",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Uttarakhand",
    organisationType: "NIT",
    organisationSite: "https://nituk.ac.in",
    organisationLocation: "Srinagar, Uttarakhand",
    organisationMail: "abc@gmail.com",
  },

  {
    organisationName: "National Institute of Technology Warangal",
    organisationType: "NIT",
    organisationSite: "https://www.nitw.ac.in",
    organisationLocation: "Warangal, Telangana",
    organisationMail: "abc@gmail.com",
  },
];

const seedOrganisations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_TEST_URL);

    console.log("MongoDB connected");

    const operations = organisations.map((organisation) => ({
      updateOne: {
        filter: {
          organisationName: organisation.organisationName,
        },
        update: {
          $set: organisation,
        },
        upsert: true,
      },
    }));

    const result = await Organisation.bulkWrite(operations);

    console.log("Organisation seed completed");
    console.log({
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    });

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Organisation seed failed:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedOrganisations();
