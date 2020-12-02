import { getUserToken } from "../src/server";
import supertest from "supertest";
import defaults from "superagent-defaults";

import {developEnvironment, devClientAuthCredentials} from "../src/config/constants"

const request = defaults(supertest(developEnvironment.graphqlUrl));

beforeAll(async () => {
  const tokenDevelop = await getUserToken(developEnvironment.signInUrl, devClientAuthCredentials)
  const commonHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + tokenDevelop
  }
  request.set(commonHeaders);
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
  request
    .post('/')
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
      done();
    });
});

test("Check if UserReadModels without authentication token return errors", 
  async (done) => {
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
      .send(queryToFetchUserReadModels)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.errors[0].message).toEqual("Access denied for read model UserReadModel")
        expect(res.body.data.UserReadModels).toBeNull();
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
  request
    .post('/')
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

test("check if Single UserReadModel without auth token return errors", 
  async (done) => {
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
      .send(queryToFetchSingleUserReadModel)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.errors[0].message).toEqual("Access denied for read model UserReadModel")
        expect(res.body.data.UserReadModel).toBeNull();
        done();
      });
});

test("Check if CustomerReadModels is empty", async (done) => {
  const queryToFetchCustomerReadModels = {
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
  request
    .post('/')
    .send(queryToFetchCustomerReadModels)
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

test("Check if CustomerReadModels without authentication token does not return errors ", async (done) => {
  const queryToFetchCustomerReadModels = {
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
    .send(queryToFetchCustomerReadModels)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body.errors).toBeUndefined()
      expect(res.body.data.CustomerReadModels).toHaveLength(0)
      done();
    });
});