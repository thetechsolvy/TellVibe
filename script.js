// Import the Firebase modules you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj-3oMIyfvpqUBJMoYa_IzwKXh5yR0G-A",
  authDomain: "getdet-6965b.firebaseapp.com",
  projectId: "getdet-6965b",
  storageBucket: "getdet-6965b.appspot.com",
  messagingSenderId: "394828959439",
  appId: "1:394828959439:web:b3ca32fda12df2e2b731ba",
  measurementId: "G-CFMMWFEQGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const contentContainer = document.getElementById('content-container');
const loginContainer = document.getElementById('login-container');
const surveyForm = document.getElementById('survey-form');
const commentForm = document.getElementById('comment-form');
const commentText = document.getElementById('comment-text');
const studyMethodSelect = document.getElementById('study-method'); // Drop-down select element

// Login Functionality
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    // Sign in with email and password
    await signInWithEmailAndPassword(auth, email, password);
    
    // Hide login and show content
    loginContainer.style.display = 'none';
    contentContainer.style.display = 'block';
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Survey Form Handling
surveyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedOption = studyMethodSelect.value; // Get the selected value from drop-down
  const userId = auth.currentUser.uid;

  if (selectedOption === "") {
    alert("Please select an option before submitting.");
    return;
  }

  try {
    // Save the survey response to Firestore
    await setDoc(doc(db, 'surveyResponses', crypto.randomUUID()), {
      userId: userId,
      response: selectedOption,
      timestamp: serverTimestamp()
    });
    alert("Thank you for your feedback!");
    surveyForm.reset();
  } catch (error) {
    alert("Submission failed: " + error.message);
  }
});

// Comment Form Handling
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = auth.currentUser.uid; // Get the logged-in user's ID
  const comment = commentText.value; // Get the comment text

  try {
    // Save the comment to Firestore
    await setDoc(doc(db, 'comments', crypto.randomUUID()), {
      userId: userId,
      comment: comment,
      timestamp: serverTimestamp()
    });
    alert("Comment added successfully!");
    commentText.value = ""; // Clear the textarea

  } catch (error) {
    alert("Failed to add comment: " + error.message);
  }
});
//forcefully refresh 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Session ko monitor karna aur refresh karna
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in hai:", user.email);
    loginContainer.style.display = 'none';
    contentContainer.style.display = 'block';

    // Token ko refresh karna agar expire hone wala ho
    user.getIdToken(true)  // Forcefully refresh token
      .then((idToken) => {
        console.log("Token refreshed: ", idToken);
      })
      .catch((error) => {
        console.log("Token refresh error:", error);
      });
  } else {
    console.log("Koi user login nahi hai");
    loginContainer.style.display = 'block';
    contentContainer.style.display = 'none';
  }
});
