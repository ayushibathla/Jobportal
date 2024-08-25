import React, { useEffect, useState } from 'react';
import './Applications.css';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const auth = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/apply/job-applications`);
      console.log('API Response:', response.data); // Debugging

      if (!auth || !auth.user) {
        toast.error("User not authenticated");
        return;
      }

      console.log('Auth User ID:', auth.user.id); // Debugging

      if (response.data.applications.length > 0) {
        const filteredJobs = response.data.applications.filter((job) => {
          return job.employerId === auth.user.id || job.userId === auth.user.id;
        });

        if (filteredJobs.length > 0) {
          setJobs(filteredJobs);
          console.log('Filtered Jobs:', filteredJobs); // Debugging
        } else {
          setJobs([]);
          console.log("No Job Applications Found for this Employer or User");
        }
      } else {
        setJobs([]);
        console.log("No Job Applications Found");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/apply/delete-job/${_id}`);
      toast.success("Application Deleted Successfully");
      getApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  return (
    <Layout>
      <div className='application'>
        <h1>Applications</h1>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className='application-box' key={job._id}>
              <p>Applied For: {job.jobTitle}</p>
              <p>Name: {job.name}</p>
              <p>Email: {job.email}</p>
              <p>Resume: <a href={job.resume} target="_blank" rel="noopener noreferrer">{job.resume}</a></p>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No job applications found.</p>
        )}
      </div>
    </Layout>
  );
}

export default Applications;
