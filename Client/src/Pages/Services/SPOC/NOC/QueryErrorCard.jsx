import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button, Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const QueryErrorCard = ({ message, onRetry }) => (
  <motion.section variants={fadeUp} className="mt-6 w-full min-w-0">
    <Card className="border-danger/20 bg-danger/5 shadow-none">
      <Card.Content className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3" role="alert">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <AlertCircle size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-danger-900">
              Failed to load NOCs
            </p>
            <p className="mt-1 text-xs text-danger-700">{message}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0 border-danger/30 text-danger hover:bg-danger/10"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span className="ml-1.5">Retry</span>
        </Button>
      </Card.Content>
    </Card>
  </motion.section>
);

export default QueryErrorCard;