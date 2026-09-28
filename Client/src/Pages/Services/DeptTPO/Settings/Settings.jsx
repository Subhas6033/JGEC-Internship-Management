import { ArrowLeft, Bell, Construction, Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "../../../../Components";

const Settings = () => {
  return (
    <>
      <title>Settings | JGEC Internship Portal</title>

      <meta
        name="description"
        content="Manage your JGEC Internship Portal account, preferences, and notification settings."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#ffffff" />

      <meta property="og:title" content="Settings | JGEC Internship Portal" />

      <meta
        property="og:description"
        content="Manage your account preferences and notification settings through the JGEC Internship Portal."
      />

      <meta property="og:type" content="website" />
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-auto items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-auto text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              <Settings2 size={38} strokeWidth={1.7} />
            </motion.div>

            {/* Content */}
            <div className="mt-6">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                <Construction size={14} />
                Under development
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Settings
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                We’re working on something useful for you. Settings and
                personalization options will be available here soon.
              </p>
            </div>

            {/* Feature preview */}
            <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Settings2 size={18} />
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  Account settings
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Manage your portal preferences.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bell size={18} />
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  Notification preferences
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Control how you receive updates.
                </p>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline" className="p-0">
                <Link
                  to="/students/dashboard"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
            </div>

            {/* Footer text */}
            <p className="mt-6 text-xs text-muted-foreground">
              Settings will be available in a future update.
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Settings;
