import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Organisation } from "../../models/organisation.models.js";

const getAllOrganisations = asyncHandler(async (req, res) => {
  const organisations = await Organisation.find({})
    .select(
      "_id organisationName organisationSite organisationLocation organisationMail",
    )
    .sort({ organisationName: 1 })
    .lean();

  return res
    .status(HTTP_STATUS.SUCCESS)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        organisations,
        "Organisations fetched successfully",
      ),
    );
});

const getOrganisationById = asyncHandler(async (req, res) => {
  const { organisationId } = req.params;

  const organisation = await Organisation.findById(organisationId)
    .select(
      "_id organisationName organisationSite organisationLocation organisationMail",
    )
    .lean();

  if (!organisation) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Organisation not found");
  }

  return res
    .status(HTTP_STATUS.SUCCESS)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        organisation,
        "Organisation fetched successfully",
      ),
    );
});

export { getAllOrganisations, getOrganisationById };
