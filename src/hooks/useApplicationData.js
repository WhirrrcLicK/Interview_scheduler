import { useState, useEffect} from "react";

import "components/Application.scss";
import axios from "axios"

export default function useApplicationData() {

const[state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
});

useEffect(() => {
  const promiseDays = axios.get('api/days');
  const promiseAppointments = axios.get('api/appointments');
  const promiseInterviewers = axios.get('api/interviewers')
  Promise.all([promiseDays, promiseAppointments, promiseInterviewers]).then((all) => {
    setState(prev => ({
      ...prev,
      days: all[0].data,
      appointments: all[1].data,
      interviewers: all[2].data
    }))
  });
}, []);

const setDay = day => setState((prev) => ({ ...prev, day }))

const updateSpots = (newState, appointments, day) => {

const dayObject = newState.days.find(dayObj => dayObj.name === day)
const dayIndex = newState.days.findIndex(dayInd => dayInd.name === day)
  const noAppointments = dayObject.appointments.filter((id) => !appointments[id].interview)
  const spots = noAppointments.length;
  const days = [...state.days]
  days[dayIndex] = {...dayObject, spots}
  return days
  }

const bookInterview = (id, interview) => {
  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

  return axios.put(`api/appointments/${id}`, appointment)
  .then(() => {
    const updatedDays = updateSpots(state, appointments, state.day)
    setState({
      ...state,
      appointments,
      days: updatedDays
    })
  })
}


const cancelInterview = (id) => {
  const appointment = {
    ...state.appointments[id],
    interview: null
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  
  return axios.delete(`api/appointments/${id}`)
  .then(() => {
    const days = updateSpots(state, appointments, state.day)
    setState({
      ...state,
      appointments,
      days
    });
  });
}

return { state, setDay, bookInterview, cancelInterview}
}