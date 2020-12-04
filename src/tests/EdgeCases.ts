
import {
    mutationToDeleteUser,
    queryToFetchUserReadModels,
    mutationToDeleteCustomerById,
    mutationToSaveCustomer,
    queryCustomerById
} from "../config/constants"
  
const testUserCredentialsInput = {
username: "test123@test.com",
password: "_Test123",
role: "Admin",
};
  

const breakSaveUserMutationTestSuite = (
  request,
  ): void => {
  return describe('breaking create user function', () => {
    test("1. It should verify that the user is not currently in the list", 
    async (done) => {
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
    test("2. It should send mutationToSaveNewUser with wrong password format and return error", async (done) => {
      request
      .post('/')
      .send({
        query: `mutation {
        SaveUser(
            input: {
            username: "${testUserCredentialsInput.username}", 
            password: "withoutnumbersnorspecialcharactersnoruppercase", 
            role: "${testUserCredentialsInput.role}"
          }
        )
        }`
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.SaveUser).toBeNull()
        expect(res.body.errors[0].message).toBe("Password does not conform to policy: Password must have uppercase characters")
        done()
      })
    })

    test("3. It should verify that the user is not currently in the list", async (done) => {
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
    test("4. It should send mutationToSaveNewUser with right password format this time", 
    async (done) => {
      request
      .post('/')
      .send({
        query: `mutation {
        SaveUser(
            input: {
            username: "${testUserCredentialsInput.username}", 
            password: "${testUserCredentialsInput.password}", 
            role: "${testUserCredentialsInput.role}"
          }
        )
        }`
      })
      .expect(200)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.errors).toHaveLength(0)
        expect(res.body.data.SaveUser).toEqual(true)
        done()
      })
    })

    test("5. It should delete the user and return true", async (done) => {
      request
      .post('/')
      .send(mutationToDeleteUser(testUserCredentialsInput.username))
      .expect(200)
      .end((err, res) => {
        if(err) return done(err)
        expect(res.body.data.DeleteUser).toEqual(true)
        done()
      })
    })
    test("6. Create New Customer fails by not passing name data", async (done) => {
        request
          .post("/")
          .send({
            query: `mutation {
              SaveCustomer(input: {
                id: "testUserFromEdgeCases"
              })
            }`
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            setTimeout(() => {
              expect(res.body.errors).toHaveLength(1)
              expect(res.body.data.SaveCustomer).toBeNull();
              done();
            }, 500)
          });
      });
      test("7. Test if customer gets a proper photoUrl after being created", 
      async (done) => {
        request
          .post("/")
          .send(queryCustomerById("testUserFromEdgeCases"))
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            setTimeout(() => {
              const responseData = res.body.data.CustomerReadModel;
              expect(responseData.photoUrl).toEqual(`crm-api-dev-app/${responseData.id}/photo.jpg`);
              done();
            }, 500)
          });
      });
      test("8. Delete created user from test 6", async (done) => {
        request
          .post("/")
          .send(mutationToDeleteCustomerById("testUserFromEdgeCases"))
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            setTimeout(() => {
              expect(res.body.data.DeleteCustomer).toBe(true);
              done();
            }, 500)
          });
      });
    })
}

export default breakSaveUserMutationTestSuite;