import app from "../src/server";
import supertest from "supertest";

const request = supertest(app);

test("fetch UserReadModels", async (done) => {
  request
    .get('/users-info')
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.UserReadModels.length).toEqual(4);
      done();
    });
});