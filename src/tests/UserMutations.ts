import {
  mutationToSaveNewUser,
  mutationToChangeUserRole,
  mutationToDeleteUser,
  queryToFetchUserReadModels,
  queryToFetchSingleUserReadModel,
} from "../config/constants";

const testUserCredentialsInput = {
  username: "test123@test.com",
  password: "_Test123",
  role: "Admin",
};

const userMutationsTestSuite = (request): void => {
  return describe("test user CRUD", () => {
    
    test("verify that the user is not currently in the list", 
    async (done) => {
      request
        .post("/")
        .send(queryToFetchUserReadModels)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.UserReadModels).not.toContainEqual({
            id: testUserCredentialsInput.username,
            role: testUserCredentialsInput.role,
          });
          done();
        });
    });

    test("send mutationToSaveNewUser and return true", 
    async (done) => {
      request
        .post("/")
        .send(mutationToSaveNewUser(testUserCredentialsInput))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.SaveUser).toEqual(true);
          done();
        });
    });

    test("send the same mutationToSaveNewUser and return error for user already existing", 
    async (done) => {
      request
        .post("/")
        .send(mutationToSaveNewUser(testUserCredentialsInput))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.SaveUser).toBeNull();
          expect(res.body.errors[0].message).toBe(
            "An account with the given email already exists."
          );
          done();
        });
    });

    test("verify that the user created was saved and exists in the list", 
    async (done) => {
      request
        .post("/")
        .send(queryToFetchUserReadModels)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.UserReadModels).toBeInstanceOf(Array);
          expect(res.body.data.UserReadModels).toContainEqual({
            id: testUserCredentialsInput.username,
            role: testUserCredentialsInput.role,
          });
          done();
        });
    });

    test("send the mutation to change user role and return true", 
    async (done) => {
      request
        .post("/")
        .send(mutationToChangeUserRole(testUserCredentialsInput.username))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.ChangeUserRole).toEqual(true);
          done();
        });
    });

    test("verify that the user has a different role by querying for a single user",
    async (done) => {
      request
        .post("/")
        .send(
          queryToFetchSingleUserReadModel(testUserCredentialsInput.username)
        )
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.UserReadModel.id).toEqual(
            testUserCredentialsInput.username
          );
          expect(res.body.data.UserReadModel.role).toEqual("User");
          done();
        });
    });

    test("verify that the user has a different role", async (done) => {
      request
        .post("/")
        .send(queryToFetchUserReadModels)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.data.UserReadModels).toBeInstanceOf(Array);
          expect(res.body.data.UserReadModels).toContainEqual({
            id: testUserCredentialsInput.username,
            role: "User",
          });
          done();
        });
    });

    test("delete the user and return true", async (done) => {
      request
        .post("/")
        .send(mutationToDeleteUser(testUserCredentialsInput.username))
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.DeleteUser).toEqual(true);
          done();
        });
    });

    test("verify that the user was deleted in fact", async (done) => {
      request
        .post("/")
        .send(queryToFetchUserReadModels)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.UserReadModels).not.toContainEqual({
            id: testUserCredentialsInput.username,
            role: testUserCredentialsInput.role,
          });
          done();
        });
    });
  });
};

export default userMutationsTestSuite;
