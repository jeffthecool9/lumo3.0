export type AuthMethod = 'google' | 'email' | 'phone';
export type AuthMethods = Record<AuthMethod, boolean>;

export function availableAuthMethods(config: {
  auth: boolean; authServer: boolean; database: boolean;
  authMethods?: Partial<AuthMethods>;
} | null): AuthMethods {
  const ready = Boolean(config?.auth && config.authServer && config.database);
  return {
    google: ready && config?.authMethods?.google === true,
    email: ready && config?.authMethods?.email === true,
    phone: ready && config?.authMethods?.phone === true,
  };
}
