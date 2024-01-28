import { Router } from 'express';

import { createUser, getUserById, getUsers } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
