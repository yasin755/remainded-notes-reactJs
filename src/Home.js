import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Home.css"
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import Cardcart from './Cardcart';
import Loader from './Loader';

let currentRemindersData = [
  {
    "id": 12,
    "title": "Reminder1",
    "details": "details1",
    "dueDate": "12-25-2023",
    "priority": "Medium",
    "createdDate": "11-22-2022"
  },
  {
    "id": 13,
    "title": "Reminder2",
    "details": "details2",
    "dueDate": "10-25-2024",
    "priority": "High",
    "createdDate": "17-10-2023"
  },
  {
    "id": 14,
    "title": "Reminder3",
    "details": "details3",
    "dueDate": "10-07-2023",
    "priority": "Low",
    "createdDate": "11-10-2023"
  },
  {
    "id": 1,
    "title": "Reminder4",
    "details": "details4",
    "dueDate": "03-01-2024",
    "priority": "Medium",
    "createdDate": "13-10-2024"
  },
]

//currentRemindersData = [];

function Home() {
  const [showCards, setShowCards] = useState(false);
  const [remindersData, setRemindersData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [editReminderItem, setEditReminderItem] = useState(null);

  const deleteReminderHandler = (deletedData) => {
    console.log(deletedData);
    const deletedId = deletedData.id;
    /* const filterData = remindersData.filter((item) => {
      return (item.id != deletedData.id)
    });
    setRemindersData([...filterData]); */
    axios({
      //url: "http://localhost:8080/api/reminder/delete/deletedId",
      url: "https://jsonplaceholder.typicode.com/users",
      method: "DELETE",
      headers: {
        // Add any auth token here
        authorization: "your token comes here",
      },
    })
      .then((res) => {
        console.log(res);
        if(res?.deleted) {
          setShowCards(true);
          loadRemindersData();
          //setRemindersData(currentRemindersData);
        } else {
          setShowCards(false);
          //setRemindersData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onEditInputControlHandler = (ev, editedReminder) => {
    console.log('edit input control changed');
    console.log(ev);
    const {name, value} = ev.target;
    const editReminderId = editedReminder.id;
    remindersData?.map((item) => {
      if(item.id == editReminderId) {
        item[name] = value;
      }
    });
    setRemindersData([...remindersData]);
  }

  const editReminderHandler = (editedReminder) => {
    console.log(editedReminder, 'editMode');
    const editReminderId = editedReminder.id;
    currentRemindersData?.map((item) => {
      if(item.id == editReminderId) {
        item.isEditMode = true;
      } else {
        item.isEditMode = false;
      }
    });
    setRemindersData([...currentRemindersData]);
    setEditReminderItem(editedReminder);
  }

  const saveReminder = () => {
    console.log('save reminder btn clicked');
    if(editReminderItem) {
      const body = {
        "id": editReminderItem.id,
        "title": editReminderItem.title,
        "details": editReminderItem.details,
        "dueDate":editReminderItem.dueDate,
        "priority": editReminderItem.priority,
        "createdDate": null
      }
      setShowLoader(true);
    axios({
      // Endpoint to send files
      //url: "http://localhost:8080/api/reminder/save",
      url: "https://jsonplaceholder.typicode.com/users",
      method: "POST",
      body: body,
      headers: {
        // Add any auth token here
        authorization: "your token comes here",
      },
    })
      .then((res) => {
        console.log(res);
        if(res) {
          setShowCards(true);
          setEditReminderItem(null);
          loadRemindersData();
        } else {
          setShowCards(false);
        }
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
    }
  }

  function loadRemindersData() {
    setShowLoader(true);
    axios({
      // Endpoint to send files
      //url: "http://localhost:8080/api/reminder/current",
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      headers: {
        // Add any auth token here
        authorization: "your token comes here",
      },
    })
      .then((res) => {
        console.log(res);
        if(res?.data.length > 0) {
          setShowCards(true);
          
          currentRemindersData?.map((item) => {
            item.isEditMode = false;
            item.dueDate = getDateHandler(item.dueDate);
          })
          setRemindersData(currentRemindersData);
        } else {
          setShowCards(false);
          setRemindersData([]);
        }
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  }

  const getDateHandler = (date) => {
    let dateStr = new Date(date);
    const dd = String(dateStr.getDate()).padStart(2, '0');
    const mm = String(dateStr.getMonth() + 1).padStart(2, '0');
    const yyyy = dateStr.getFullYear();

    dateStr =  yyyy + '-' + mm + '-' + dd;
    return dateStr;
  }

  useEffect(() => {
    loadRemindersData();
  }, []);

  return (
    <div className='py-4 container main-layout'>
      <h3 className='text-center'>Current Reminders</h3>
      <div className='buttons'>
        <Link to="/new-remainder">
          <Button variant="primary" size="sm" className='btn'>
            Add Remainder</Button></Link>
        <Button variant="primary" size="sm" className='btn' onClick={saveReminder}>
          Save Remainder
        </Button>
      </div>
        {showCards && !showLoader?
        <div>
          <Cardcart reminderData={remindersData} deleteActionHandler={deleteReminderHandler} editActionHandler={editReminderHandler} editInputControlActionHandler={onEditInputControlHandler} />
        </div>
        :<div className='text-center mt-4'>
          {
            showLoader? <Loader /> : <h3>No Data</h3>
          }
          </div>
        }
    </div>
  )
}

export default Home