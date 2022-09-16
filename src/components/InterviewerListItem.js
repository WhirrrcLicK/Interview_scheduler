import React from "react";
import classNames from "classnames";
import "./InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  const interviewerClass = classNames("interviewers__item", {"interviewers__item--selected": props.selected
});
  const interviewerImgClass = classNames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  });

  return (
<li className={interviewerClass} onClick={props.setInterviewer} data-testid="interviewer">
  <img
    className={interviewerImgClass}
    src={props.avatar}
    alt={props.name}
  />
  {props.selected && props.name}
</li>
  );
}