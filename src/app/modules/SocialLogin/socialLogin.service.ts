import jwt, { Secret } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";


// google login into db
const googleLoginIntoDb = async (user: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (isUserExist) {
    const token = jwtHelpers.generateToken(
      {
        id: isUserExist?.id,
        email: isUserExist?.email,
        role: isUserExist?.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return token;
  }

  if (!isUserExist) {
    const newUser = await prisma.user.create({
      data: {
        googleId: user.id,
        email: user.emails ? user.emails[0].value : '',
        name: user.displayName || 'Unknown',
      },
    });

    const token = jwtHelpers.generateToken(
      {
        id: newUser?.id,
        email: newUser?.email,
        role: newUser?.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return token;
  }
};

// facebook login into db
const facebookLoginIntoDb = async (user: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (isUserExist) {
    const token = jwtHelpers.generateToken(
      {
        id: isUserExist?.id,
        email: isUserExist?.email,
        role: isUserExist?.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return token;
  }

  if (!isUserExist) {
    const newUser = await prisma.user.create({
      data: {
        facebookId: user.id,
        email: user.emails ? user.emails[0].value : '',
        name: user.displayName || 'Unknown',
      },
    });

    const token = jwtHelpers.generateToken(
      {
        id: newUser?.id,
        email: newUser?.email,
        role: newUser?.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return token;
  }
};
export const SocialLoginService = {
  googleLoginIntoDb,
  facebookLoginIntoDb,
};
