# Firestore Rules Deployment Guide

## What Changed
The permission error when reporting fake loads was occurring because the Firestore rules did not have proper permissions for the `loadPostReports` collection. 

**Issues Fixed:**
1. ✅ Users can now create reports in the `loadPostReports` collection
2. ✅ Self-report protection enforced at rule level (cannot report own posts)
3. ✅ Admin-only report moderation 
4. ✅ Better error messages in the UI

## How to Deploy the Rules

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (PickAll)
3. Navigate to **Firestore Database** → **Rules**
4. Open the ***firestore.rules*** file in this project
5. Copy all the content
6. Paste it into the Firebase Console rules editor
7. Click **Publish**

## Rule Breakdown

| Collection | Permission | Details |
|---|---|---|
| `loadPostReports` | Create | Authenticated users can report posts (prevents self-reports) |
| `loadPostReports` | Read | Reporters and admins can view |
| `loadPostReports` | Update/Delete | Admin only |
| `Users` | All | User-owned updates + admin access |
| `users` | All | Fallback collection with same rules |
| Other Public Collections | Read | All authenticated users can read |
| Other Collections | Create | Users can create their own records |

## Admin Email
The system currently recognizes **`logisticspickall@gmail.com`** as admin.
Update this in the rules if needed.

## Testing the Fix

After deploying, test by:
1. Login as a regular user
2. Go to Marketplace
3. Try reporting a fake load post from another user
4. Verify report is submitted successfully
5. Try to report a post you created (should show error: "You cannot report your own load post")

## Troubleshooting

**If reports still fail:**
- Verify the user is authenticated
- Check browser console for specific error messages
- Ensure `loadPostReports` collection exists in Firestore
- Verify admin email is correct in the rules

**If moderation updates fail:**
- This is non-critical (already logged as warning)
- Report is saved successfully even if moderation sync fails
- Admin can manually moderate via AdminPage
