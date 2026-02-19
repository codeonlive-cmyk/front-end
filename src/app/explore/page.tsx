"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "Web Development", label: "Web Development" },
    { id: "AI & Data", label: "AI & Data" },
    { id: "Infrastructure", label: "Infrastructure" },
];

export default function ExplorePage() {
    const [paths, setPaths] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const data: any = await api.get("/learning/paths");
                setPaths(data);
            } catch (err) {
                console.error("Failed to fetch learning paths", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPaths();
    }, []);

    const filteredPaths = paths.filter(path => {
        const matchesCategory = activeCategory === "all" || path.category === activeCategory;
        const matchesSearch = search === "" || 
            path.name.toLowerCase().includes(search.toLowerCase()) ||
            path.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleEnroll = async (pathId: number) => {
        // Check if user is logged in
        const token = localStorage.getItem("vle_token");
        if (!token) {
            // Redirect to login if not authenticated
            router.push("/login");
            return;
        }

        try {
            await api.post("/learning/enroll", { pathId });
            router.push(`/learning?path=${pathId}`);
        } catch (err) {
            console.error("Failed to enroll", err);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen pb-20 pt-20">
                <header className="py-20 px-8 text-center space-y-4">
                <h1 className="text-5xl font-black text-[#ffd700]">Explore Career Paths</h1>
                <p className="text-xl text-slate-400 font-medium">Choose your target role and start your verified learning journey</p>
            </header>

            <section className="max-w-4xl mx-auto px-8 mb-12">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-[#ffd700] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for roles, skills, or technologies..."
                        className="w-full pl-14 pr-6 py-5 bg-[#0f172a]/60 border border-white/10 rounded-2xl text-white outline-none focus:border-[#ffd700] backdrop-blur-md shadow-2xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-8 mb-16 overflow-x-auto">
                <div className="flex items-center justify-center gap-3 min-w-max">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeCategory === cat.id
                                    ? "bg-[#ffd700] border-[#ffd700] text-[#0f172a]"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            <main className="max-w-[1400px] mx-auto px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 rounded-[32px] bg-white/5 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPaths.map((path) => (
                            <PathCard key={path.id} path={path} onEnroll={handleEnroll} />
                        ))}
                    </div>
                )}
            </main>

            <section className="max-w-4xl mx-auto px-8 mt-24">
                <div className="p-10 rounded-[40px] bg-[#0f172a]/60 border border-white/10 backdrop-blur-xl">
                    <h3 className="text-2xl font-black text-[#ffd700] mb-6 uppercase tracking-widest">How Goal Selection Works</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Select one or multiple career goals
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Each goal has a personalized dependency graph
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Skills are unlocked based on prerequisites
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Progress is tracked separately for each goal
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Verification is mandatory before progression
                        </li>
                    </ul>
                </div>
            </section>
            </div>
        </>
    );
}

function PathCard({ path, onEnroll }: { path: any; onEnroll: (id: number) => void }) {
    const difficultyColors = {
        beginner: "bg-green-500/20 text-green-500",
        intermediate: "bg-yellow-500/20 text-yellow-500",
        advanced: "bg-red-500/20 text-red-500"
    };

    return (
        <div className="bg-[#0f172a]/95 border border-white/10 p-8 rounded-[32px] backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,215,0,0.1)] group">
            <div className="flex items-start justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{path.icon || "🎓"}</div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${difficultyColors[path.difficulty as keyof typeof difficultyColors]}`}>
                    {path.difficulty}
                </span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{path.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                {path.description}
            </p>

            <div className="flex items-center gap-4 mb-6 text-xs text-slate-400">
                <span>⏱️ {path.estimated_hours}h</span>
                <span>📚 {path.category}</span>
            </div>

            <button 
                onClick={() => onEnroll(path.id)}
                className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2"
            >
                Start Learning
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
