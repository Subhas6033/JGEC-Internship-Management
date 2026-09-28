import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../Components/index";
import SPOCProfileCard from "../../../Components/SPOC/SPOCProfileCard";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../Animations/animations";

const spocProfile = {
  name: "SPOC Coordinator",
  designation: "Training & Placement SPOC",
  employeeId: "JGEC-SPOC-001",
  email: "spoc@jgec.ac.in",
  phone: "+91 98765 43210",
  department: "Training & Placement Cell",
  institution: "Jalpaiguri Government Engineering College",
  location: "Jalpaiguri, West Bengal",
  joinedDate: "15 July 2024",
};

const SPOCProfile = () => {
  const handleEditProfile = () => {
    console.log("Edit SPOC profile");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="
        box-border
        w-full
        min-w-0
        max-w-none
        overflow-x-hidden
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-8
      "
    >
      {/* Page Header */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="w-full min-w-0"
      >
        <p className="eyebrow">SPOC Profile</p>

        <h1
          className="
            mt-2
            text-2xl
            font-bold
            leading-tight
            tracking-tight
            text-ink
            sm:text-3xl
          "
        >
          Profile
        </h1>

        <p
          className="
            mt-2
            w-full
            max-w-2xl
            text-sm
            leading-6
            text-ink-muted
            sm:text-base
          "
        >
          View your SPOC account information and Training & Placement details.
        </p>
      </motion.section>

      {/* Profile Overview */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full
          min-w-0
          sm:mt-8
        "
      >
        <Card
          className="
            w-full
            min-w-0
            overflow-hidden
            border-border
            bg-surface
            shadow-(--shadow-card)
          "
        >
          <Card.Content
            className="
              p-4
              sm:p-6
              lg:p-7
            "
          >
            <div
              className="
                flex
                min-w-0
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              {/* Identity */}
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    size-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-brand-100
                    text-brand-700
                    sm:size-20
                  "
                >
                  <UserRound
                    size={30}
                    strokeWidth={1.8}
                    className="sm:hidden"
                  />

                  <UserRound
                    size={36}
                    strokeWidth={1.8}
                    className="hidden sm:block"
                  />
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      flex
                      min-w-0
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <h2
                      className="
                        wrap-break-word
                        text-lg
                        font-bold
                        text-ink
                        sm:text-xl
                      "
                    >
                      {spocProfile.name}
                    </h2>

                    <span
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1
                        rounded-full
                        border
                        border-brand-200
                        bg-brand-50
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        text-brand-700
                        sm:text-xs
                      "
                    >
                      <CheckCircle2 size={12} />
                      Active
                    </span>
                  </div>

                  <p
                    className="
                      mt-1
                      wrap-break-word
                      text-sm
                      text-ink-muted
                      sm:text-base
                    "
                  >
                    {spocProfile.designation}
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-xs
                      text-ink-muted
                    "
                  >
                    Employee ID: {spocProfile.employeeId}
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                className="
                  w-full
                  shrink-0
                  border-border
                  bg-transparent
                  text-ink
                  hover:bg-cream
                  sm:w-auto
                "
              >
                Edit Profile
              </Button>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      {/* Profile Information */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full
          min-w-0
          sm:mt-8
        "
      >
        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-4
            xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]
          "
        >
          {/* Personal Information */}
          <Card
            className="
              h-full
              w-full
              min-w-0
              border-border
              bg-surface
              shadow-(--shadow-card)
            "
          >
            <Card.Content
              className="
                p-4
                sm:p-5
                lg:p-6
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-brand-100
                    text-brand-700
                  "
                >
                  <UserRound size={16} />
                </span>

                <div>
                  <h2
                    className="
                      text-base
                      font-bold
                      text-ink
                      sm:text-lg
                    "
                  >
                    Personal Information
                  </h2>

                  <p className="text-xs text-ink-muted">
                    Your registered SPOC details
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                <SPOCProfileCard
                  label="Full Name"
                  value={spocProfile.name}
                  icon={UserRound}
                />

                <SPOCProfileCard
                  label="Employee ID"
                  value={spocProfile.employeeId}
                  icon={ShieldCheck}
                />

                <SPOCProfileCard
                  label="Email Address"
                  value={spocProfile.email}
                  icon={Mail}
                />

                <SPOCProfileCard
                  label="Phone Number"
                  value={spocProfile.phone}
                  icon={Phone}
                />
              </div>
            </Card.Content>
          </Card>

          {/* Organization Information */}
          <Card
            className="
              h-full
              w-full
              min-w-0
              border-border
              bg-surface
              shadow-(--shadow-card)
            "
          >
            <Card.Content
              className="
                p-4
                sm:p-5
                lg:p-6
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-brand-100
                    text-brand-700
                  "
                >
                  <Building2 size={16} />
                </span>

                <div>
                  <h2
                    className="
                      text-base
                      font-bold
                      text-ink
                      sm:text-lg
                    "
                  >
                    Organization
                  </h2>

                  <p className="text-xs text-ink-muted">
                    Institution and role information
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                <SPOCProfileCard
                  label="Department"
                  value={spocProfile.department}
                  icon={Building2}
                />

                <SPOCProfileCard
                  label="Institution"
                  value={spocProfile.institution}
                  icon={Building2}
                />

                <SPOCProfileCard
                  label="Location"
                  value={spocProfile.location}
                  icon={MapPin}
                />

                <SPOCProfileCard
                  label="Joined On"
                  value={spocProfile.joinedDate}
                  icon={CalendarDays}
                />
              </div>
            </Card.Content>
          </Card>
        </div>
      </motion.section>

      {/* Role & Access */}
      <motion.section
        variants={fadeUp}
        viewport={viewport}
        className="
          mt-6
          w-full
          min-w-0
          sm:mt-8
        "
      >
        <Card
          className="
            w-full
            min-w-0
            border-brand-200
            bg-brand-50
            shadow-none
          "
        >
          <Card.Content
            className="
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex p-2
                min-w-0
                flex-col
                gap-4
                sm:flex-row
                sm:items-start
              "
            >
              <span
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-brand-100
                  text-brand-700
                "
              >
                <ShieldCheck size={19} />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-sm p-4
                    font-semibold
                    text-brand-900
                  "
                >
                  SPOC Access
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-brand-700
                    sm:text-sm
                  "
                >
                  Your account is configured as the Training & Placement SPOC.
                  You can review forwarded company applications, manage selected
                  students, approve applications and access generated NOCs.
                </p>

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-brand-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      text-brand-700
                      sm:text-xs
                    "
                  >
                    Application Review
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-brand-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      text-brand-700
                      sm:text-xs
                    "
                  >
                    NOC Management
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-brand-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      text-brand-700
                      sm:text-xs
                    "
                  >
                    Student Review
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>
    </motion.div>
  );
};

export default SPOCProfile;
