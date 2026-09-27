import { Headphones, Mail, MessageCircleQuestion } from "lucide-react";
import { motion } from "framer-motion";
import ContactCard from "./ContactCard";
import { contactSections } from "./contact.data";

const Contact = () => {
  const contacts = contactSections.flatMap((section) => section.contacts);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-sm text-primary">
            <Headphones size={17} />
            <span>Student Support</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contact us
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Need help with your internship application, verification, documents,
            or the internship portal? Contact the appropriate office below.
          </p>
        </motion.div>

        {/* Quick support banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageCircleQuestion size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Need assistance?
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                Choose the contact below based on the type of help you need.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={14} />
            <span>Official support channels</span>
          </div>
        </motion.div>

        {/* Contact cards */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Support Contacts
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Contact the appropriate office for your internship-related
              queries.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </section>

        {/* Help note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <MessageCircleQuestion size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Before contacting support
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                Please keep your roll number and application details available
                when contacting the office. This helps the concerned team locate
                your internship records quickly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Contact;
