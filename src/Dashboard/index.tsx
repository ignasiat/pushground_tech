/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './styles.scss';
import { getApiData } from '../getApiData';
import c3 from 'c3';


const Dashboard = ():JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      printCharts(dataApi[1]);
      // const formData = new FormData(document.getElementsByTagName('form')[0] ?? undefined);
      dataApi[0].forEach((element: any) => {
        eventTypes.forEach((eventType: any) => {
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
          eventTypes.forEach((eventType: any) => {
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
    printCharts(dataApi[1]);
    event.stopPropagation();
  }

  const eventTypes = [
    {name: 'View Content',fieldName: 'view_content'},
    {name: 'Page Scroll',fieldName: 'page_scroll'},
    {name: 'Conversion',fieldName: 'conversion'},
  ];

  const printInputsCheckboxs = (input: string[], id: string): JSX.Element[] => {
    return eventTypes
      .filter((eventType: {name: string; fieldName: string}) => {
        return input.indexOf(eventType.fieldName) >= 0
      })
      .map((eventType) => {
        return (
        <tr key={`tr-${eventType.fieldName}-${id}`}>
          <td key={`td-${eventType.fieldName}-${id}`}>
            <input 
              type='checkbox'
              key={`check-${eventType.fieldName}-${id}`} 
              name={`check-${eventType.fieldName}-${id}`}
              id={`check-${eventType.fieldName}-${id}`}
              />
            <label htmlFor={`check-${eventType.fieldName}-${id}`}>{eventType.name}</label>
          </td>
        </tr>
      )
    })
  }

  const printCharts = (input: any): void => {
    const formData = new FormData(document.getElementsByTagName('form')[0] ?? undefined);
    const output: any = {
      x: ['x']
    };
    const dailyTotal: any = {};
    eventTypes.forEach((eventType: any) => {
      output[eventType.fieldName] = [eventType.name];
    })
    const totalAudiencesActives = input.reduce((acc:any, cur:any)=> {
      //We check that the day is active
      if (formData.get(`check-${cur.date}`) === 'on') {
        output.x.push(cur.date);
        //Set the dailyTotal equal to 0
        eventTypes.forEach((eventType: any) => {
          dailyTotal[eventType.fieldName] = 0;
        })
        Object.keys(cur.audiences).forEach((audience: string) => {
          //We check that the status is checked
          if (formData?.get(`check-status-${audience}`) === 'on') {
            //We check for every type if is checked
            eventTypes.forEach((eventType: {name: string; fieldName: string}) => {
              if(formData?.get(`check-${eventType.fieldName}-${audience}`) === 'on') {
                dailyTotal[eventType.fieldName] += cur.audiences?.[audience]?.[eventType.fieldName];
              }
            })
          }
        })
        eventTypes.forEach((eventType: any) => {
          acc[eventType.fieldName] += dailyTotal[eventType.fieldName];
          output[eventType.fieldName].push(dailyTotal[eventType.fieldName]);
        })
      } 
      return acc;
    }, {view_content: 0, page_scroll: 0, conversion: 0});
    const columns = [output.x];
    const columnsTotal: any = [];
    eventTypes.forEach((eventType: any) => {
      columns.push(output[eventType.fieldName]);
      columnsTotal.push([eventType.name, totalAudiencesActives[eventType.fieldName]]);
    })
    c3.generate({
      bindto: '#chart',
      size: {
        width: 800
      },
      padding: {
        top: 40,
        right: 40
      },
      data: {
          x: 'x',
          columns,
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%d-%m-%Y'
              }
          }
      }
    });
    c3.generate({
    bindto: '#totalChart',
    size: {
      width: 400
    },
    data: {
      columns: columnsTotal,
      type: 'bar',
    },
    bar: {
      width: {
        ratio: 0.5 
      }
    }
    });
  }

  const getInputsChecked = (dataApi: any): void => {
    dataApi.forEach((element: any) => {
      if (element.active) {
        document.getElementById(`check-status-${element.id}`)?.click();
      }
      element.events.forEach((ev: any) => {
        document.getElementById(`check-${ev}-${element.id}`)?.click();
      })
    })
  }

  return (
    <>
    <h1 className='title'>Dashboard is working</h1>
      <form name='formData' id='formData'>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Creation Date</td>
            <td>Status</td>
            <td>Event Types</td>
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
              </tr>
            )
          })
        }
        </tbody>
      </table>
      <table>
        <thead>
          <tr><td colSpan={dataApi[1].length}>Data</td></tr>
          </thead>
          <tbody>
            <tr>
            {dataApi[1].map((element: any) => {
              return (
                  <td key={`td-${element.date}`}>
                    <input type='checkbox' defaultChecked key={`check-${element.date}`} name={`check-${element.date}`} id={`check-${element.date}`}/>
                    <label htmlFor={`check-${element.date}`}>{element?.date?.split('-').reverse().join('-')}</label>
                  </td>
                )
              })}
            </tr>
          </tbody>
      </table>
    </form>
    <div className='chartContainer'>
      <div id='chart'></div>
      <div id='totalChart'></div>
    </div>
    </>
    )
}

export default Dashboard;