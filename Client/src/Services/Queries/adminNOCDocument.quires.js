import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

const initialState = { status: "idle", url: "", message: "" };

/*
Loads the NOC PDF through the authenticated API as a Blob and exposes it as
an object URL, so the preview works even when the file is private, served
from another origin, or blocked from iframes by X-Frame-Options.
*/
export const useNocDocument = (applicationId) => {
  const [state, setState] = useState(initialState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!applicationId) {
      setState(initialState);
      return undefined;
    }

    const controller = new AbortController();
    let objectUrl = "";

    setState({ status: "loading", url: "", message: "" });

    apiClient
      .get(`/admin/noc-management/${applicationId}/document`, {
        responseType: "blob",
        signal: controller.signal,
      })
      .then((response) => {
        // Works whether or not your interceptor unwraps response.data.
        const blob = response?.data ?? response;

        if (!(blob instanceof Blob) || blob.size === 0) {
          throw new Error("The NOC document is empty.");
        }

        const pdf =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });

        objectUrl = URL.createObjectURL(pdf);

        setState({ status: "ready", url: objectUrl, message: "" });
      })
      .catch((error) => {
        if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
          return;
        }

        const code = error?.response?.status;

        setState({
          status: code === 404 ? "missing" : "error",
          url: "",
          message:
            code === 404
              ? "This NOC has no stored document yet."
              : "Unable to load the NOC document. Please try again.",
        });
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [applicationId, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, reload };
};
