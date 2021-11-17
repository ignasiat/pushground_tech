/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EVENT_TYPES } from "./constants";
import c3 from 'c3';

export const formatNumber = (input: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  return formatter.format(input);
}

export const printDatainTable = (input: any): void => {
  input.forEach((element: any) => {
    Object.keys(element.audiences).forEach((audience: any) => {
      Object.keys(element.audiences[audience]).forEach((type: any) => {
        const myreference = document.getElementById(`${type}-${audience}-${element.date}`);
        if (myreference){
          myreference.innerText = formatNumber(element.audiences[audience][type]);
        }
      })
    })
  })
}


export const printCharts = (input: any): void => {
  const formData = new FormData(document.getElementsByTagName('form')[0] ?? undefined);
  const output: any = {
    x: ['x']
  };
  const dailyTotal: any = {};
  EVENT_TYPES.forEach((eventType: any) => {
    output[eventType.fieldName] = [eventType.name];
  })

  const totalAudiencesActives = input.reduce((acc:any, cur:any)=> {
    //We check that the day is active
    if (formData.get(`check-${cur.date}`) === 'on') {
      output.x.push(cur.date);
      //Set the dailyTotal equal to 0
      EVENT_TYPES.forEach((eventType: any) => {
        dailyTotal[eventType.fieldName] = 0;
      })
      Object.keys(cur.audiences).forEach((audience: string) => {
        //We check that the status is checked
        if (formData?.get(`check-status-${audience}`) === 'on') {
          //We check for every type if is checked
          EVENT_TYPES.forEach((eventType: {name: string; fieldName: string}) => {
            if(formData?.get(`check-${eventType.fieldName}-${audience}`) === 'on') {
              dailyTotal[eventType.fieldName] += cur.audiences?.[audience]?.[eventType.fieldName];
            }
          })
        }
      })
      EVENT_TYPES.forEach((eventType: any) => {
        acc[eventType.fieldName] += dailyTotal[eventType.fieldName];
        output[eventType.fieldName].push(dailyTotal[eventType.fieldName]);
      })
    } 
    return acc;
  }, {view_content: 0, page_scroll: 0, conversion: 0});
  const columns = [output.x];
  const columnsTotal: any = [];
  EVENT_TYPES.forEach((eventType: any) => {
    columns.push(output[eventType.fieldName]);
    columnsTotal.push([eventType.name, totalAudiencesActives[eventType.fieldName]]);
  })
  c3.generate({
    bindto: '#chart',
    size: {
      width: 800
    },
    padding: {
      top: 10,
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
    },
    title: {
      text: 'Filtered Data'
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
  },
  title: {
    text: 'Filtered Totals'
  }
  });
}

export const getInputsChecked = (dataApi: any): void => {
  dataApi.forEach((element: any) => {
    if (element.active) {
      document.getElementById(`check-status-${element.id}`)?.click();
    }
    element.events.forEach((ev: any) => {
      document.getElementById(`check-${ev}-${element.id}`)?.click();
    })
  })
}
