import { HomeStatusSchema, type HomeStatus } from './home.schemas';
// To make real validated HTTP requests with Axios:
// import { getValidated } from '@shared/api';

/**
 * Fetch home status with ArkType response validation.
 */
export async function getHomeStatus(): Promise<HomeStatus> {
  // Real endpoint pattern:
  // return getValidated('/api/status', HomeStatusSchema);

  // Minimal local data validated via ArkType to ensure offline compilation & demo
  return HomeStatusSchema({
    appName: 'SimpliMEI',
    version: '1.0.0',
    status: 'healthy',
  }) as HomeStatus;
}
