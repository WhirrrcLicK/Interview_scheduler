import React from 'react'
import "./styles.scss"

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from "../../hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  
  const { mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => { transition(SHOW) })
    .catch(error => transition(ERROR_SAVE, true))
  }

  const edit = (name, interviewer) => {
    transition(EDIT)
  }

  const deleting = () => {
    transition(CONFIRM)
  }

  const confirmDelete = () => {
    transition(DELETING, true)
    props.cancelInterview(props.id)
        .then(() => { transition(EMPTY) })
        .catch(error => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      { mode === SHOW && (
       <Show
       id={props.id}
       student={props.interview.student}
       interviewer={props.interview.interviewer}
       onDelete={deleting}
       onEdit={edit}
     />
      )}
      { mode === CREATE && (
        <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
        />
      )}
      { mode === EDIT && (
        <Form 
        interviewers={props.interviewers}
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
        onCancel={back}
        onSave={save}
        />
      )}
      { mode === SAVING && (
        <Status message="Saving..."/>
      )}
      { mode === DELETING && (
        <Status message="Deleting..."/>
      )}
      { mode === CONFIRM && (
        <Confirm
        onConfirm={ confirmDelete }
        onCancel={back}
        />
      )}
      { mode === ERROR_DELETE && (
        <Error
        message="Could not complete deleting your appointment"
        onClose={back}
        />
      )}
      { mode === ERROR_SAVE && (
        <Error
        message="There was an error when attempting to save your appointment"
        onClose={back}
        />
      )}
      </article>
  );
}