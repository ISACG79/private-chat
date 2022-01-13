const request = require("supertest");
const {
	app,
	server,
	db,
	dbConnection,
	getDbMessages
} = require("./server.js");


describe('jest-junit', () => {
	describe('positive numbers', () => {
		it('should add up', () => {
			expect(1 + 2).toBe(3);
		});
	});
});

test("GET / method statusCode should be 200", done => {
	request(app)
		.get("/")
		.then(response => {
			expect(response.statusCode).toBe(200);
			done();
		});
});

test("GET /database statusCode should be 200", done => {
	request(app)
		.get("/database")
		.then(response => {
			expect(response.statusCode).toBe(200);
			done();
		});
});

test('Check if database is connected', done => {
	function callback(data) {
		expect(data).toBe(true);
		done();
	}

	dbConnection(callback);
});


afterAll(() => {
	db.end();
	server.close();
});
