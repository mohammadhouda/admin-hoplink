import express from 'express';
import { getCharitiesController, createCharityController, updateCharityController, deleteCharityController } from '../controllers/charity.controller.js';

const router = express.Router();

router.get('/', getCharitiesController);
router.post('/', createCharityController);
router.patch('/:userId', updateCharityController);
router.delete('/:userId', deleteCharityController);



export default router;