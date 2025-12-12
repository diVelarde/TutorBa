# TutorBa

A full-stack tutoring platform that connects students with tutors. TutorBa enables seamless session booking, real-time messaging, file sharing, and community discussions.

## Features

- **Tutor Discovery** - Browse and filter tutors by subject, availability, and ratings
- **Session Booking** - Schedule tutoring sessions with real-time availability checking
- **Real-time Chat** - Instant messaging between students and tutors
- **File Sharing** - Share educational materials and resources during sessions
- **Forum** - Community discussion board for Q&A and peer learning
- **Ratings & Reviews** - Leave feedback and ratings after completed sessions
- **Favorites** - Save favorite tutors for quick access
- **User Profiles** - Comprehensive tutor and student profiles with ratings
- **Session Management** - Track active, pending, and completed sessions

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **Mongoose** for ODM
- **Cloudinary** for file uploads
- **bcryptjs** for password encryption
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Bootstrap 5** with React-Bootstrap for UI components
- **React Icons** for icon library
- **date-fns** for date utilities
- **Lucide React** for additional icons

## Project Structure

```
TutorBa/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS stylesheets
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── controllers/              # Request handlers
│   ├── tutorController.js
│   ├── profileController.js
│   ├── forumController.js
│   ├── favoriteController.js
│   └── uploadController.js
│
├── routes/                  # API endpoints
│   ├── tutorRoutes.js
│   ├── profileRoutes.js
│   ├── forumRoutes.js
│   ├── sessionRoutes.js
│   ├── uploadRoutes.js
│   └── ...
│
├── models/                  # MongoDB schemas
│   ├── Tutor.js
│   ├── TutorProfile.js
│   ├── StudentProfile.js
│   ├── session.js
│   ├── ForumPost.js
│   ├── Comment.js
│   ├── message.js
│   ├── review.js
│   ├── Favorite.js
│   ├── tutorAvailability.js
│   ├── tutorRating.js
│   └── File.js
│
├── middleware/              # Express middleware
│   ├── authMiddleware.js
│   ├── validators.js        # Input validation middleware
│   ├── reviewChecks.js      # Review validation
│   └── scheduling.js        # Session scheduling logic
│
├── services/                # Business logic
│   ├── tutorService.js
│   ├── profileService.js
│   ├── forumService.js
│   └── ...
│
├── validators/              # Data validation schemas
│   ├── tutorValidator.js
│   ├── studentProfileValidator.js
│   └── ...
│
├── config/                  # Configuration files
│   ├── database.js
│   └── cloudinary.js
│
├── server.js                # Express server entry point
├── package.json
└── Login.html               # Login page
```

## Database Schema (Entities & Attributes)

### Core Entities

**Tutor**
- name, department, subject, rating, profileImage
- availability: [{ day, startTime, endTime }]

**TutorProfile**
- userId, bio, subjectsTaught[], experience, education, profileImage, rating

**StudentProfile**
- userId, bio, interests[], yearLevel, profileImage

**Session**
- tutor_id, student_id, date, time, location
- status (pending, confirmed, cancelled, completed)
- statusHistory[], createdAt, updatedAt

**ForumPost**
- title, content, author, subject, upvotes, downvotes, createdAt

**Comment**
- postId, author, content, createdAt

**Favorite**
- studentId, tutorId, createdAt

**Message**
- sender_id, receiver_id, content, timestamp, read
- attachments: [{ filename, originalname, path, url, mimetype, size }]

**Review**
- student_id, tutor_id, session_id, rating (1-5), comment
- createdAt, updatedAt

**TutorAvailability**
- tutor_id, slots: [{ day (0-6), start, end }], updatedAt

**TutorRating**
- tutor_id, averageRating, reviewCount, updatedAt

**File**
- fileName, fileType, fileUrl, uploader, createdAt

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/diVelarde/TutorBa.git
cd TutorBa
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with required variables
```env
MONGODB_URI=mongodb://localhost:27017/tutorba
PORT=5000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

4. Start the backend server
```bash
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

### Tutor Routes
- `GET /api/tutors` - Get all tutors
- `GET /api/tutors/:id` - Get tutor details
- `POST /api/tutors` - Create tutor profile
- `PUT /api/tutors/:id` - Update tutor profile

### Session Routes
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id` - Update session status
- `GET /api/sessions/student/:studentId` - Get student's sessions
- `GET /api/sessions/tutor/:tutorId` - Get tutor's sessions

### Forum Routes
- `GET /api/forum` - Get all posts
- `POST /api/forum` - Create new post
- `GET /api/forum/:postId` - Get post details
- `POST /api/forum/:postId/comments` - Add comment
- `DELETE /api/forum/:postId` - Delete post

### Favorite Routes
- `GET /api/favorites/:studentId` - Get student's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:favoriteId` - Remove from favorites

### Upload Routes
- `POST /api/upload` - Upload file to Cloudinary

## Key Features Implementation

### Session Scheduling
- Validates tutor availability against booked sessions
- Checks for time conflicts with other students
- Prevents overlapping sessions
- Supports status tracking: pending → confirmed → completed/cancelled

### Review System
- One review per session per student
- Automatic average rating calculation
- Real-time tutor rating updates
- Comment length validation (10-500 chars)

### File Sharing
- Drag-and-drop file upload
- Integration with Cloudinary
- Support for multiple file types
- Secure file URL storage

### Real-time Chat
- Message history between tutors and students
- Read status tracking
- File attachment support in messages

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
cd frontend
npm run build
```

### Linting
```bash
cd frontend
npm run lint
```

## Environment Variables

Backend (`root` directory):
```env
MONGODB_URI          # MongoDB connection string
PORT                 # Server port (default: 5000)
CLOUDINARY_NAME      # Cloudinary account name
CLOUDINARY_API_KEY   # Cloudinary API key
CLOUDINARY_API_SECRET # Cloudinary API secret
JWT_SECRET           # JWT signing secret
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email [support email] or open an issue on GitHub.

## Authors

- Despi
- Esmabe
- Palomania
- Raposa
- Velarde

## Acknowledgments

- Bootstrap for UI components
- Cloudinary for file hosting
- MongoDB for database
- React community for excellent documentation
