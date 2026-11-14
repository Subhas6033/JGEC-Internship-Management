import { motion } from "framer-motion";
import { Globe, Mail, MapPin, Pencil } from "lucide-react";
import { Button, Card } from "../../../../Components/index";
import { fadeUp, hoverLiftSmall } from "../../../../Animations/animations";
import { getMailLink } from "./organisationMail";

const OrganisationCard = ({ organisation, onEdit }) => {
  const {
    organisationName,
    organisationLocation,
    organisationMail,
    organisationSite,
  } = organisation;

  return (
    <motion.div variants={fadeUp} whileHover={hoverLiftSmall}>
      <Card>
        <Card.Header>
          <Card.Title>{organisationName}</Card.Title>
        </Card.Header>

        <Card.Content className="space-y-2 text-sm text-gray-700">
          {organisationLocation && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="min-w-0 wrap-break-word">
                {organisationLocation}
              </span>
            </p>
          )}
          {organisationMail && (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <a
                {...getMailLink(organisation)}
                className="min-w-0 truncate text-blue-600 hover:underline"
              >
                {organisationMail}
              </a>
            </p>
          )}
          {organisationSite && (
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-gray-400" />
              <a
                href={organisationSite}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 truncate text-blue-600 hover:underline"
              >
                {organisationSite.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </Card.Content>

        {onEdit && (
          <Card.Footer className="border-t border-gray-100 pt-4 sm:pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(organisation)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Card.Footer>
        )}
      </Card>
    </motion.div>
  );
};

export default OrganisationCard;
