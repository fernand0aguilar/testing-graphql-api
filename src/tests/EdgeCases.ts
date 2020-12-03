
import {
    mutationToDeleteUser,
    queryToFetchUserReadModels,
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
    test("It should verify that the user is not currently in the list", 
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
    test("It should send mutationToSaveNewUser with wrong password format and return error", async (done) => {
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
    test("It should send mutationToSaveNewUser with right password format this time", 
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

    test("It should delete the user and return true", async (done) => {
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
  })
}

export default breakSaveUserMutationTestSuite;