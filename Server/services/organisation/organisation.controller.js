import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Organisation } from "../../models/organisation.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { NOC } from "../../models/noc.models.js";

const ORGANISATION_FIELDS =
  "_id organisationName organisationSite organisationLocation organisationMail createdAt updatedAt";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const URL_REGEX = /^https?:\/\/\S+\.\S+$/i;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Whitelist: never pass a client-supplied field name straight into .sort().
const SORTABLE_FIELDS = new Set([
  "organisationName",
  "organisationLocation",
  "createdAt",
  "updatedAt",
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
};

const readQueryString = (value) =>
  typeof value === "string" ? value.trim() : "";

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid organisation id");
  }
};

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

/** Unique locations (case-insensitive), sorted A–Z, for the filter dropdown. */
const getUniqueLocations = async () => {
  const raw = await Organisation.distinct("organisationLocation");
  const unique = new Map();

  for (const location of raw) {
    const trimmed = typeof location === "string" ? location.trim() : "";
    if (trimmed && !unique.has(trimmed.toLowerCase())) {
      unique.set(trimmed.toLowerCase(), trimmed);
    }
  }

  return [...unique.values()].sort((a, b) => a.localeCompare(b));
};

/**
 * GET /organisations
 * Query: page, limit, search, location, sortBy, order (asc | desc)
 */
const getAllOrganisations = asyncHandler(async (req, res) => {
  const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);
  const requestedPage = parsePositiveInt(req.query.page, 1);

  const search = readQueryString(req.query.search);
  const location = readQueryString(req.query.location);

  const sortBy = SORTABLE_FIELDS.has(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const filter = {};

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { organisationName: pattern },
      { organisationMail: pattern },
      { organisationSite: pattern },
      { organisationLocation: pattern },
    ];
  }

  if (location) {
    filter.organisationLocation = {
      $regex: `^${escapeRegex(location)}$`,
      $options: "i",
    };
  }

  const total = await Organisation.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // If the last item of the last page was deleted, fall back to the new last page.
  const page = Math.min(requestedPage, totalPages);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [organisations, totalAll, addedThisMonth, latest, locations] =
    await Promise.all([
      Organisation.find(filter)
        .select(ORGANISATION_FIELDS)
        // _id as a tie-breaker keeps pagination stable when sort values repeat.
        .sort({ [sortBy]: sortDirection, _id: sortDirection })
        .collation({ locale: "en", strength: 2 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Organisation.estimatedDocumentCount(),

      Organisation.countDocuments({ createdAt: { $gte: monthStart } }),

      Organisation.findOne({})
        .sort({ createdAt: -1 })
        .select("organisationName createdAt")
        .lean(),

      getUniqueLocations(),
    ]);

  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        organisations,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        // Portal-wide numbers: they do not change when the user filters the list.
        stats: {
          total: totalAll,
          addedThisMonth,
          locations: locations.length,
          latest: latest
            ? {
                organisationName: latest.organisationName,
                createdAt: latest.createdAt,
              }
            : null,
        },
        filters: { locations },
      },
      "Organisations fetched successfully",
    ),
  );
});

const getOrganisationById = asyncHandler(async (req, res) => {
  const { organisationId } = req.params;
  assertValidId(organisationId);

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
  assertValidId(organisationId);

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

/**
 * DELETE /organisations/:organisationId
 * Refuses to delete an organisation that applications or NOCs still point to,
 * because that would leave them referencing a missing document.
 */
const deleteOrganisation = asyncHandler(async (req, res) => {
  const { organisationId } = req.params;
  assertValidId(organisationId);

  const organisation = await Organisation.findById(organisationId)
    .select("_id organisationName")
    .lean();

  if (!organisation) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Organisation not found");
  }

  const [applications, nocs] = await Promise.all([
    StudentApplication.countDocuments({ organisation: organisationId }),
    NOC.countDocuments({ organisation: organisationId }),
  ]);

  if (applications > 0 || nocs > 0) {
    const parts = [];
    if (applications > 0) {
      parts.push(
        `${applications} student application${applications > 1 ? "s" : ""}`,
      );
    }
    if (nocs > 0) {
      parts.push(`${nocs} NOC${nocs > 1 ? "s" : ""}`);
    }

    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      `${organisation.organisationName} cannot be deleted because it is linked to ${parts.join(" and ")}.`,
    );
  }

  await Organisation.deleteOne({ _id: organisationId });

  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        _id: organisation._id,
        organisationName: organisation.organisationName,
      },
      "Organisation deleted successfully",
    ),
  );
});

export {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
};
