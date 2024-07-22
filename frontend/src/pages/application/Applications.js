import React, { useEffect, useState } from 'react'
import './Applications.css'
import axios from 'axios'
import Layout from '../../components/layout/Layout'
import toast from 'react-hot-toast'
const Applications = () => {
    useEffect(()=>{
          getApplications();
    },[])
    const[jobs,setJobs] =useState([])
    const auth = JSON.parse(localStorage.getItem('auth'))

    const getApplications = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/apply/job-applications`);
          console.log('API Response:', response.data); // Log API response for debugging
          console.log('Auth User ID:', auth.user.id); // Log auth user ID for debugging
    
          if (response.data.applications.length > 0) {
            const filteredJobs = response.data.applications.filter((job) => {
              // Check if either employerId or userId matches auth.user.id
              return job.employerId === auth.user.id || job.userId === auth.user.id;
            });
    
            if (filteredJobs.length > 0) {
              setJobs(filteredJobs);
              console.log('Filtered Jobs:', filteredJobs);
            } else {
              setJobs([]);
              console.log("No Job Applications Found for this Employer or User");
            }
          } else {
            setJobs([]);
            console.log("No Job Applications Found");
          }
        } catch (error) {
          console.log(error);
        }
      };
      const handleDelete=async(_id)=>{
          const result = await axios.delete(`${process.env.REACT_APP_API}/api/v1/apply//delete-job/${_id}`);
          console.log("Job Application Deleted");
          toast.success("Application Deleted Successfully")
          getApplications();
      }
    

  return (
    <Layout>
        <div className='application'>
             <h1>Applications</h1>
             {jobs.map((job,index)=>(
               <div className='application-box'>
                  <p>Applied For : {job.jobTitle}</p>
                 <p>Name:{job.name}</p>
                 <p>Email:{job.email}</p>
                 <a>Resume:<a href={job.resume} target="_blank">{job.resume}</a></a>
                 <button onClick={() => handleDelete(job._id)}>Delete</button>
               </div>
             ))}
        </div>
    </Layout>
  )
}

export default Applications