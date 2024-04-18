import request from 'supertest';
import app from './index'; // Import your express app
import jwt from 'jsonwebtoken';
import { CoachModel } from './schemas/coach'; // Assuming this path is correct

// Mocking database operations
jest.mock('./schemas/coach');

// Define a mock for findById for CoachModel
(CoachModel.findById as jest.Mock).mockImplementation((id: string) => {
  if (id === "1") {
    return Promise.resolve({ name: "John Doe", email: "john@example.com", isAdmin: true });
  } else if (id === "2") {
    return Promise.resolve({ name: "Jane Doe", email: "jane@example.com", isAdmin: false });
  } else if (id === "66217493239eb43b37bce54c") {
    return Promise.resolve({ _id: '66217493239eb43b37bce54c', name: 'Melissa Warner', email: 'yolanda80@example.com', isAdmin: false });
  } else {
    return Promise.resolve(null);
  }
});

// a test secret key, NOT the admin secret
const testSecretKey = 'my_test_secret_key';

const melissaToken = jwt.sign({
  sub: '66217493239eb43b37bce54c', // mellisa coach ID
  email: 'yolanda80@example.com',
  isAdmin: false,
}, testSecretKey, { expiresIn: '1h' });

describe('Authorization Tests', () => {
  it('should deny Melissa Warner access to an admin-only route', async () => {
    // '/api/coaches' POST is an admin-only operation
    const response = await request(app)
      .post('/api/coaches')
      .set('Authorization', `Bearer ${melissaToken}`)
      .send({ name: "Test Coach", email: "testcoach@example.com" });

    expect(response.status).toBe(401); // Expecting unauthorized status because she is not an admin
  });

  it('should not allow Melissa Warner to delete cases', async () => {
    // Assume '/api/cases' DELETE is an admin-only operation
    const response = await request(app)
      .delete('/api/cases')
      .set('Authorization', `Bearer ${melissaToken}`)
      .send({ caseId: "some-case-id" });

    expect(response.status).toBe(401); // Expecting unauthorized status
  });

  it('should allow Coach Melissa Warner to access her assigned case', async () => {
    // caseId '66217493239eb43b37bce583' is assigned to melissa
    const response = await request(app)
      .get('/api/cases/66217493239eb43b37bce583')
      .set('Authorization', `Bearer ${melissaToken}`);

    expect(response.status).toBe(200); // successful
  });

  it('should prevent Coach Melissa Warner from accessing cases not assigned to her', async () => {
    // mellisa does not have access to caseId '66217493239eb43b37bce552'
    const response = await request(app)
      .get('/api/cases/66217493239eb43b37bce552')
      .set('Authorization', `Bearer ${melissaToken}`);

    expect(response.status).toBe(403); // Forbidden access
  });
});



