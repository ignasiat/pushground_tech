/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './styles.scss';
import { getApiData } from '../getApiData';
import { EVENT_TYPES } from './constants';
import { getInputsChecked, printCharts, printDatainTable } from './utils';
import { printCellTableDates, printInputsCheckboxs } from './util';


const Dashboard = ():JSX.Element => {
  const [dataApi, setDataApi] = useState<any>([[],[]]);

  useEffect(() => {
    Promise.all([
      getApiData('https://api.pushground.com/candidates/test/audiences'),
      getApiData('https://api.pushground.com/candidates/test/events')
    ])
    .then(response => setDataApi(response))
    .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if(dataApi[0].length > 0 && dataApi[1].length > 0) {
      getInputsChecked(dataApi[0]);
      reconcilateChecks(dataApi[0]);
      printDatainTable(dataApi[1]);
      printCharts(dataApi[1]);
      dataApi[0].forEach((element: any) => {
        EVENT_TYPES.forEach((eventType: any) => {
          if(document.getElementById(`check-${eventType.fieldName}-${element.id}`)) {
            document.getElementById(`check-${eventType.fieldName}-${element.id}`)?.addEventListener('click', handleClick);
            document.getElementById(`check-status-${element.id}`)?.addEventListener('click', handleClick);
          }
        })
      })
      dataApi[1].forEach((element: any) => {
        document.getElementById(`check-${element.date}`)?.addEventListener('click', handleClick)
      })
      //Clean up
      return () => {
        dataApi[0].forEach((element: any) => {
          EVENT_TYPES.forEach((eventType: any) => {
            if(document.getElementById(`check-${eventType.fieldName}-${element.id}`)) {
              document.getElementById(`check-${eventType.fieldName}-${element.id}`)?.removeEventListener('click', handleClick);
              document.getElementById(`check-status-${element.id}`)?.removeEventListener('click', handleClick);
            }
          })
        })
        dataApi[1].forEach((element: any) => {
          document.getElementById(`check-${element.date}`)?.removeEventListener('click', handleClick)
        })
      }
    }
  }, [dataApi]);
  
  const handleClick =(event: Event): void => {
    reconcilateChecks(dataApi[0]);
    printCharts(dataApi[1]);
    event.stopPropagation();
  }

  const reconcilateChecks = (input: any): void => {
    const formData = new FormData(document.getElementsByTagName('form')[0] ?? undefined);
    input.forEach((element: any) => {
      if (formData.get(`check-status-${element.id}`) === null) {
        EVENT_TYPES.forEach((eventType: any) => {
          if (formData.get(`check-${eventType.fieldName}-${element.id}`) === 'on') {
            document.getElementById(`check-${eventType.fieldName}-${element.id}`)?.removeEventListener('click', handleClick);
            document.getElementById(`check-${eventType.fieldName}-${element.id}`)?.click();
            document.getElementById(`check-${eventType.fieldName}-${element.id}`)?.addEventListener('click', handleClick);
          }
        })
      }
    })
  } 

  return (
    <div className='pageContainer'>
      <h1 className='title'>Dashboard</h1>
        <form name='formData' id='formData'>
        <table className='tableData'>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Creation Date</td>
              <td>Status</td>
              <td>Event Types</td>
              {dataApi[1].map((element: any) => {
                return (
                    <td key={`td-${element.date}`}>
                      <input type='checkbox' defaultChecked key={`check-${element.date}`} name={`check-${element.date}`} id={`check-${element.date}`}/>
                      <label htmlFor={`check-${element.date}`}>{element?.date?.split('-').reverse().join('-')}</label>
                    </td>
                  )
                })}
            </tr>
          </thead>
          <tbody>
            {dataApi[0].map((element: any) => {
              return (
                <tr key={element.id}>
                  <td key={`id${element.id}`}>{element.id}</td>
                  <td key={`name${element.id}`}>{element.name}</td>
                  <td key={`createdAt${element.id}`}>{new Date(element.createdAt).toLocaleString()}</td>
                  <td key={`status${element.id}`}><input key={`check-status-${element.id}`} id={`check-status-${element.id}`} type='checkbox' name={`check-status-${element.id}`}/><label htmlFor={`check-status-${element.id}`}>Active</label></td>
                  <td key={`eventType${element.id}`}>
                    <table>
                      <thead></thead>
                      <tbody>
                        {printInputsCheckboxs(element.events,element.id).map(el => el)}
                      </tbody>
                    </table>
                  </td>
                {printCellTableDates(element.events, element.id, dataApi[1])}
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </form>
      <div className='chartContainer'>
        <div id='chart'></div>
        <div id='totalChart'></div>
      </div>
    </div>
    )
}

export default Dashboard;