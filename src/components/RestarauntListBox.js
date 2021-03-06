import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import Fade from 'react-reveal/Fade';
import './RestarauntListBox.css'

//const API_ID = 'http://localhost:5000'
const API_ID = 'https://plan-buddy.herokuapp.com'

const RestarauntListBox = (props) => {
  const [pollId, setPollId] = useState('');
  const [userId, setUserId] = useState('');
  const [restarauntList, setRestarauntList] = useState([]);
  const [upvoteDict, setUpvoteDict] = useState({});
  const [addPrompt, setAddPrompt] = useState(false);

  useEffect(() => {
    if (document.cookie === '') {
      document.cookie = `user_id=${Math.random().toString(36).substr(2, 9)}`
    }
    console.log(document.cookie)
    // Eventually ensure that this id is unique otherwise people screw over eachother's polls
    var sessions_poll_id = Math.random().toString(36).substr(2, 9)
    if (props.usingLink) {
      sessions_poll_id = props.match.params.id
    }
    var tempUserId = document.cookie.split('; ').find(row => row.startsWith('user_id=')).split('=')[1]
    setUserId(tempUserId)
    setPollId(sessions_poll_id)

    //https://cors-anywhere.herokuapp.com/
    Axios.get(`${API_ID}/api/get-restaraunt-list/${sessions_poll_id}/${tempUserId}`)
      .then((response) => {
        console.log(response.data)
        setRestarauntList(response.data)
        updateUpvoteDict(sessions_poll_id, tempUserId)
      })
      .catch((err) => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRestarauntList = () => {
    Axios.get(`${API_ID}/api/get-restaraunt-list/${pollId}/${userId}`)
      .then((response) => {
        console.log(upvoteDict)
        console.log(response.data)
        setRestarauntList(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const updateUpvoteDict = (pollId, userId) => {
    Axios.get(`${API_ID}/api/get-upvote-dict/${pollId}/${userId}`)
      .then((response) => {
        setUpvoteDict(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  };


  const addNewRestaraunt = (restarauntName) => {
    Axios.post(`${API_ID}/api/add-restaraunt/`, {
      pollId: pollId,
      userId: userId,
      restarauntName: restarauntName
    })
      .then((response) => {
        updateRestarauntList()
        updateUpvoteDict(pollId, userId)
        setAddPrompt(false)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const upvoteRestaraunt = (restarauntName) => {
    Axios.post(`${API_ID}/api/upvote-restaraunt/`, {
      pollId: pollId,
      userId: userId,
      restarauntName: restarauntName
    })
      .then((response) => {
        updateRestarauntList()
        updateUpvoteDict(pollId, userId)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const downvoteRestaraunt = (restarauntName) => {
    Axios.post(`${API_ID}/api/downvote-restaraunt/`, {
      pollId: pollId,
      userId: userId,
      restarauntName: restarauntName
    })
      .then((response) => {
        updateRestarauntList()
        updateUpvoteDict(pollId, userId)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  function AddSpecialRestaraunt() {
    var newLocationName = "";
    return (
      <>
        <Fade clear appear when={!addPrompt} collapse>
          <Button size='sm' style={{ margin: "2rem" }} className="unvote-btn" onClick={() => { setAddPrompt(true) }}>
            Add a new one
          </Button>
        </Fade>
        <Fade bottom appear when={addPrompt} collapse>
          <h1 style={{ fontSize: "1.5rem" }}>
            Add a New Option
            </h1>
          <Form.Row style={{ margin: "1 rem" }} className="align-items-center smaller-text">
            <Form.Label className='smaller-text'> 
              Location Name
            </Form.Label>
            <Form.Control type="locationname" placeholder="Enter Location Name"
              onChange={(e) => { newLocationName = e.target.value }} />
          </Form.Row>
          <Button size='sm' style={{ margin: "1rem" }} className="unvote-btn" onClick={() => {
            if (newLocationName !== '') {
              addNewRestaraunt(newLocationName)
            }
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
        <a style={{ fontSize: '.9 rem' }} href={`https://planbuddy.alayev.com/${pollId}`}>https://planbuddy.alayev.com/{pollId}</a>
        <ul>
          <Container fluid style={{ margin: "2rem" }}>
            {restarauntList.map((value) => {
              return (
                <Fade bottom>
                  <Row>
                    <Col className="restaraunt-text">
                      {value[0]}
                    </Col>
                    <Col className="mb-2">
                      <Button variant="primary"
                        size='sm'
                        className={!upvoteDict[value[0]] ? "unvote-btn top-margin" : "top-margin"}
                        onClick={() => {
                          !upvoteDict[value[0]] ? upvoteRestaraunt(value[0]) : downvoteRestaraunt(value[0])
                        }}>
                        Upvotes: {value[1]}
                      </Button>
                    </Col>
                  </Row>
                </Fade>
              )
            })}
          </Container>
          <AddSpecialRestaraunt />
        </ul>
      </div>

    </>
  );
};

export default RestarauntListBox;
