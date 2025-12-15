## Result Processing System

- Users:
1. Admin
2. Teacher
3. Student

### Ideas yet to implement:
- Add Table to store teachers personal data eg: address, mobile number picture, which department they belong and add address mobile number and picture fields in current students table
- Store users images
- generated results pdfs
- Add group chat system that automatically adds the students and teachers of a department in a group to share resources (based on session)
- Add a Publish/Unpublish field in Marks table


## ADMIN PORTAL:
- Dashboard: See Overview of all the data. Cards- Total student, Total Teachers, Total Departments, recent activities-marks added, user created(logs)
- Department: Create/Update department and Semester
- Add Subject: Create/update subjects
- Assign Subject: Assign subjects to teachers (subject offerings) 
- Create User: register new user. Fill students data and teachers data also in this page.
- All User: A Page to see all users with a student/teacher/admin filter. There will be an edit button that will open a modal with a form to edit that user’s data.
- Add Marks: Insert marks
- Results: see all students results with filtering, department-wise results. There will be a button to generate pdf. A page to see full student details with the results
Create chats: will be added in future


TEACHER PORTAL:
Dashboard: See total assigned subjects and personal information
My Subjects: List of the teachers assigned subjects, semester/session filters
Add Marks: Show student list with an add mark button. The button will open a modal form to insert the marks for that student. Filter students usng session, semester and student search by registraton
Result: see department wise result of all students of his department with filtering (department id + session + semester id). There will be a button to generate pdf. A page to see full student details with the results
Chats: will be added in future



STUDENT PORTAL:
Dashboard: Personal Information, data from student table and average CGPA up to current semester
Subjects: Show Semester wise subject list or Subject list with assigned teacher
Results: Semester wise result with pdf download option
Chats: will be added in future

Public Pages:
Notice: Publish notices as PDFs or Images- its backend will be implemented later
Contact: Email, phone numbers to contact. 
Faculties: List of all teachers with their phone numbers and department name to contact