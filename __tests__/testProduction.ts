import supertest from "supertest";
import defaults from "superagent-defaults";
import "../src/config/envConfig"

import {productionEnvironment, prodClientAuthCredentials} from "../src/config/constants"
import { getUserToken } from "../src/server";

import AuthTestSuite from "../src/tests/Queries"
import UserMutationsTestSuite from "../src/tests/UserMutations"
import customerMutationsTestSuite from "../src/tests/CustomerMutations"

import BreakSaveUserMutationTestSuite from "../src/tests/EdgeCases"


const request = defaults(supertest(productionEnvironment.graphqlUrl));

beforeAll(async () => {
    const tokenDevelop = await getUserToken(productionEnvironment.signInUrl, prodClientAuthCredentials)
    const commonHeaders = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + tokenDevelop
    }
    request.set(commonHeaders);
  })

AuthTestSuite(request, productionEnvironment, prodClientAuthCredentials)
UserMutationsTestSuite(request)
BreakSaveUserMutationTestSuite(request)
customerMutationsTestSuite(request, prodClientAuthCredentials)