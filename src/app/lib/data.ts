import { sql } from '@vercel/postgres';
import {
    User,
} from './definitions';

export async function fetchCustomers() {
    try {
      const data = await sql<User>`
        SELECT
            name,
            email,
            title,
            bio,
            linkedin,
            github,
            location,
            currentlyListening,
            currentlyReading
        FROM customers
        ORDER BY name ASC
      `;
  
      const customers = data.rows;
      return customers;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch all customers.');
    }
}
