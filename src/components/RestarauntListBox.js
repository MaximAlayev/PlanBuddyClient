import React, { useEffect, useState } from "react";
import { Button, Form, Col } from 'react-bootstrap';
import Axios from 'axios';
import Fade from 'react-reveal/Fade';
import './RestarauntListBox.css'

const RestarauntListBox = (props) => {
  const [pollId, setPollId] = useState();
  const [restarauntList, setRestarauntList] = useState([]);
  const [upvoteDict, setUpvoteDict] = useState({});
  const [addPrompt, setAddPrompt] = useState(false);

  useEffect(() => {
    // Eventually ensure that this id is unique otherwise people screw over eachother's polls
    var sessions_poll_id = Math.random().toString(36).substr(2, 9)
    if (props.usingLink) {
      sessions_poll_id = props.match.params.id
    }
    setPollId(sessions_poll_id)
    //http://localhost:5000
    Axios.get(`https://main.dsm8um9dc0du4.amplifyapp.com/api/get-restaraunt-list/${sessions_poll_id}`)
    .then((response) => {
      console.log(response.data)
      setRestarauntList(response.data)
      setUpvoteDict((upvoteDict) => {
        for (var name of response.data) {
          upvoteDict[name[0]] = false
        }
        return (upvoteDict)
      })
    })
    .catch((err) => {
        console.log(err)})
  }, []);

  const updateRestarauntList = () => {
    Axios.get(`https://main.dsm8um9dc0du4.amplifyapp.com/api/get-restaraunt-list/${pollId}`)
    .then((response) => {
      console.log(upvoteDict)
      console.log(response.data)
      setRestarauntList(response.data)
    })
    .catch((err) => {
        console.log(err)
    })
  };


  const addNewRestaraunt = (restarauntName) => {
    Axios.post(`https://main.dsm8um9dc0du4.amplifyapp.com/api/add-restaraunt/`, {
      pollId: pollId,
      restarauntName: restarauntName
    })
    .then((response) => {
      updateRestarauntList()
      setUpvoteDict((upvoteDict) => {
        upvoteDict[restarauntName] = false
        return (upvoteDict)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  };

  const upvoteRestaraunt = (restarauntName) => {
    Axios.post(`https://main.dsm8um9dc0du4.amplifyapp.com/api/upvote-restaraunt/`, {
      pollId: pollId,
      restarauntName: restarauntName
    })
    .then((response) => {
      updateRestarauntList()
      setUpvoteDict((upvoteDict) => {
        upvoteDict[restarauntName] = true
        return (upvoteDict)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  };

  const downvoteRestaraunt = (restarauntName) => {
    Axios.post(`https://main.dsm8um9dc0du4.amplifyapp.com/api/downvote-restaraunt/`, {
      pollId: pollId,
      restarauntName: restarauntName
    })
    .then((response) => {
      updateRestarauntList()
      setUpvoteDict((upvoteDict) => {
        upvoteDict[restarauntName] = false
        return (upvoteDict)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  };

  function AddRestaraunt() {
    if (!addPrompt) {
      return (
        <Button style={{margin: "2rem"}} className = "unvote-btn" onClick = {() => {setAddPrompt(true)}}>
          Add a new one
        </Button>
      )
    } else {
      var newLocationName = "";
      return (
        <Fade bottom when={addPrompt}>
            <h1>Add a New Option</h1>
            <Form.Row style = {{margin: "3rem"}}className="align-items-center">
                <Form.Label>Location Name</Form.Label>
                <Form.Control type="locationname" placeholder="Enter Location Name"
                onChange={(e)=>{newLocationName = e.target.value}}/>
            </Form.Row>
            <Button className="unvote-btn" onClick = { () => {
              if (newLocationName != '') {
                addNewRestaraunt(newLocationName)
                setUpvoteDict((upvoteDict) => {
                  upvoteDict[newLocationName] = true
                  return (upvoteDict)
                })
              }
                setAddPrompt(false)
            }}>
              Submit
            </Button>
        </Fade>
      )
    }
  }

  function AddSpecialRestaraunt() {
    var newLocationName = "";
    return (
      <>
        <Fade clear appear when={!addPrompt} collapse>
          <Button style={{margin: "2rem"}} className = "unvote-btn" onClick = {() => {setAddPrompt(true)}}>
            Add a new one
          </Button>
        </Fade>
        <Fade bottom appear when={addPrompt} collapse>
            <h1>Add a New Option</h1>
            <Form.Row style = {{margin: "3rem"}} className="align-items-center">
                <Form.Label>Location Name</Form.Label>
                <Form.Control type="locationname" placeholder="Enter Location Name"
                onChange={(e)=>{newLocationName = e.target.value}}/>
            </Form.Row>
            <Button style = {{margin: "1rem"}} className="unvote-btn" onClick = { () => {
              if (newLocationName != '') {
                addNewRestaraunt(newLocationName)
                setUpvoteDict((upvoteDict) => {
                  upvoteDict[newLocationName] = true
                  return (upvoteDict)
                })
              }
                setAddPrompt(false)
            }}>
              Submit
            </Button>
        </Fade>
      </>
    )
  }

  return (
    <>
        <div className="card-body list-wrapper">
        <a>localhost:3000/{pollId}</a>
        <ul>
          <Form style={{margin: "2rem"}}>
            {restarauntList.map((value) => {
              return (
                <Fade bottom>
                  <Form.Row>
                    <Col xs={8} className="restaraunt-text">
                      {value[0]}
                    </Col>
                    <Col className="mb-2">
                      <Button variant="primary"
                      style={{margin: ".3 rem"}}
                      className = {!upvoteDict[value[0]] ? "unvote-btn" : ""}
                      onClick = {() => {
                        !upvoteDict[value[0]] ? upvoteRestaraunt(value[0]) : downvoteRestaraunt(value[0])
                      }}>
                        Upvotes: {value[1]}
                      </Button>
                    </Col>
                  </Form.Row>
                </Fade>
              )
            })}
          </Form>
          <AddSpecialRestaraunt/>
        </ul>
        </div>

    </>
  );
};

export default RestarauntListBox;
