import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Organisation } from "../../models/organisation.models.js";

const ORGANISATION_FIELDS =
  "_id organisationName organisationSite organisationLocation organisationMail";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const URL_REGEX = /^https?:\/\/\S+\.\S+$/i;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Picks and validates only the editable fields from the request body.
 * With `partial: true` (update), only fields that were sent are checked.
 */
const parseOrganisationBody = (body = {}, { partial = false } = {}) => {
  const data = {};

  const read = (key) =>
    typeof body[key] === "string" ? body[key].trim() : body[key];

  const required = [
    "organisationName",
    "organisationLocation",
    "organisationMail",
  ];

  for (const key of [...required, "organisationSite"]) {
    const value = read(key);
    const sent = value !== undefined;

    if (!sent) {
      if (!partial && required.includes(key)) {
        throw new APIERR(HTTP_STATUS.BAD_REQUEST, `${key} is required`);
      }
      continue;
    }

    if (typeof value !== "string") {
      throw new APIERR(HTTP_STATUS.BAD_REQUEST, `${key} must be a string`);
    }

    if (required.includes(key) && !value) {
      throw new APIERR(HTTP_STATUS.BAD_REQUEST, `${key} cannot be empty`);
    }

    data[key] = value;
  }

  if (data.organisationMail && !EMAIL_REGEX.test(data.organisationMail)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Enter a valid organisation email",
    );
  }

  if (data.organisationSite && !URL_REGEX.test(data.organisationSite)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Organisation website must start with http:// or https://",
    );
  }

  return data;
};

const findDuplicateByName = (organisationName, excludeId) =>
  Organisation.findOne({
    organisationName: {
      $regex: `^${escapeRegex(organisationName)}$`,
      $options: "i",
    },
    ...(excludeId && { _id: { $ne: excludeId } }),
  })
    .select("_id")
    .lean();

const getAllOrganisations = asyncHandler(async (req, res) => {
  const organisations = await Organisation.find({})
    .select(ORGANISATION_FIELDS)
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
    .select(ORGANISATION_FIELDS)
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

const createOrganisation = asyncHandler(async (req, res) => {
  const data = parseOrganisationBody(req.body);

  if (await findDuplicateByName(data.organisationName)) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An organisation with this name already exists",
    );
  }

  const created = await Organisation.create(data);

  const organisation = await Organisation.findById(created._id)
    .select(ORGANISATION_FIELDS)
    .lean();

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new APIRES(
        HTTP_STATUS.CREATED,
        organisation,
        "Organisation created successfully",
      ),
    );
});

const updateOrganisation = asyncHandler(async (req, res) => {
  const { organisationId } = req.params;

  if (!mongoose.isValidObjectId(organisationId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid organisation id");
  }

  const data = parseOrganisationBody(req.body, { partial: true });

  if (Object.keys(data).length === 0) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "No valid fields to update");
  }

  if (
    data.organisationName &&
    (await findDuplicateByName(data.organisationName, organisationId))
  ) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An organisation with this name already exists",
    );
  }

  const organisation = await Organisation.findByIdAndUpdate(
    organisationId,
    { $set: data },
    { returnDocument: "after", runValidators: true },
  )
    .select(ORGANISATION_FIELDS)
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
        "Organisation updated successfully",
      ),
    );
});

export {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
};
