"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/Header";

interface Roadmap {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    difficulty: string;
    estimated_hours: number;
}

export default function RoadmapsPage() {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const data: any = await api.get("/roadmaps");
            setRoadmaps(data.roadmaps);
        } catch (err) {
            console.error("Failed to fetch roadmaps:", err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["all", ...new Set(roadmaps.map(r => r.category))];
    const filteredRoadmaps = filter === "all" 
        ? roadmaps 
        : roadmaps.filter(r => r.category === filter);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner": return "text-green-400";
            case "intermediate": return "text-yellow-400";
            case "advanced": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center pt-20">
                    <div className="text-xl text-white">Loading roadmaps...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen p-8 pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Career Roadmaps</h1>
                    <p className="text-xl text-gray-300">Choose your path and start learning with curated resources</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-3 mb-8 justify-center flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                filter === cat
                                    ? "bg-[#ffd700] text-[#0f172a]"
                                    : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                        >
                            {cat === "all" ? "All Roadmaps" : cat}
                        </button>
                    ))}
                </div>

                {/* Roadmaps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRoadmaps.map(roadmap => (
                        <Link
                            key={roadmap.id}
                            href={`/roadmaps/${roadmap.id}`}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="text-5xl mb-4">{roadmap.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-2">{roadmap.name}</h3>
                            <p className="text-gray-300 mb-4 line-clamp-2">{roadmap.description}</p>
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className={`font-medium capitalize ${getDifficultyColor(roadmap.difficulty)}`}>
                                    {roadmap.difficulty}
                                </span>
                                <span className="text-gray-400">
                                    ~{roadmap.estimated_hours}h
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-400 uppercase tracking-wide">
                                    {roadmap.category}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredRoadmaps.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                        No roadmaps found in this category.
                    </div>
                )}
            </div>
            </div>
        </>
    );
}
