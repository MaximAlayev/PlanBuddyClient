import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import './RestarauntListBox.css'
import RestarauntListBox from './RestarauntListBox'

const RestarauntPoll = (props) => {
  return (
    <>
      <BrowserRouter>
        <Route path = {"/"} exact
        render={(props) => (
          <RestarauntListBox {...props} usingLink={false} />
        )}/>
        <Route path = {"/:id"}
        render={(props) => (
          <RestarauntListBox {...props} usingLink={true} />
        )}/>
      </BrowserRouter>
    </>
  );
};

export default RestarauntPoll;
