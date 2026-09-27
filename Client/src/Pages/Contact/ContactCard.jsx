import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../Components/index";

const ContactCard = ({ contact }) => {
  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  const handlePhone = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">{contact.name}</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {contact.designation}
            </p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>

              <button
                type="button"
                onClick={handleEmail}
                className="mt-0.5 break-all text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {contact.email}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone
              size={16}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <div>
              <p className="text-xs text-muted-foreground">Phone</p>

              <button
                type="button"
                onClick={handlePhone}
                className="mt-0.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {contact.phone}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <div>
              <p className="text-xs text-muted-foreground">Office</p>

              <p className="mt-0.5 text-sm font-medium text-foreground">
                {contact.office}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            type="button"
            size="sm"
            onClick={handleEmail}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Mail size={15} />
            <span>Email</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handlePhone}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Phone size={15} />
            <span>Call</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
