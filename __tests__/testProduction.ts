import supertest from "supertest";
import defaults from "superagent-defaults";
import "../src/config/envConfig"

import {productionEnvironment, prodClientAuthCredentials} from "../src/config/constants"
import { getUserToken } from "../src/server";

import authTestSuite from "../src/queries"

const request = defaults(supertest(productionEnvironment.graphqlUrl));

beforeAll(async () => {
    const tokenDevelop = await getUserToken(productionEnvironment.signInUrl, prodClientAuthCredentials)
    const commonHeaders = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + tokenDevelop
    }
    request.set(commonHeaders);
  })

authTestSuite(request, productionEnvironment, prodClientAuthCredentials)