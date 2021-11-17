/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { EVENT_TYPES } from './constants';

export const printInputsCheckboxs = (input: string[], id: string): JSX.Element[] => {
  return EVENT_TYPES
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

export const printCellData = (input: string[], id: string, date: string): JSX.Element[] => {
  return EVENT_TYPES
    .filter((eventType: {name: string; fieldName: string}) => {
      return input.indexOf(eventType.fieldName) >= 0
    })
    .map((eventType) => {
      return (
      <tr key={`tr-${eventType.fieldName}-${id}-${date}`}>
        <td key={`td-${eventType.fieldName}-${id}-${date}`} id={`${eventType.fieldName}-${id}-${date}`} className='cellNumber'>
        </td>
      </tr>
    )
  });
}

export const printCellTableDates = (events: string[], id: string, apiResponse: any): JSX.Element[] => {
  return apiResponse.map((item: any) => {
    return <td key={`td-eventType${id}${item.date}`} className='cellDate'>
      <table key={`table-eventType${id}${item.date}`}>
        <thead key={`thead-eventType${id}${item.date}`}>
        </thead>
        <tbody key={`tbody-eventType${id}${item.date}`}>
          {printCellData(events, id, item.date).map(el => el)}
        </tbody>
      </table>
    </td>
  });
}
