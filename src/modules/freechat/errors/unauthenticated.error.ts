export default class AuthenticatedError extends Error {
  constructor(message?: string) {
    super(message ?? 'User is not authenticated');
    this.name = 'AuthenticatedError'
  }
}
