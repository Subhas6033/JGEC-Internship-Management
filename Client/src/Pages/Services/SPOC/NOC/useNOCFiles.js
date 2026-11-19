import { useCallback, useState } from "react";
import { getErrorMessage, openPdfInNewTab } from "./noc.utils";

/** Handles viewing and downloading generated NOC PDFs. */
const useNocFiles = ({ viewNoc, downloadNoc, notify }) => {
  const [activeAction, setActiveAction] = useState(null);

  const run = useCallback(
    async (id, type, task, failureMessage) => {
      setActiveAction({ id, type });

      try {
        await task();
      } catch (error) {
        notify({
          variant: "error",
          title: type === "view" ? "Unable to open NOC" : "Download failed",
          message: getErrorMessage(error, failureMessage),
        });
      } finally {
        setActiveAction(null);
      }
    },
    [notify],
  );

  const view = useCallback(
    (noc) =>
      run(
        noc.id,
        "view",
        async () => {
          const blob = await viewNoc(noc.id);

          if (!(blob instanceof Blob)) {
            throw new Error("The server returned an invalid NOC document.");
          }

          openPdfInNewTab(blob);
        },
        "Unable to open the generated NOC.",
      ),
    [run, viewNoc],
  );

  const download = useCallback(
    (noc) =>
      run(
        noc.id,
        "download",
        () => downloadNoc({ applicationId: noc.id, filename: noc.fileName }),
        "Unable to download the generated NOC.",
      ),
    [downloadNoc, run],
  );

  return { activeAction, view, download };
};

export default useNocFiles;
