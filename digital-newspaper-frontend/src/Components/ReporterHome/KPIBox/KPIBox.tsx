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


