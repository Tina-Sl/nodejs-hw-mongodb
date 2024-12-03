function parseContactType(type) {
  const contactTypes = ['work', 'home', 'personal'];
  return contactTypes.includes(type) ? type : undefined;
}

function parseBoolean(value) {
  if (typeof value !== 'string') return undefined;
  switch (value.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
  }
  return undefined;
}

export function parseFilterParams(query) {
  const { contactType, isFavourite } = query;
  return {
    contactType: parseContactType(contactType),
    isFavourite: parseBoolean(isFavourite),
  };
}
