import express from 'express';
import { getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,  
    register} from '../controller/UserController.js';
    import { verifyToken } from '../middleware/VerifyToken.js';
    import { getAccessToken } from '../controller/TokenController.js';

    const userRouter = express.Router();

    //token
    userRouter.get('/token', getAccessToken);

    //login and logout user
    userRouter.post('/login', loginUser);
    userRouter.post('/logout', logoutUser);

    //crud user
    userRouter.get('/users', verifyToken, getUsers);
    userRouter.get('/users/:id', verifyToken, getUserById);   
    userRouter.post('/register', register);
    userRouter.put('/users/:id', verifyToken, updateUser);
    userRouter.delete('/users/:id', verifyToken, deleteUser);

    userRouter.get('/user', getUsers); // for testing purposes

    export default userRouter;