const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) throw new Error(`Please provide the NODE_ENV Value`);

const isProduction = NODE_ENV === "production";

export const cookieConfig = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "lax",
  maxAge: function getExpiry(value) {
    value * 60 * 1000;
  },
};
