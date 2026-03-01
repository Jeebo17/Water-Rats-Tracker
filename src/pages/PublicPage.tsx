import React from 'react';
import Header from '../components/Header';

interface PublicPageProps {
    children: React.ReactNode;
}

const PublicPage: React.FC<PublicPageProps> = ({ children }) => {
    return (
        <div>
        <Header Public>
            <main className="container mx-auto px-4 py-6">
            {children}
            </main>
        </Header>
        </div>
    );
};

export default PublicPage;
