import { useCallback, useState } from "react";

import { getErrorMessage } from "./noc.utils";

const pluralise = (count) => (count === 1 ? "NOC" : "NOCs");

/**
 * Generates NOCs for one or many applications. Requests run in parallel and
 * failures are isolated, so one bad application never blocks the rest.
 * Resolves with the ids that were generated successfully.
 */
const useNocGeneration = ({ generateNoc, notify }) => {
  const [generatingIds, setGeneratingIds] = useState(() => new Set());

  const setBusy = useCallback((ids, busy) => {
    setGeneratingIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => (busy ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const generate = useCallback(
    async (ids) => {
      setBusy(ids, true);

      const results = await Promise.allSettled(
        ids.map((id) => generateNoc(id)),
      );

      setBusy(ids, false);

      const succeeded = ids.filter(
        (_, index) => results[index].status === "fulfilled",
      );
      const failures = results.filter((result) => result.status === "rejected");

      if (failures.length === 0) {
        notify({
          variant: "success",
          title: `${pluralise(succeeded.length)} generated`,
          message: `${succeeded.length} ${pluralise(succeeded.length)} generated successfully.`,
        });
      } else if (succeeded.length > 0) {
        notify({
          variant: "warning",
          title: "Some NOCs could not be generated",
          message: `${succeeded.length} generated, ${failures.length} failed. Please retry the failed applications.`,
        });
      } else {
        notify({
          variant: "error",
          title: "NOC generation failed",
          message: getErrorMessage(
            failures[0].reason,
            "Unable to generate the NOC. Please try again.",
          ),
        });
      }

      return succeeded;
    },
    [generateNoc, notify, setBusy],
  );

  return { generate, generatingIds };
};

export default useNocGeneration;
