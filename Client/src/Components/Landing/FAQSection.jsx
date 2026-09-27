import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { viewport } from "../../Animations/animations";

const faqs = [
  {
    question: "How does the approval process work?",
    answer:
      "Submit your internship details and required documents. The application then moves through the configured coordinator and administration approval stages.",
  },
  {
    question: "Who can track an internship application?",
    answer:
      "Students can track their own application, while authorized coordinators and administrators can review applications relevant to their role.",
  },
  {
    question: "When is the NOC generated?",
    answer:
      "Once all required approvals have been completed, the system can generate the official NOC for the approved internship request.",
  },
  {
    question: "How are confirmation emails sent?",
    answer:
      "Important application and approval events can trigger notifications so students do not need to repeatedly follow up for status updates.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="border-y border-border bg-cream-dark/45 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="eyebrow">FAQ</p>

          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
            Questions, made clearer.
          </h2>
        </motion.div>

        <div className="mt-7 overflow-hidden rounded-lg border border-border bg-cream-soft">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-border last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-4
                    text-left
                    transition-colors
                    duration-200
                    hover:bg-cream
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-brand-600
                  "
                >
                  <span className="text-lg font-medium text-ink">
                    {faq.question}
                  </span>

                  <span className="shrink-0 text-brand-700">
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 pr-10 text-md leading-5 text-ink-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
