import React from "react";
import axios from "axios";

import { 
  render,
  cleanup,
  waitForElement,
  fireEvent,
  queryByText,
  queryByAltText,
  getByPlaceholderText,
  getByDisplayValue,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText
    }
  from "@testing-library/react";

import Application from "components/Application";


describe("Application", () => {
  afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);
  return waitForElement(() => getByText("Monday")).then(() => {
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
});



it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
  const { container, debug } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));
  
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));
  
  fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
    target: { value: "Lydia Miller-Jones" }
  });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
  fireEvent.click(getByText(appointment, "Save"));
  
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
  );

  expect(getByText(day, "no spots remaining")).toBeInTheDocument();
});



it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment")
  .find(appointment => queryByText(appointment, "Archie Cohen"));

  fireEvent.click(queryByAltText(appointment, "Delete"));

  expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

  fireEvent.click(queryByText(appointment, "Confirm"));

  expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

  await waitForElement(() => getByAltText(appointment, "Add"));

  const dayListItem = getAllByTestId(container, "day").find(item => getByText(item, "Monday"));

  expect(getByText(dayListItem, "2 spots remaining")).toBeInTheDocument();

  })



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  const { container, debug } = render(<Application />);
  
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment")
  .find(appointment => queryByText(appointment, "Archie Cohen"));
  
  fireEvent.click(queryByAltText(appointment, "Edit"));
  
  expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

  const interviewerList = getAllByTestId(appointment, "interviewer");
  const interviewers = interviewerList.find(interview => queryByText(interview, "Tori Malcolm"));

  expect(getByText(interviewers, "Tori Malcolm"));

  fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
    target: { value: "Theresa Holmes" }
  });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));
  
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Theresa Holmes"));
  
  expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday"));

  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});



it("shows the save error when failing to save an appointment", async() => {
  axios.put.mockRejectedValueOnce();

  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));
  
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));
  
  fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
    target: { value: "Lydia Miller-Jones" }
  });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
  fireEvent.click(getByText(appointment, "Save"));
  
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "There was an error when attempting to save your appointment"));
})



it("show the delete error when failing to delete an existing appointment", async() => {
  axios.delete.mockRejectedValueOnce();

  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));
  
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[1];

  fireEvent.click(getByAltText(appointment, "Delete"));
  
  expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

  fireEvent.click(getByText(appointment, "Confirm"));

  await waitForElement(() => getByText(appointment, "Could not complete deleting your appointment"));
})
});