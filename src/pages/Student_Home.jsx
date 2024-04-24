import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Card, CardContent, Divider, Box }from '@mui/material';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

// Check if courses are available, if not then all buttons are add courses
const Student_Home = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [courses, setCourses] = useState([]); // State to store courses
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const coursesPerPage = 3; // Number of courses per page
    // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchCourses = async () => {
    const response = await fetch(`http://localhost:5005/Home/Student?zID=${params.id}`, {
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

  

  const goCourse = (courseName) => {
    navigate('/Student/Quizzes/'+ courseName+ '/' + params.id)
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
                    </Box>
                  </CardContent>
                <Button variant="contained" color="primary" onClick={() => goCourse(course.title)}>View Details</Button>
              </Card>
            </Grid>
          ))}
          {/* Display add course button if there are less than 3 courses on the page */}
          
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
  
  export default Student_Home;