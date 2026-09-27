import ContactCard from "./ContactCard";

const ContactSection = ({ title, description, contacts }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Contact cards: 1 column mobile, 2 columns desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
