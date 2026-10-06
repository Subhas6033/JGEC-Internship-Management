import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAnimationVariants,
  fadeUp,
  fadeRight,
  popIn,
  hoverLiftSmall,
  tapScaleSmall,
  viewport,
} from "../../../../Animations/animations";

const ProfileHeader = ({ profile }) => {
  const headerVariants = useAnimationVariants(fadeUp);
  const identityVariants = useAnimationVariants(fadeRight);
  const avatarVariants = useAnimationVariants(popIn);
  const contactVariants = useAnimationVariants(fadeUp);

  if (!profile) {
    return null;
  }

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-white
        shadow-card
      "
    >
      {/* Cover */}
      <div className="h-28 bg-brand-700 sm:h-32" />

      <div className="px-5 pb-6 sm:px-7">
        {/* Identity */}
        <div
          className="
            -mt-12
            flex
            flex-col
            gap-5
            sm:-mt-14
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
            "
          >
            {/* Avatar */}
            <motion.div
              variants={avatarVariants}
              whileHover={hoverLiftSmall}
              whileTap={tapScaleSmall}
              className="
                flex
                size-24
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border-4
                border-white
                bg-cream-dark
                text-2xl
                font-semibold
                text-ink
                shadow-card
                sm:size-28
                sm:text-3xl
              "
            >
              {profile.initials}
            </motion.div>

            {/* Name */}
            <motion.div variants={identityVariants} className="pb-1">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h1
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-ink
                    sm:text-2xl
                  "
                >
                  {profile.name}
                </h1>

                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.35,
                    duration: 0.25,
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-emerald-700
                  "
                >
                  <ShieldCheck size={13} />

                  {profile.accountStatus}
                </motion.span>
              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-ink-muted
                "
              >
                {profile.role}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact information */}
        <motion.div
          variants={contactVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            mt-6
            grid
            gap-3
            text-sm
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2.5
              text-ink-muted
            "
          >
            <Mail
              size={16}
              className="
                shrink-0
                text-brand-700
              "
            />

            <span className="truncate">{profile.email}</span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2.5
              text-ink-muted
            "
          >
            <Phone
              size={16}
              className="
                shrink-0
                text-brand-700
              "
            />

            <span>{profile.mobile}</span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2.5
              text-ink-muted
            "
          >
            <MapPin
              size={16}
              className="
                shrink-0
                text-brand-700
              "
            />

            <span>{profile.department}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
