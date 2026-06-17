import { describe, expect, it } from 'vitest';
import { buildDashboardOverview } from './dashboard.utils.js';

describe('buildDashboardOverview', () => {
  it('resume encuestas, activas y respuestas totales', () => {
    const overview = buildDashboardOverview([
      {
        id: '1',
        titulo: 'Ruta Norte',
        publicSlug: 'ruta-norte-1234',
        isActive: true,
        createdAt: new Date('2026-06-15T10:00:00.000Z'),
        route: { nombreRuta: 'Ruta Norte' },
        responses: [{ id: 'r1' }, { id: 'r2' }],
      },
      {
        id: '2',
        titulo: 'Ruta Sur',
        publicSlug: 'ruta-sur-5678',
        isActive: false,
        createdAt: new Date('2026-06-16T10:00:00.000Z'),
        route: { nombreRuta: 'Ruta Sur' },
        responses: [{ id: 'r3' }],
      },
    ]);

    expect(overview.totalSurveys).toBe(2);
    expect(overview.activeSurveys).toBe(1);
    expect(overview.totalResponses).toBe(3);
    expect(overview.surveys[0]?.routeName).toBe('Ruta Norte');
  });
});
