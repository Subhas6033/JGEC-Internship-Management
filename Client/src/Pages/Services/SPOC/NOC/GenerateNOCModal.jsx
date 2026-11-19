import { motion } from "framer-motion";
import { LoaderCircle, CheckCircle2, FileText } from "lucide-react";
import { Button, Modal } from "../../../../Components/index";
import { transitions } from "../../../../Animations/animations";

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
        {/* NOC List */}
        <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/80 bg-surface">
          {listed.map((noc, index) => (
            <motion.li
              key={noc.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex min-w-0 items-center gap-3 px-4 py-2.5"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <FileText size={14} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {noc.studentName}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  {noc.rollNumber} · {noc.company}
                </p>
              </div>
              {isGenerating && (
                <LoaderCircle
                  size={16}
                  className="animate-spin text-brand-500"
                  aria-hidden="true"
                />
              )}
            </motion.li>
          ))}
        </ul>

        {count > MAX_LISTED && (
          <p className="mt-2.5 text-xs font-medium text-ink-muted">
            and {count - MAX_LISTED} more
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isGenerating}
            className={isGenerating ? "invisible" : ""}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isGenerating}
            className="relative min-w-[100px]"
          >
            {isGenerating ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span className="ml-2">Generating...</span>
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-brand-200">
                  <motion.span
                    className="absolute inset-0 bg-brand-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span className="ml-2">Generate</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default GenerateNocModal;