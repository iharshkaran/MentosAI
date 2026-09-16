import React from 'react';
import Navbar from '../components/landing/Navbar';
import LivePlayground from '../components/landing/LivePlayground';
import Hero from '../components/landing/Hero';
import PipelineVisual from '../components/landing/PipelineVisual';
import WorkflowSteps from '../components/landing/WorkflowSteps';
import Footer from '../components/landing/Footer';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import TrustedBrands from '../components/landing/TrustedBrands';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#F4F3EF] text-zinc-900 font-sans relative overflow-hidden selection:bg-zinc-200">
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #d4d4d8 1px, transparent 1px),
                        linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)
                    `,
                    backgroundSize: '2.5rem 2.5rem',
                    maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
                }}
            />

            <div className="relative z-10 flex flex-col items-center w-full">
                <Navbar />
                
                <main className="w-full flex flex-col items-center pt-20 px-6 max-w-5xl mx-auto">
                    <Hero />
                    <PipelineVisual />
                    <LivePlayground />
                    <WorkflowSteps />
                    <FeaturesGrid />
                    <TrustedBrands />
                </main>
            </div>
            <div className="relative z-10 w-full">
                <Footer />
            </div>
        </div>
    );
};

Landing.displayName = "LandingPage";

export default Landing;