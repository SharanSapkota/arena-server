# Arena - Social Platform API

A social platform API built with Express.js and TypeScript where users can create arenas, follow others, and engage in discussions.

## Features

- User authentication and authorization
- Social account verification (Twitter, LinkedIn)
- Create and manage arenas
- Invite users to arenas
- Real-time chat in arenas
- Payment integration for arena entry
- Public comments on arenas

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account (for payments)
- Twitter API credentials (for social verification)
- LinkedIn API credentials (for social verification)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arena-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/arena
JWT_SECRET=your_jwt_secret_key
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-social` - Verify social account

### Arenas

- `GET /api/arenas` - Get all arenas
- `GET /api/arenas/:id` - Get single arena
- `POST /api/arenas` - Create new arena
- `PUT /api/arenas/:id` - Update arena
- `DELETE /api/arenas/:id` - Delete arena
- `POST /api/arenas/:id/invite` - Invite user to arena
- `POST /api/arenas/:id/join` - Join arena
- `POST /api/arenas/:id/leave` - Leave arena
- `POST /api/arenas/:id/comments` - Add comment to arena
- `GET /api/arenas/:id/comments` - Get arena comments

### Payments

- `POST /api/payments/create` - Create payment intent
- `POST /api/payments/verify` - Verify payment

## WebSocket Events

- `join_arena` - Join arena chat room
- `leave_arena` - Leave arena chat room

## Error Handling

The API uses a centralized error handling mechanism. All errors are returned in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- Rate limiting (to be implemented)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 