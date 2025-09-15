import React from 'react';
/**
 * @param {String} title
 * @param {String} value
 * @param {String} icon
 * @param {String} change
 * @param {String} color
 * @param {String} className
 */



const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color = 'indigo' ,
    className
}) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  <StatCard
    title="Total de Estudiantes"
    value="1,247"
    change="+12.5%"
    trend="up"
    icon={UsersIcon}
    color="red"
  />

  const changeColor = change.startsWith('+') ? 'text-green-600' : 'text-red-600';


  console.log(changeColor);
  console.log(change);


  return (
    <div className={"bg-white overflow-hidden shadow rounded-lg" + className}>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${colors[color] || colors.indigo} rounded-md p-3`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <span 
                  className={`ml-2 text-sm font-medium ${changeColor}`}
                >
                  {change}
                </span>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
