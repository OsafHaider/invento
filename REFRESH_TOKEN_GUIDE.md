# Refresh Token API Guide

## Overview

The Invento application now includes automatic token refresh functionality. This ensures that users stay logged in seamlessly without needing to re-authenticate when their access token expires.

## How It Works

### Token Structure

1. **Access Token**: Short-lived JWT token (15 minutes) used for API requests
2. **Refresh Token**: Long-lived JWT token (7 days) stored securely for obtaining new access tokens

### Automatic Refresh Flow

The client automatically handles token refresh in the following scenarios:

1. **Before API Calls**: Checks if access token is expired
2. **On 401 Responses**: Attempts to refresh token before showing unauthorized error
3. **Transparent to User**: Refresh happens in the background without interrupting user experience

## API Endpoints

### Sign-Up
- **Endpoint**: `POST /api/auth/sign-up`
- **Response**: Returns `accessToken` and `refreshToken` in response body

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "createdAt": "2026-02-13T10:00:00Z",
    "updatedAt": "2026-02-13T10:00:00Z"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Sign-In
- **Endpoint**: `POST /api/auth/sign-in`
- **Response**: Returns `accessToken` and `refreshToken`

```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "createdAt": "2026-02-13T10:00:00Z",
    "updatedAt": "2026-02-13T10:00:00Z",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Method**: POST
- **Content-Type**: application/json

**Request Body**:
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

**Response**:
```json
{
  "accessToken": "new_access_token_here"
}
```

**Status Codes**:
- `200`: Successfully refreshed, new access token returned
- `401`: Invalid or expired refresh token, user needs to re-login

## Client-Side Implementation

### Storage

Tokens are automatically stored in browser's `localStorage`:

```javascript
localStorage.getItem("accessToken")     // Current access token
localStorage.getItem("user")            // User data (includes refreshToken)
```

### Using Auth API

The client provides a centralized `authAPI` module for all authentication operations:

```typescript
// Sign Up
await authAPI.signUp({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "user"
});

// Sign In
await authAPI.signIn({
  email: "john@example.com",
  password: "password123"
});

// Get Profile (automatically handles token refresh)
const response = await authAPI.getProfile();

// Logout
authAPI.logout();

// Manual Refresh (if needed)
const newToken = await refreshAccessToken();
```

### File Location

- **Client Auth API**: `client/lib/auth-api.ts`
- **Product API**: `client/lib/product-api.ts` (uses auth-api for token management)

## Token Expiration

### Access Token
- **TTL**: 15 minutes
- **Used for**: Authorization header in API requests
- **Format**: `Authorization: Bearer <access_token>`

### Refresh Token
- **TTL**: 7 days
- **Used for**: Obtaining new access tokens
- **Storage**: Stored in both localStorage and HTTP-only cookie

## Security Features

1. **HTTP-Only Cookies**: Refresh token stored in secure HTTP-only cookie (server-side)
2. **Token Validation**: Server validates refresh token matches what's stored in database
3. **Automatic Cleanup**: Tokens cleared on logout or failed refresh
4. **Bearer Token Format**: Access tokens sent as `Authorization: Bearer <token>`

## Testing the Refresh Token API

### Using Curl

```bash
# 1. Sign In to get tokens
curl -X POST http://localhost:8080/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response includes accessToken and refreshToken
# Copy the refreshToken value

# 2. Refresh the token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'

# Response includes new accessToken
```

### Using Postman

1. **Sign In Request**:
   - Method: POST
   - URL: `{{BASE_URL}}/api/auth/sign-in`
   - Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - Copy the `refreshToken` from response

2. **Refresh Token Request**:
   - Method: POST
   - URL: `{{BASE_URL}}/api/auth/refresh`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "refreshToken": "paste_the_refresh_token_here"
     }
     ```

## Error Handling

### Invalid Refresh Token
```json
{
  "error": "Invalid refresh token"
}
```
**Action**: Redirect user to sign-in page

### Expired Refresh Token
```json
{
  "error": "Invalid refresh token"
}
```
**Action**: Redirect user to sign-in page

### Server Error
```json
{
  "error": "Token refresh failed"
}
```
**Action**: Retry after delay or show error to user

## Common Issues & Solutions

### Issue: Token not refreshing automatically
**Solution**: Ensure `refreshToken` is properly stored in localStorage after sign-in/sign-up

### Issue: Getting 401 Unauthorized on every request
**Solution**: 
- Check if access token is expired: `isTokenExpired(token)`
- Verify refresh token is valid: `isTokenExpired(refreshToken)`
- Try manual refresh: `await refreshAccessToken()`

### Issue: Redirect loop to sign-in
**Solution**: 
- Clear localStorage: `localStorage.clear()`
- Sign in again with valid credentials
- Check if refresh token is 7+ days old (expires after 7 days)

## Implementation Details

### Token Expiration Check

```typescript
// Check if token is expired (JWT decoding)
const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (e) {
    return true;
  }
};
```

### Automatic Refresh on 401

```typescript
// All API calls check for 401 and attempt refresh
if (response.status === 401) {
  const newToken = await refreshAccessToken();
  if (newToken) {
    // Retry original request with new token
    return retryRequest();
  }
  // Refresh failed, redirect to sign-in
}
```

## Best Practices

1. **Always use authAPI module**: Don't make direct API calls for authentication
2. **Never expose refresh tokens**: Keep them in localStorage/cookies only
3. **Test token expiration**: Set short token TTL in development for testing
4. **Monitor failed refreshes**: Log and monitor when token refresh fails
5. **Clear tokens on logout**: Use `authAPI.logout()` to clear all tokens
6. **HTTPS in production**: Always use HTTPS to protect tokens in transit

## Environment Configuration

No additional environment variables needed for refresh token. The following are already configured:

- `JWT_SECRET`: Secret for signing access tokens
- `JWT_REFRESH_SECRET`: Secret for signing refresh tokens
- `ACCESS_TOKEN_EXPIRY`: 15 minutes (set in code)
- `REFRESH_TOKEN_EXPIRY`: 7 days (set in code)

## API Response Examples

### Successful Refresh
```
Status: 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Failed Refresh (Invalid Token)
```
Status: 401
{
  "error": "Invalid refresh token"
}
```

### Failed Refresh (Server Error)
```
Status: 500
{
  "error": "Token refresh failed"
}
```

## Next Steps

1. Test the refresh token API using Postman or curl
2. Monitor token refresh in browser DevTools (Network tab)
3. Implement custom logging for token refresh events if needed
4. Configure JWT secrets in `.env` file for production

---

**Last Updated**: February 13, 2026  
**API Version**: 1.0
