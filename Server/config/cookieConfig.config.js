const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  throw new Error("Please provide the NODE_ENV Value");
}

const isProduction = NODE_ENV === "production";

export const cookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",

  // 7 days in milliseconds
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
