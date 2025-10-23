# Profile Page Implementation

## Overview
A comprehensive personal profile page that allows users to update their information and upload/change their avatar.

## Features
- **User Information Management**: Update full name, alias, email, and contact information
- **Avatar Upload**: Upload and change profile pictures with validation
- **NFT Ownership Verification**: Radio button to indicate Nobody NFT ownership
- **Wallet Connection**: Button to connect wallet for NFT verification
- **Voting History**: Display user's voting records
- **Song History**: Display user's song-related activities
- **Responsive Design**: Works on desktop and mobile devices
- **Internationalization**: Supports both English and Chinese

## Files Created

### Pages
- `app/[locale]/profile/page.tsx` - Main profile page component

### Components
- `components/AvatarUpload.tsx` - Reusable avatar upload component

### API Routes
- `app/api/profile/route.ts` - Profile CRUD operations (GET, PUT)
- `app/api/upload-avatar/route.ts` - Avatar upload endpoint

### Translations
- Added Profile section to `messages/en.json`
- Added Profile section to `messages/zh.json`

### Directory Structure
- `public/uploads/avatars/` - Directory for storing uploaded avatar images

## Usage

### Accessing the Profile Page
Navigate to `/profile` (or `/zh/profile` for Chinese) to access the profile page.

### Profile Management
1. **View Profile**: The page loads existing user data from localStorage or API
2. **Update Information**: Modify any field and click "Save Profile"
3. **Upload Avatar**: Click "Change Avatar" to upload a new profile picture
4. **Connect Wallet**: Use the "Connect Wallet" button to verify NFT ownership

### API Integration
The profile page integrates with a third-party API for:
- Fetching user profile data
- Updating user information
- Storing avatar URLs

### File Upload
- Supported formats: All image types
- Maximum file size: 5MB
- Files are stored in `public/uploads/avatars/`
- Unique filenames prevent conflicts

## Technical Details

### Authentication
- Uses JWT tokens stored in localStorage
- Token is sent in Authorization header for API calls

### Form Validation
- Email format validation
- File type and size validation for avatars
- Required field validation

### Error Handling
- Toast notifications for success/error messages
- Graceful fallback to localStorage data
- Proper error states and loading indicators

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements

## Future Enhancements
- Real-time form validation
- Image cropping/resizing before upload
- Social media integration
- Advanced profile customization options
- Profile privacy settings
