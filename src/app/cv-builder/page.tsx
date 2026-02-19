"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Download, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import Header from "@/components/Header";

export default function CvBuilderPage() {
    const [profile, setProfile] = useState<any>(null);

    return (
        <>
            <Header />
            <div className="min-h-screen p-8 pt-28">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-4">CV Builder</h1>
                    <p className="text-gray-400 mb-8">Generate your verified skills resume</p>
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-xl text-white">CV Builder coming soon...</p>
                        <p className="text-gray-400 mt-4">Transform your verified skills into a professional resume</p>
                    </div>
                </div>
            </div>
        </>
    );
}
