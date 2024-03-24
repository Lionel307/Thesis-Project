import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Card, CardContent, Divider, Box }from '@mui/material';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

// Check if courses are available, if not then all buttons are add courses
const Admin_Home = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [courses, setCourses] = useState([]); // State to store courses
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const coursesPerPage = 3; // Number of courses per page

  const fetchCourses = async () => {
    // Fetch courses from the database or API
    // Update the courses state with the fetched data
    const response = await fetch(`http://localhost:5005/Home/Admin?zID=${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setCourses(data.courses);

    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const goAddCourse = () => {
    navigate('/Course/New/' + params.id)
  }
  const goCourse = (courseName) => {
    navigate('/Course/'+ courseName+ '/' + params.id)
  }
  // Function to handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
   // Calculate index of the first and last course on the current page
   const indexOfLastCourse = currentPage * coursesPerPage;
   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
   const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" height="100vh">
        <Grid container spacing={4} justifyContent="center">
          {/* Display courses for the current page */}
          {currentCourses.map((course) => (
            <Grid item xs={12} sm={6} md={3} lg={2} key={course.id} >
              {/* Display course information */}
              <Card variant="outlined" sx={{ height: '100%', boxShadow: '0px 3px 6px #00000029' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{course.title}</Typography>
                  <Divider />
                  <Box mt={2}>
                    <Typography variant="body1">Max Students: {course.maxStudents}</Typography>
                    <Typography variant="body2">Number of Students: {course.students.length}</Typography>
                  </Box>
                </CardContent>
                <Button variant="contained" color="primary" onClick={() => goCourse(course.title)}>View Details</Button>
              </Card>
            </Grid>
          ))}
          {/* Display add course button if there are less than 3 courses on the page */}
          {currentCourses.length < coursesPerPage && (
            <Grid item>
              <Button variant="contained" color="primary" size="large" endIcon="+" onClick={goAddCourse}>
                <Typography variant="h6">Add Course</Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      {/* Pagination controls */}
      <div>
        {/* Previous page button */}
        <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
        {/* Display page numbers */}
        {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => i + 1).map((page) => (
          <Button key={page} onClick={() => handlePageChange(page)}>{page}</Button>
        ))}
        {/* Next page button */}
        <Button disabled={indexOfLastCourse >= courses.length} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
  }
  
  export default Admin_Home;