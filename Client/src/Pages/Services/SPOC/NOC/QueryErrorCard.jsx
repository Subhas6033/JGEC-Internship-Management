import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const QueryErrorCard = ({ message, onRetry }) => (
  <motion.section variants={fadeUp} className="mt-6 w-full min-w-0">
    <Card className="border-red-200 bg-red-50 shadow-none">
      <Card.Content className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0" role="alert">
          <p className="text-sm font-semibold text-red-700">
            Failed to load NOCs
          </p>
          <p className="mt-1 text-xs text-red-600">{message}</p>
        </div>

        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </Card.Content>
    </Card>
  </motion.section>
);

export default QueryErrorCard;
