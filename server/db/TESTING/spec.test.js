const { Product, initTest } = require("./testdb");
const app = require("./app");
const request = require("supertest");

const addTwo = (numOne, numTwo) => {
  return numOne + numTwo;
};

describe("GraceShopper Tests", () => {
  describe("random test", () => {
    it("Adds Two Numbers", () => {
      expect(addTwo(1, 2)).toBe(3);
    });
  });
  let seedData;
  describe("Product Model", () => {
    it("is truthy", async () => {
      const productTwo = await Product.create({
        name: "Huggies",
        description: "this diaper absorbs everything!!",
        price: 12.99,
        size: "medium",
        inventory: 20,
        status: "active",
      });

      expect(productTwo.name).toBe("Huggies");
    });
    it("seeds data properly", async () => {
      seedData = await initTest();
      expect(seedData.productArr.length).toBe(3);
    });
  });
  describe("Product Routes and User Route", () => {
    describe("GET route for all products", () => {
      it("Gets all products", async () => {
        const res = await request(app).get("/api/products");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
      });
    });
    describe("GET route for all Users", () => {
      it("Gets all users", async () => {
        const res = await request(app).get("/api/users");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(4);
      });
    });
    describe("GET route for single User", () => {
      it("Gets a single user", async () => {
        seedData = await initTest();
        const res = await request(app).get(
          `/api/users/${seedData.usersArr[0].id}`
        );
        expect(res.status).toBe(200);
      });
    });
    describe("GET route for single Product", () => {
      it("Gets a single product", async () => {
        seedData = await initTest();
        const res = await request(app).get(
          `/api/products/${seedData.productArr[0].id}`
        );
        expect(res.status).toBe(200);
      });
    });
  });
});
