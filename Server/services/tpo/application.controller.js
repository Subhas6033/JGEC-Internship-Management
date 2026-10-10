import {
  getTpoApplications,
  getTpoApplicationById,
  acceptStudentApplication,
  sendStudentApplicationBack,
} from "./application.service.js";

import { asyncHandler, APIRES } from "../../utils/helper.utils.js";

import { HTTP_STATUS } from "../../config/httpConfig.config.js";

/* -------------------------------------------------------------------------- */
/* TPO APPLICATIONS                                                           */
/* -------------------------------------------------------------------------- */

const getTpoApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getTpoApplications({
    user: req.user,
    search: req.query.search,
    status: req.query.status,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        applications,
        "TPO applications fetched successfully",
      ),
    );
});

/* -------------------------------------------------------------------------- */
/* TPO APPLICATION BY ID                                                      */
/* -------------------------------------------------------------------------- */

const getTpoApplicationByIdController = asyncHandler(async (req, res) => {
  const application = await getTpoApplicationById({
    applicationId: req.params.applicationId,
    user: req.user,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "Application fetched successfully",
      ),
    );
});

/* -------------------------------------------------------------------------- */
/* ACCEPT APPLICATION                                                         */
/* -------------------------------------------------------------------------- */

const acceptApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await acceptStudentApplication({
    applicationId,
    tpoId: req.user._id,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "Application accepted successfully",
      ),
    );
});

/* -------------------------------------------------------------------------- */
/* SEND APPLICATION BACK                                                      */
/* -------------------------------------------------------------------------- */

const sendApplicationBack = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { reason } = req.body;

  const application = await sendStudentApplicationBack({
    applicationId,
    tpoId: req.user._id,
    reason,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "Application sent back to student successfully",
      ),
    );
});

export {
  getTpoApplicationsController,
  getTpoApplicationByIdController,
  acceptApplication,
  sendApplicationBack,
};
