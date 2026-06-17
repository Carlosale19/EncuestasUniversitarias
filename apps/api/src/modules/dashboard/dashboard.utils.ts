type OverviewSurvey = {
  id: string;
  titulo: string;
  publicSlug: string;
  isActive: boolean;
  createdAt: Date;
  route: {
    nombreRuta: string;
  };
  responses: Array<{ id: string }>;
};

export function buildDashboardOverview(surveys: OverviewSurvey[]) {
  return {
    totalSurveys: surveys.length,
    activeSurveys: surveys.filter((survey) => survey.isActive).length,
    totalResponses: surveys.reduce((total, survey) => total + survey.responses.length, 0),
    surveys: surveys.map((survey) => ({
      id: survey.id,
      titulo: survey.titulo,
      publicSlug: survey.publicSlug,
      isActive: survey.isActive,
      routeName: survey.route.nombreRuta,
      responsesCount: survey.responses.length,
      createdAt: survey.createdAt.toISOString(),
    })),
  };
}
