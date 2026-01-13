import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Download,
    Share2,
    ArrowLeft,
    Award,
    ShieldCheck,
    Calendar,
    User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const Certificate = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const certificateRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`/api/courses/${courseId}`),
                    axios.get(`/api/progress/${courseId}`)
                ]);

                if (!progressRes.data.isCompleted || !progressRes.data.isRated) {
                    toast.error('Complete and rate the course to view your certificate');
                    navigate(`/course/${courseId}/player`);
                    return;
                }

                setCourse(courseRes.data);
                setEnrollment(progressRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching certificate data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, navigate]);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        const toastId = toast.loading('Generating premium certificate...');

        try {
            // Wait for images and fonts to stabilize
            await new Promise(resolve => setTimeout(resolve, 800));

            const element = certificateRef.current;

            // Capture as a ultra-high resolution PNG
            const dataUrl = await toPng(element, {
                quality: 1.0,
                pixelRatio: 4, // 4x for extreme sharpness
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0',
                    margin: '0',
                    padding: '0',
                }
            });

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => img.onload = resolve);

            const ratio = img.width / img.height;
            const pdfWidth = 297; // A4 Landscape
            const pdfHeight = pdfWidth / ratio;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'SLOW');

            const fileName = `Certificate-${user.name.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);

            toast.success('Premium certificate downloaded!', { id: toastId });
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate high-quality PDF.', { id: toastId });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-100 py-16 px-4">
            {/* Header / Actions */}
            <div className="max-w-5xl mx-auto mb-12 flex justify-between items-center print:hidden">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold transition-all group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleDownload}
                        className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-3 shadow-2xl shadow-neutral-300 transform active:scale-95"
                    >
                        <Download size={20} />
                        <span>DOWNLOAD PDF</span>
                    </button>
                    <button className="bg-white border border-neutral-200 text-neutral-700 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-50 transition-all flex items-center gap-3 shadow-sm transform active:scale-95">
                        <Share2 size={20} />
                        <span>SHARE</span>
                    </button>
                </div>
            </div>

            {/* Premium Certificate Content */}
            <div
                ref={certificateRef}
                className="max-w-[1000px] aspect-[1.414/1] mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at center, #ffffff 0%, #fdfdfd 100%)',
                }}
            >
                {/* Subtle Texture Layer */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Main Decorative Border (SVG for precision) */}
                <div className="absolute inset-0 border-[24px] border-transparent p-4">
                    <div className="absolute inset-0 border-[1px] border-orange-500/30 m-4" />
                    <div className="absolute inset-0 border-[0.5px] border-neutral-300 m-6" />


                    {/* Corner Ornaments */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-[3px] border-l-[3px] border-orange-500" />
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-[3px] border-r-[3px] border-orange-500" />
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-[3px] border-l-[3px] border-orange-500" />
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-[3px] border-r-[3px] border-orange-500" />

                    {/* Intricate SVG Border Pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1000 707">
                        <rect x="40" y="40" width="920" height="627" fill="none" stroke="#F97316" strokeWidth="0.5" strokeDasharray="5 5" />
                        <circle cx="40" cy="40" r="12" fill="none" stroke="#F97316" strokeWidth="1" />
                        <circle cx="960" cy="40" r="12" fill="none" stroke="#F97316" strokeWidth="1" />
                        <circle cx="40" cy="667" r="12" fill="none" stroke="#F97316" strokeWidth="1" />
                        <circle cx="960" cy="667" r="12" fill="none" stroke="#F97316" strokeWidth="1" />
                    </svg>
                </div>

                {/* Certificate Text Layer */}
                <div className="relative h-full flex flex-col items-center justify-between px-24 py-24 text-center">
                    {/* Badge/Icon Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 flex items-center justify-center translate-y-2">
                            <img
                                src="/GraduationCap.png"
                                alt="Certification Icon"
                                className="w-24 h-24 object-contain drop-shadow-xl saturate-150"
                                crossOrigin="anonymous"
                            />
                        </div>

                        <div>
                            <h1 className="text-neutral-400 font-extrabold text-[10px] uppercase tracking-[0.6em] mb-2">
                                Certificate of Achievement
                            </h1>
                            <p
                                className="italic text-lg text-neutral-500"
                                style={{ fontFamily: "'Spectral', serif" }}
                            >
                                This document is to formally certify that
                            </p>
                        </div>
                    </div>

                    {/* Recipient Section */}
                    <div className="flex flex-col items-center w-full">
                        <h2
                            className="text-7xl text-neutral-900 mb-6 tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {user.name}
                        </h2>

                        <div className="flex items-center gap-6 mb-8 w-full max-w-md">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                            <Award className="text-orange-500/80" size={24} />
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-orange-500/50 to-transparent" />
                        </div>

                        <p className="text-neutral-500 text-base mb-2 max-w-lg leading-relaxed">
                            has demonstrated exceptional commitment and proficiency through the successful completion of
                        </p>

                        <h3
                            className="text-3xl font-bold text-neutral-800 italic"
                            style={{ fontFamily: "'Spectral', serif" }}
                        >
                            "{course.title}"
                        </h3>
                    </div>

                    {/* Signature & Info Section */}
                    <div className="w-full grid grid-cols-3 gap-8 pt-10 border-t border-neutral-100 items-end">
                        {/* Column 1: Date */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Issuance Date</span>
                            <span
                                className="text-base text-neutral-800 font-medium"
                                style={{ fontFamily: "'Spectral', serif" }}
                            >
                                {new Date(enrollment.updatedAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        {/* Column 2: Verification */}
                        <div className="flex flex-col items-center gap-1 relative">
                            <ShieldCheck className="text-orange-600/10 absolute -top-12" size={48} />
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest z-10">Verification ID</span>
                            <span className="font-mono text-[10px] text-neutral-500 z-10 bg-white/80 px-2">
                                {enrollment._id.substring(0, 16).toUpperCase()}
                            </span>
                        </div>

                        {/* Column 3: Instructor */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Lead Instructor</span>
                            <span
                                className="text-base text-neutral-800 italic font-medium"
                                style={{ fontFamily: "'Spectral', serif" }}
                            >
                                {course.instructor?.name || 'Authorized Educator'}
                            </span>
                        </div>
                    </div>

                    {/* Faint watermark in corner */}
                    <div className="absolute right-12 bottom-12 opacity-[0.03] pointer-events-none scale-150">
                        <Award size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
