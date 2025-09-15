export function classNames(...classes){
    return classes.filter(Boolean).join(' ');
}



const StatCard = ({title, value, change, icon: Icon, color = 'primary'}) => {
    const baseStyles = 'flex items-center p-4 rounded-lg shadow'
    const colorStyles = {
        primary: 'bg-red-50 text-red-600',
        secondary: 'bg-gray-100 text-gray-900',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
        error: 'bg-red-50 text-red-600',
        info: 'bg-blue-50 text-blue-600'
    };
    const iconColor = {
        primary: 'text-red-500',
        secondary: 'text-gray-600',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
        info: 'text-blue-500'
    };
    
    return (
        <div className={classNames(baseStyles, colorStyles[color])}>
            <div className={classNames('p-3 rounded-full', iconColor[color])}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    {change && (
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeColor}`}>
                            {change}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}