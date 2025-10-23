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
    AGENDAMENTO: 'Agendamento not found',
  },

  CONFLICT: {
    USER_EXISTS: 'User already exists',
    CLIENT_EXISTS: 'Client already exists',
    PROCESSO_NUMBER_EXISTS: 'Process number already exists',
    ADDRESS_EXISTS: 'Client already has an address',
    AGENDAMENTO_EXISTS: 'Agendamento already exists for this date and time'
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

  PASSWORD_RESET: {
    EMAIL_SENT: 'If the email exists, a reset link has been sent',
    SUCCESS: 'Password reset successfully',
    INVALID_TOKEN: 'Invalid or expired reset token',
    TOKEN_USED: 'This reset token has already been used',
    TOKEN_EXPIRED: 'This reset token has expired',
  },

  INTERNAL_ERROR: {
    FETCH_FAILED: (entity: string) => `Failed to fetch ${entity}`,
    CREATE_FAILED: (entity: string) => `Failed to create ${entity}`,
    UPDATE_FAILED: (entity: string) => `Failed to update ${entity}`,
    DELETE_FAILED: (entity: string) => `Failed to delete ${entity}`,
    EMAIL_SEND_FAILED: 'Failed to send email',
  },
} as const;
