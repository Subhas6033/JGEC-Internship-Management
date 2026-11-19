import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { Button, Modal } from "../../../../Components/index";

const MAX_LISTED = 5;

const GenerateNocModal = ({ nocs, isGenerating, onConfirm, onClose }) => {
  const count = nocs.length;
  const listed = nocs.slice(0, MAX_LISTED);

  return (
    <Modal
      open={count > 0}
      onClose={onClose}
      title={count === 1 ? "Generate NOC" : `Generate ${count} NOCs`}
      description="Generated NOCs will be available to view and download."
      closeOnBackdrop={!isGenerating}
      closeOnEscape={!isGenerating}
      showCloseButton={!isGenerating}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {listed.map((noc) => (
            <li key={noc.id} className="min-w-0 px-3 py-2.5">
              <p className="truncate text-sm font-medium text-gray-900">
                {noc.studentName}
              </p>
              <p className="truncate text-xs text-gray-500">
                {noc.rollNumber} · {noc.company}
              </p>
            </li>
          ))}
        </ul>

        {count > MAX_LISTED && (
          <p className="mt-2 text-xs text-gray-500">
            and {count - MAX_LISTED} more
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isGenerating}>
            {isGenerating && (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            )}
            {isGenerating ? "Generating" : "Generate"}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default GenerateNocModal;
