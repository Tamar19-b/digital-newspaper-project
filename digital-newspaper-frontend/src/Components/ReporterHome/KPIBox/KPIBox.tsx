import React from 'react';
import { EyeFill, CheckCircleFill, PencilSquare, ExclamationCircleFill } from 'react-bootstrap-icons';
import Counter from './Counter';
import { ReporterData } from '../index';
import './KPIBox.css';

interface KPIItem {
  icon: JSX.Element;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'orange' | 'red';
  labelClass: string;
}

interface KPIBoxProps {
  stats: KPIItem[];
  filterBar?: JSX.Element; // קומפוננטת סינון אופציונלית
}

const KPIBox: React.FC<KPIBoxProps> = ({ stats, filterBar }) => {
  return (
    <>
      <div className="kpi-container">
        {stats.map((stat, index) => (
          <div className={`kpi-box ${stat.color}`} key={index}>
            <div className="kpi-icon">{stat.icon}</div>
            <Counter target={stat.value} />
            <div className={`kpi-label ${stat.labelClass}`}>{stat.label}</div>
          </div>
        ))}
      </div>
      {filterBar && (
        <div className="filter-bar-box">
          {filterBar}
        </div>
      )}
    </>
  );
};



export default KPIBox;



/*import React from 'react';
import { EyeFill, CheckCircleFill, PencilSquare, ExclamationCircleFill } from 'react-bootstrap-icons';
import Counter from './Counter';
import { ReporterData } from '../index';

interface KPIBoxProps {
  reporter: ReporterData | null;
}

const KPIBox: React.FC<KPIBoxProps> = ({ reporter }) => {
  const stats = [
    {
      icon: <EyeFill />,
      label: 'צפיות השבוע',
      value: '2.4K',
      color: 'blue',
      labelClass: 'label-blue',
    },
    {
      icon: <CheckCircleFill />,
      label: 'פורסמו היום',
      value: '100',
      color: 'green',
      labelClass: 'label-green',
    },
    {
      icon: <PencilSquare />,
      label: 'בכתיבה',
      value: reporter?.articles.filter((a) => a.status === 'DRAFT').length || 0,
      color: 'orange',
      labelClass: 'label-orange',
    },
    {
      icon: <ExclamationCircleFill />,
      label: 'ממתינות לבדיקה',
      value: reporter?.articles.filter((a) => a.status === 'SUBMITTED').length || 0,
      color: 'red',
      labelClass: 'label-red',
    },
  ];

  return (
    <div className="kpi-container">
      {stats.map((stat, index) => (
        <div className={`kpi-box ${stat.color}`} key={index}>
          <div className="kpi-icon">{stat.icon}</div>
          <Counter target={stat.value} />
          <div className={`kpi-label ${stat.labelClass}`}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default KPIBox;
*/