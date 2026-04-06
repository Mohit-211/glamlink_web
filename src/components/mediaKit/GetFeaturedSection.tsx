"use client"
import React, { useState } from 'react'
import FeatureFormModal from './FeatureFormModal';
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] tracking-[.15em] uppercase text-gray-400 mb-2">
            {children}
        </p>
    );
}
const GetFeaturedSection = () => {
    const [showForm, setShowForm] = useState(false);
    return (
        <div>
            <section>
                <div className="text-center mb-8">
                    <SectionLabel>Get Featured</SectionLabel>
                    <h2 className="font-serif text-3xl text-gray-900">Get Featured</h2>
                    <p className="text-[14px] font-light text-gray-400 mt-3 max-w-md mx-auto">
                        Apply to be featured or advertise through our submission form.
                        Limited placements available per issue.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full sm:w-auto rounded-full bg-[#23AEB8] px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#1a9aaa] hover:-translate-y-0.5 active:scale-95"
                    >
                        Get Featured Form →
                    </button>
                </div>
            </section>
            {showForm && (
                <FeatureFormModal onClose={() => setShowForm(false)} />
            )}
        </div>
    )
}
export default GetFeaturedSection