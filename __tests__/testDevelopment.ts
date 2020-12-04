import supertest from "supertest";
import defaults from "superagent-defaults";
import "../src/config/envConfig"

import {developEnvironment, devClientAuthCredentials} from "../src/config/constants"
import { getUserToken } from "../src/server";

import authTestSuite from "../src/tests/Queries"
import UserMutationsTestSuite from "../src/tests/UserMutations"
import BreakSaveUserMutationTestSuite from "../src/tests/EdgeCases"
import customerMutationsTestSuite from "../src/tests/CustomerMutations"

const request = defaults(supertest(developEnvironment.graphqlUrl));

beforeAll(async () => {
    const tokenDevelop = await getUserToken(developEnvironment.signInUrl, devClientAuthCredentials)
    const commonHeaders = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + tokenDevelop
    }
    request.set(commonHeaders);
  })

authTestSuite(request, developEnvironment, devClientAuthCredentials)
UserMutationsTestSuite(request)
customerMutationsTestSuite(request, devClientAuthCredentials)
BreakSaveUserMutationTestSuite(request)