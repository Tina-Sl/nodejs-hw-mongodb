import express from 'express';
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  deleteContactController,
  replaceContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, ctrlWrapper(createContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.put('/:contactId', jsonParser, ctrlWrapper(replaceContactController));
router.patch('/:contactId', jsonParser, ctrlWrapper(patchContactController));

export default router;
