import {
  mutationToSaveCustomer, 
  queryCustomerById, 
  queryToFetchCustomerReadModels,
  mutationToDeleteCustomerById
} from "../config/constants";

import { ClientAuthCredentialsType, CustomerDataType } from "../config/types";

const customerData: CustomerDataType = {
  id: "teste@teste.com",
  name: "First",
  surname: "Last",
  photoUrl: `crm-api-dev-app/teste@teste.com/photo.jpg`
};
const newCustomerData: CustomerDataType = {
  id: customerData.id,
  name: "newFirstName",
  surname: "newSurname",
};

const customerMutationsTestSuite = (
  request,
  clientAuthCredentials: ClientAuthCredentialsType
): void => {
  return describe("test customer CRUD", () => {
    test("Check if CustomerReadModels is empty", async (done) => {
      request
        .post("/")
        .send(queryToFetchCustomerReadModels)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const data = res.body.data.CustomerReadModels;
          expect(data).toBeInstanceOf(Array);
          expect(data).toHaveLength(0);
          done();
        });
    });

    test("Create New Customer", async (done) => {
      request
        .post("/")
        .send(mutationToSaveCustomer(customerData))
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          setTimeout(() => {
            expect(res.body.data.SaveCustomer).toBe(true);
            done();
          }, 500);
        });
    });

    test("Check if user was created, exists in CustomerReadModels, and contains reference to who created it", 
    async (done) => {
      request
        .post("/")
        .send(queryToFetchCustomerReadModels)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          setTimeout(() => {
            const data = res.body.data.CustomerReadModels;
            expect(data).toBeInstanceOf(Array);
            expect(data).toContainEqual({
              id: customerData.id,
              name: customerData.name,
              surname: customerData.surname,
              photoUrl: customerData.photoUrl,
              userId: clientAuthCredentials.username,
            });
            done();
          }, 500)
        });
    });

    test("Update previously created user by changing the name and surname", 
    async (done) => {
      request
        .post("/")
        .send(mutationToSaveCustomer(newCustomerData))
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          setTimeout(() => {
            expect(res.body.data.SaveCustomer).toBe(true);
            done();
          }, 300);
        });
    });

    test("query single user by id and check if the user was indeed updated and still maintains userId reference", 
    async (done) => {
      request
        .post("/")
        .send(queryCustomerById(newCustomerData.id))
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          setTimeout(() => {
            const responseData = res.body.data.CustomerReadModel;
            expect(responseData.id).toEqual(newCustomerData.id);
            expect(responseData.name).toEqual(newCustomerData.name);
            expect(responseData.surname).toEqual(newCustomerData.surname);
            expect(responseData.userId).toEqual(clientAuthCredentials.username);
            done();
          }, 500)
        });
    });
    test("Delete User by passing its id", 
    async (done) => {
      request
        .post("/")
        .send(mutationToDeleteCustomerById(customerData.id))
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.DeleteCustomer).toBe(true);
          setTimeout(done, 1000)
        });
    });
    test("Check if CustomerReadModels is empty", 
    async (done) => {
      request
        .post("/")
        .send(queryToFetchCustomerReadModels)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const data = res.body.data.CustomerReadModels;
          expect(data).toBeInstanceOf(Array);
          expect(data).toHaveLength(0);
          done()
        });
    });
  });
};

export default customerMutationsTestSuite;
