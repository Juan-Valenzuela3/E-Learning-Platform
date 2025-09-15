import { Outlet } from 'react-router-dom';
import TitleManager from '@/components/TitleManager';
import { routeTitles } from '@/config/routeTitles';

const RootLayout = () => {
    return (
        <>
            <TitleManager
                routeTitles={routeTitles}
                defaultTitle="E-Learning Platform"
                includeAppName={true}
                appName="E-Learning"
            />
            <Outlet />
        </>
    );
};

export default RootLayout;
