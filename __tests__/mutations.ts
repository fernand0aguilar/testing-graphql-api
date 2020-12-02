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

describe('test user CRUD', () => {
  const queryToFetchUserReadModels = {
    query: `query {
      UserReadModels {
        id
        role
      }
    }`
  }
  const testUserCredentialsInput = {
    username: "test123@test.com", 
    password: "_Test123", 
    role: "Admin"
  }

  const mutationToSaveNewUser = {
    query: `
      mutation {
        SaveUser(
            input: {
            username: "${testUserCredentialsInput.username}", 
            password: "${testUserCredentialsInput.password}", 
            role: "${testUserCredentialsInput.role}"
          }
        )
      }`
  }

  const mutationToChangeUserRole = {
    query: `mutation {
        ChangeUserRole(
            input: {
            username: "${testUserCredentialsInput.username}",  
            role: "User"
          }
        )
    }`
  }
  const mutationToDeleteUser = {
    query: `mutation {
        DeleteUser(
            input: {
            username: "${testUserCredentialsInput.username}",  
          }
        )
    }`
  }

  test("It should verify that the user is not currently in the list", async (done) => {
    request
      .post('/')
      .send(queryToFetchUserReadModels)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.data.UserReadModels).not.toContainEqual({
          id: testUserCredentialsInput.username, 
          role: testUserCredentialsInput.role
        })
        done();
      })
  });

  test("It should send mutationToSaveNewUser and return true", async (done) => {
    request
    .post('/')
    .send(mutationToSaveNewUser)
    .expect(200)
    .end((err, res) => {
      if(err) return done(err)
      expect(res.body.data.SaveUser).toEqual(true)
      done()
    })
  })

  test("It should send the same mutationToSaveNewUser and return error for user already existing", 
  async (done) => {
    request
    .post('/')
    .send(mutationToSaveNewUser)
    .expect(200)
    .end((err, res) => {
      if(err) return done(err)
      expect(res.body.data.SaveUser).toBeNull()
      expect(res.body.errors[0].message).toBe("An account with the given email already exists.")
      done()
    })
  })
  
  test("It should verify that the user created was saved and exists in the list", async (done) => {
    request
    .post('/')
    .send(queryToFetchUserReadModels)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModels).toBeInstanceOf(Array);
      expect(res.body.data.UserReadModels).toContainEqual({
        id: testUserCredentialsInput.username, 
        role: testUserCredentialsInput.role
      })
      done();
    });
  })
  test("It should send the mutation to change user role and return true", async (done) => {
    request
    .post('/')
    .send(mutationToChangeUserRole)
    .expect(200)
    .end((err, res) => {
      if(err) return done(err)
      expect(res.body.data.ChangeUserRole).toEqual(true)
      done();
    })
  })

  test("It should verify that the user has a different role by querying for a single user", async (done) => {
    request
    .post('/')
    .send({query: `query {
        UserReadModel(id:"${testUserCredentialsInput.username}") {
          id
          role
        }
      }`})
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModel.id).toEqual(testUserCredentialsInput.username)
      expect(res.body.data.UserReadModel.role).toEqual("User")
      done();
    });
  })
  test("It should verify that the user has a different role", async (done) => {
    request
    .post('/')
    .send(queryToFetchUserReadModels)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModels).toBeInstanceOf(Array);
      expect(res.body.data.UserReadModels).toContainEqual({
        id: testUserCredentialsInput.username, 
        role: "User"
      })
      done();
    });
  })
  test("It should delete the user and return true", async (done) => {
    request
    .post('/')
    .send(mutationToDeleteUser)
    .expect(200)
    .end((err, res) => {
      if(err) return done(err)
      expect(res.body.data.DeleteUser).toEqual(true)
      done()
    })
  })
  test("It should verify that the user was deleted in fact", async (done) => {
    request
      .post('/')
      .send(queryToFetchUserReadModels)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.data.UserReadModels).not.toContainEqual({
          id: testUserCredentialsInput.username, 
          role: testUserCredentialsInput.role
        })
        done();
      })
  })
})