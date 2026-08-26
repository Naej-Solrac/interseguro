import { runFeatureScenarios } from '../util/http-feature-test.helper';

const config = {
  feature: '../matrix-statistics.feature',
  endpoint: '/api/stats',
  fixturesPath: 'matrix-statistics',
};

const scenarios = [
  {
    name: 'ES001_Observar que el servicio responda correctamente al calcular estadisticas de Q y R',
    steps: {
      given: {
        stepMatcher: /^se desea calcular estadisticas de matrices con (.*)$/,
      },
      when: {
        stepMatcher: 'envio la peticion al servicio',
      },
      then: {
        stepMatcher: /^la respuesta deberia ser (.*)$/,
      },
    },
  },
];

runFeatureScenarios(config, scenarios);
