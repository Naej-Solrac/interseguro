import fs from 'fs';
import path from 'path';
import request, { Response } from 'supertest';
import { defineFeature, loadFeature } from 'jest-cucumber';
import app from '../../../../infrastructure/config/http-app';

interface FeatureTestConfig {
  feature: string;
  endpoint: string;
  fixturesPath: string;
}

interface StepDefinition {
  stepMatcher: RegExp | string;
}

interface FeatureScenarioDefinition {
  name: string;
  steps: {
    given: StepDefinition;
    when: StepDefinition;
    then: StepDefinition;
  };
}

const readJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

export const getInputFixture = (fixturesPath: string, fixtureName: string) =>
  readJsonFile(path.join(__dirname, `../${fixturesPath}/input/${fixtureName}.json`));

export const getExpectedOutputFixture = (fixturesPath: string, fixtureName: string) =>
  readJsonFile(path.join(__dirname, `../${fixturesPath}/output/${fixtureName}.json`));

export const runFeatureScenarios = (
  config: FeatureTestConfig,
  scenarios: FeatureScenarioDefinition[]
) => {
  const feature = loadFeature(path.join(__dirname, config.feature), {
    errors: true,
  });

  defineFeature(feature, (test) => {
    scenarios.forEach((scenario) => {
      test(scenario.name, ({ given, when, then }) => {
        let requestPayload: Record<string, unknown>;
        let response: Response;

        given(scenario.steps.given.stepMatcher as RegExp, (inputFixtureName: string) => {
          requestPayload = getInputFixture(config.fixturesPath, inputFixtureName);
        });

        when(scenario.steps.when.stepMatcher as string, async () => {
          response = await request(app)
            .post(config.endpoint)
            .send(requestPayload);
        });

        then(scenario.steps.then.stepMatcher as RegExp, (outputFixtureName: string) => {
          const expectedResponse = getExpectedOutputFixture(
            config.fixturesPath,
            outputFixtureName
          );
          expect(response.status).toBe(expectedResponse.status);
          expect(response.body).toEqual(expectedResponse.body);
        });
      });
    });
  });
};
