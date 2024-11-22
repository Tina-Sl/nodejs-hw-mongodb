import { ContactsCollection } from '../db/models/contacts.js';

export function getAllContacts() {
  return ContactsCollection.find();
}

export function getContactById(id) {
  return ContactsCollection.findById(id);
}

export async function createContact(contact) {
  return ContactsCollection.create(contact);
}

export async function deleteContact(id) {
  return ContactsCollection.findByIdAndDelete({
    _id: id,
  });
}

export function updateContact(id, contact) {
  return ContactsCollection.findByIdAndUpdate(id, contact, {
    new: true,
  });
}

export async function replaceContact(id, contact) {
  const rawResult = await ContactsCollection.findByIdAndUpdate(id, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
