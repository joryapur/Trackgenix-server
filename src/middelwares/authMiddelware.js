import firebaseApp from '../helpers/firebase';

const checkAuth = (roles) => async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ message: 'Provide a valid token on request headers' });
    }

    const user = await firebaseApp.auth().verifyIdToken(token);

    if (!roles.includes(user.role)) {
      throw new Error('Invalid role for this user. Try contact some supervisor or admin to access app.');
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: error.toString(), data: undefined, error: true });
  }
};

export default checkAuth;
