import { type ReactNode } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gruv-dark text-gruv-green relative selection:bg-gruv-yellow selection:text-black">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gruv-dark via-[#282828] to-black opacity-80" />

                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gruv-aqua/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gruv-yellow/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
