import app, { getUserToken } from "../src/server";
import supertest from "supertest";
const request = supertest(app);

import {developEnvironment, devClientAuthCredentials} from "../src/config/constants"

let tokenDevelop = null;

beforeAll(async () => {
  tokenDevelop = await getUserToken(developEnvironment.signInUrl, devClientAuthCredentials)
})

test("fetch UserReadModels", async (done) => {
  const queryToFetchUserReadModels = {
    query: `query {
      UserReadModels {
        id
        role
      }
    }`
  }
  supertest(developEnvironment.graphqlUrl)
    .post('/')
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + tokenDevelop)
    .send(queryToFetchUserReadModels)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModels).toBeInstanceOf(Array);
      expect(res.body.data.UserReadModels).toContainEqual({
        "id": devClientAuthCredentials.username,
        "role": "Admin"
      })
      expect(res.body.data.UserReadModels).toHaveLength(4);
      done();
    });
});

test("fetch Single UserReadModel for specific id", async (done) => {
  const queryToFetchSingleUserReadModel = {
    query: `query {
      UserReadModel(id: "${devClientAuthCredentials.username}") {
        id
        role
      }
    }`
  }
  supertest(developEnvironment.graphqlUrl)
    .post('/')
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + tokenDevelop)
    .send(queryToFetchSingleUserReadModel)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModel.id).toEqual(devClientAuthCredentials.username)
      expect(res.body.data.UserReadModel.role).toEqual("Admin")
      done();
    });
});


test("Check if CustomerReadModels is empty", async (done) => {
  const queryToFetchSingleUserReadModel = {
    query: `query {
      CustomerReadModels {
        name
        surname
        userId
        id
        photoUrl
      }
    }`
  }
  supertest(developEnvironment.graphqlUrl)
    .post('/')
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + tokenDevelop)
    .send(queryToFetchSingleUserReadModel)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      const data = res.body.data.CustomerReadModels
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(0)
      done();
    });
});