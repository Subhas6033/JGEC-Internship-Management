import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileCheck2, FileClock, Files, UsersRound } from "lucide-react";
import { fadeUp, staggerContainer } from "../../../../Animations/animations";
import {
  useDownloadSpocNoc,
  useGenerateSpocNoc,
  useSpocApplications,
  useViewSpocNoc,
} from "../../../../Services/Queries/spocApplication.quires";
import GenerateNocModal from "./GenerateNOCModal";
import GeneratedNocsSection from "./GeneratedNOCSection";
import NocStatCard from "./NOCStatusCard";
import NocStatusBanner from "./NOCStatusBanner";
import PendingNocsSection from "./PendinNOCSection";
import QueryErrorCard from "./QueryErrorCard";
import ToastViewport from "./TaostViewPort";
import useNocFiles from "./useNOCFiles";
import useNocGeneration from "./useNOCGenerations";
import useToasts from "./useToasts";
import { getErrorMessage, toNocRecords } from "./noc.utils";

// Applications approved by the SPOC that still need a NOC.
const PENDING_STATUS = "approved_by_spoc";
const GENERATED_STATUS = "noc_generated";

const SPOCNOC = () => {
  const pendingQuery = useSpocApplications({ status: PENDING_STATUS });
  const generatedQuery = useSpocApplications({ status: GENERATED_STATUS });

  const { mutateAsync: generateNoc } = useGenerateSpocNoc();
  const { mutateAsync: downloadNoc } = useDownloadSpocNoc();
  const { mutateAsync: viewNoc } = useViewSpocNoc();

  const { toasts, notify, dismiss } = useToasts();
  const { generate, generatingIds } = useNocGeneration({ generateNoc, notify });
  const { activeAction, view, download } = useNocFiles({
    viewNoc,
    downloadNoc,
    notify,
  });

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [targets, setTargets] = useState([]);

  const pendingNocs = useMemo(
    () => toNocRecords(pendingQuery.data, PENDING_STATUS),
    [pendingQuery.data],
  );

  const generatedNocs = useMemo(
    () => toNocRecords(generatedQuery.data, GENERATED_STATUS),
    [generatedQuery.data],
  );

  const companyCount = useMemo(
    () => new Set(generatedNocs.map((noc) => noc.company)).size,
    [generatedNocs],
  );

  const studentCount = useMemo(
    () => new Set(generatedNocs.map((noc) => noc.studentId)).size,
    [generatedNocs],
  );

  const isLoading = pendingQuery.isLoading || generatedQuery.isLoading;
  const isError = pendingQuery.isError || generatedQuery.isError;
  const loadError = pendingQuery.error ?? generatedQuery.error;

  const handleToggle = useCallback((id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedIds((current) => {
      const selectable = pendingNocs
        .filter((noc) => !generatingIds.has(noc.id))
        .map((noc) => noc.id);

      return selectable.every((id) => current.has(id))
        ? new Set()
        : new Set(selectable);
    });
  }, [pendingNocs, generatingIds]);

  const handleClearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const handleCloseModal = useCallback(() => setTargets([]), []);

  const handleConfirmGenerate = async () => {
    const succeeded = await generate(targets.map((noc) => noc.id));

    setSelectedIds((current) => {
      const next = new Set(current);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });
    setTargets([]);
  };

  const handleRetry = () => {
    pendingQuery.refetch();
    generatedQuery.refetch();
  };

  const isModalGenerating = targets.some((noc) => generatingIds.has(noc.id));

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="box-border w-full min-w-0 max-w-none overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
      >
        <motion.header variants={fadeUp} className="w-full min-w-0">
          <p className="eyebrow">SPOC NOCs</p>

          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            NOC Management
          </h1>

          <p className="mt-2 w-full max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            Generate and manage No Objection Certificates for approved
            internship applications.
          </p>
        </motion.header>

        {isError ? (
          <QueryErrorCard
            message={getErrorMessage(loadError, "Something went wrong")}
            onRetry={handleRetry}
          />
        ) : (
          <>
            {!isLoading && (
              <NocStatusBanner pendingCount={pendingNocs.length} />
            )}

            <motion.section
              variants={staggerContainer}
              className="mt-6 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <NocStatCard
                icon={FileClock}
                label="Pending"
                value={pendingNocs.length}
                helper="Awaiting NOC generation"
              />
              <NocStatCard
                icon={FileCheck2}
                label="NOCs Generated"
                value={generatedNocs.length}
                helper="Approved applications"
              />
              <NocStatCard
                icon={Files}
                label="Companies"
                value={companyCount}
                helper="Companies with generated NOCs"
              />
              <NocStatCard
                icon={UsersRound}
                label="Students"
                value={studentCount}
                helper="Students covered by NOCs"
              />
            </motion.section>

            <PendingNocsSection
              nocs={pendingNocs}
              loading={pendingQuery.isLoading}
              selectedIds={selectedIds}
              generatingIds={generatingIds}
              onToggle={handleToggle}
              onToggleAll={handleToggleAll}
              onClearSelection={handleClearSelection}
              onGenerate={setTargets}
            />

            <GeneratedNocsSection
              nocs={generatedNocs}
              loading={generatedQuery.isLoading}
              activeAction={activeAction}
              onView={view}
              onDownload={download}
            />
          </>
        )}
      </motion.div>

      <GenerateNocModal
        nocs={targets}
        isGenerating={isModalGenerating}
        onConfirm={handleConfirmGenerate}
        onClose={handleCloseModal}
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default SPOCNOC;
