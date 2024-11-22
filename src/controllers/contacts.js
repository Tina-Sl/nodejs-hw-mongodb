import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  replaceContact,
} from '../services/contacts.js';

export async function getContactsController(req, res) {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const result = await createContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(204).send();
}

export async function patchContactController(req, res) {
  const { contactId } = req.params;
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const result = await updateContact(contactId, contact);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.send({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
}

export async function replaceContactController(req, res) {
  const { contactId } = req.params;
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const result = await replaceContact(contactId, contact);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (result.isNew) {
    return res.status(201).send({
      status: 201,
      message: 'Successfully created a contact!',
      data: result.contact,
    });
  }
  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
}
