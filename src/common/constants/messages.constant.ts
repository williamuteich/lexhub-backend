export const MESSAGES = {

  SUCCESS: {
    CREATED: (entity: string) => `${entity} created successfully`,
    UPDATED: (entity: string) => `${entity} updated successfully`,
    DELETED: (entity: string) => `${entity} deleted successfully`,
    RETRIEVED: (entity: string) => `${entity} successfully retrieved`,
  },

  NOT_FOUND: {
    USER: 'User not found',
    CLIENT: 'Client not found',
    PROCESSO: 'Processo not found',
    DOCUMENT: 'Document not found',
    ENDERECO: 'Endereco not found',
    DOCUMENTO_PROCESSO: 'Documento do processo not found',
  },

  CONFLICT: {
    USER_EXISTS: 'User already exists',
    CLIENT_EXISTS: 'Client already exists',
    PROCESSO_NUMBER_EXISTS: 'Process number already exists',
    ADDRESS_EXISTS: 'Client already has an address',
  },

  FORBIDDEN: {
    VIEW_OWN_PROFILE: 'You can only view your own profile',
    UPDATE_OWN_PROFILE: 'You can only update your own profile',
    VIEW_OWN_DATA: 'You can only view your own data',
    UPDATE_OWN_DATA: 'You can only update your own data',
    VIEW_OWN_ADDRESS: 'You can only view your own address',
    UPDATE_OWN_ADDRESS: 'You can only update your own address',
    CANNOT_CHANGE_ROLE: 'You cannot change your own role',
  },

  UNAUTHORIZED: {
    INVALID_CREDENTIALS: 'Invalid email or password',
  },
  INTERNAL_ERROR: {
    FETCH_FAILED: (entity: string) => `Failed to fetch ${entity}`,
    CREATE_FAILED: (entity: string) => `Failed to create ${entity}`,
    UPDATE_FAILED: (entity: string) => `Failed to update ${entity}`,
    DELETE_FAILED: (entity: string) => `Failed to delete ${entity}`,
  },
} as const;
