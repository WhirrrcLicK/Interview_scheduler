export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter(days => days.name === day)[0];
  if (!state.days.length || !filteredDay) {
    return []
  }
  return filteredDay.appointments.map((appointmentId) => state.appointments[appointmentId])
}

export function getInterview(state, interview) {
  if (interview) {
  const interviewer = state.interviewers[interview.interviewer];
  return {...interview, interviewer};
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.filter(days => days.name === day)[0];
  if (!state.days.length || !filteredDay) {
    return []
  }
  return filteredDay.interviewers.map((interviewersId) => state.interviewers[interviewersId])
}