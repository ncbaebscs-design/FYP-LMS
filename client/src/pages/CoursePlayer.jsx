import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    PlayCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    FileText,
    Video,
    ArrowLeft,
    ArrowRight,
    Star,
    Send,
    MessageCircle,
    User,
    Reply,
    CornerDownRight
} from 'lucide-react';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLecture, setActiveLecture] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [activeTab, setActiveTab] = useState('description');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`/api/courses/${courseId}`),
                    axios.get(`/api/progress/${courseId}`)
                ]);
                setCourse(courseRes.data);
                setEnrollment(progressRes.data);

                // Set first lecture as active if none selected
                if (courseRes.data.curriculum?.length > 0) {
                    const firstSection = courseRes.data.curriculum[0];
                    if (firstSection.lectures?.length > 0) {
                        setActiveLecture(firstSection.lectures[0]);
                        setOpenSections({ [firstSection._id]: true });
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course player data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    useEffect(() => {
        const fetchComments = async () => {
            if (activeLecture && activeTab === 'comments') {
                try {
                    const { data } = await axios.get(`/api/comments/${courseId}/${activeLecture._id}`);
                    setComments(data);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            }
        };
        fetchComments();
    }, [courseId, activeLecture, activeTab]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isPostingComment) return;

        setIsPostingComment(true);
        try {
            const { data } = await axios.post(`/api/comments/${courseId}/${activeLecture._id}`, {
                content: newComment,
                parentComment: replyingTo?._id // Add parent comment ID if replying
            });

            // If it's a reply, we can't just prepend it to the list if we want it to stay with parent
            // But for now, let's just prepend and the grouping logic will handle it on next render
            setComments(prev => [data, ...prev]);
            setNewComment('');
            setReplyingTo(null); // Reset reply state after posting
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleMarkComplete = async (lectureId) => {
        try {
            const { data } = await axios.put(`/api/progress/${courseId}/complete/${lectureId}`);
            setEnrollment(data);
            if (data.isCompleted && !data.isRated) {
                setShowRatingModal(true);
            }
        } catch (error) {
            console.error('Error marking lecture as complete:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        setIsSubmittingReview(true);
        try {
            await axios.post(`/api/reviews/${courseId}`, {
                rating,
                comment: reviewComment
            });
            setEnrollment(prev => ({ ...prev, isRated: true }));
            setShowRatingModal(false);
            toast.success('Thank you for your review!');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const getNextLecture = () => {
        if (!course || !activeLecture) return null;

        let foundCurrent = false;
        for (const section of course.curriculum) {
            for (const lecture of section.lectures) {
                if (foundCurrent) return { sectionId: section._id, lecture };
                if (lecture._id === activeLecture._id) foundCurrent = true;
            }
        }
        return null;
    };

    const handleNext = () => {
        const next = getNextLecture();
        if (next) {
            setActiveLecture(next.lecture);
            setOpenSections(prev => ({ ...prev, [next.sectionId]: true }));
            window.scrollTo(0, 0);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!course) return <div>Course not found</div>;

    const activeVideo = activeLecture?.contents?.find(c => c.type === 'video');
    const nextLectureData = getNextLecture();

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">
            {/* Left Side: Video Player & Info */}
            <div className="flex-grow lg:w-3/4 overflow-y-auto pb-10">
                {/* Header for Mobile/Back button */}
                <div className="p-4 flex items-center gap-4 bg-gray-900 text-white lg:hidden">
                    <button onClick={() => navigate('/dashboard')}><ArrowLeft /></button>
                    <h1 className="text-sm font-bold truncate">{course.title}</h1>
                </div>

                {/* Video Player Area */}
                <div className="aspect-video bg-black relative">
                    {activeVideo ? (
                        <video
                            key={activeLecture._id} // Re-mount video on lecture change
                            src={activeVideo.data}
                            controls
                            className="w-full h-full"
                            style={{ maxHeight: '70vh' }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white flex-col gap-4">
                            <Video size={64} className="opacity-20" />
                            <p className="opacity-50">No video selected for this lecture</p>
                        </div>
                    )}
                </div>

                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">{activeLecture?.title || 'Welcome'}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Last updated Aug 24, 2024</span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Lecture Notes</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {activeLecture && (
                                <button
                                    onClick={() => handleMarkComplete(activeLecture._id)}
                                    disabled={enrollment?.completedLectures?.includes(activeLecture._id)}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all ${enrollment?.completedLectures?.includes(activeLecture._id)
                                        ? 'bg-green-100 text-green-600 cursor-default flex items-center gap-2'
                                        : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                                        }`}
                                >
                                    {enrollment?.completedLectures?.includes(activeLecture._id) ? (
                                        <><CheckCircle size={18} /> Completed</>
                                    ) : (
                                        'Mark as Complete'
                                    )}
                                </button>
                            )}

                            {enrollment?.completedLectures?.includes(activeLecture?._id) && nextLectureData && (
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500"
                                >
                                    Next Lecture <ArrowRight className="rotate-0" size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-100 flex gap-8 mb-8 overflow-x-auto no-scrollbar">
                        {['description', 'lecture-notes', 'attach-file', 'comments'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="prose prose-orange max-w-none">
                        {activeTab === 'description' && (
                            <div className="text-gray-600 leading-relaxed">
                                <h3 className="text-xl font-black text-gray-900 mb-4">Lecture Description</h3>
                                <p>{activeLecture?.contents?.find(c => c.type === 'description')?.data || activeLecture?.description || course.description}</p>
                            </div>
                        )}
                        {activeTab === 'comments' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* Comment Form */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MessageCircle size={18} className="text-orange-500" />
                                        {replyingTo ? `Replying to ${replyingTo.user?.name}` : 'Ask a question or leave a comment'}
                                    </h4>
                                    <form onSubmit={handleCommentSubmit} className="relative">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={replyingTo ? "Write your reply..." : "Write your comment here..."}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none min-h-[100px] text-sm"
                                        />
                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                            {replyingTo && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setReplyingTo(null); setNewComment(''); }}
                                                    className="bg-white text-gray-500 border border-gray-200 p-2 px-4 rounded-lg font-bold text-xs hover:bg-gray-50 transition-all"
                                                >
                                                    CANCEL
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim() || isPostingComment}
                                                className="bg-gray-900 text-white p-2 px-4 rounded-lg font-bold text-xs hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                            >
                                                {isPostingComment ? 'POSTING...' : <>{replyingTo ? 'REPLY' : 'POST'} <Send size={14} /></>}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-6">
                                    {comments.length > 0 ? (
                                        (() => {
                                            const parentComments = comments.filter(c => !c.parentComment);
                                            const replies = comments.filter(c => c.parentComment);

                                            return parentComments.map((comment) => (
                                                <div key={comment._id} className="space-y-4">
                                                    <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative group">
                                                        <div className="flex-shrink-0">
                                                            {comment.user?.avatar ? (
                                                                <img src={comment.user.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt={comment.user.name} />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 border border-orange-200">
                                                                    <User size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h5 className="font-bold text-gray-900 text-sm">{comment.user?.name || 'Anonymous Student'}</h5>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{comment.content}</p>

                                                            <button
                                                                onClick={() => {
                                                                    setReplyingTo(comment);
                                                                    // Scroll to form maybe?
                                                                    document.querySelector('textarea')?.focus();
                                                                }}
                                                                className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
                                                            >
                                                                <Reply size={12} />
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Nested Replies */}
                                                    {replies.filter(r => (r.parentComment?._id || r.parentComment) === comment._id).map(reply => (
                                                        <div key={reply._id} className="flex gap-4 p-4 ml-12 rounded-2xl bg-gray-50/50 border-l-2 border-orange-100">
                                                            <div className="flex-shrink-0">
                                                                <CornerDownRight className="text-gray-300 mb-2" size={16} />
                                                                {reply.user?.avatar ? (
                                                                    <img src={reply.user.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt={reply.user.name} />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 border border-blue-200">
                                                                        <User size={16} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h5 className="font-bold text-gray-900 text-xs">{reply.user?.name || 'Anonymous Student'}</h5>
                                                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                                        {new Date(reply.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 text-xs leading-relaxed">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ));
                                        })()
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <MessageCircle size={48} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-medium">No comments yet. Be the first to start the discussion!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'lecture-notes' && (
                            <div className="space-y-6">
                                {activeLecture?.contents?.filter(c => c.type === 'text' || c.type === 'description').length > 0 ? (
                                    activeLecture.contents
                                        .filter(c => c.type === 'text' || c.type === 'description')
                                        .map((content, idx) => (
                                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                                {content.title && <h4 className="font-bold text-gray-900 mb-2">{content.title}</h4>}
                                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{content.data}</div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-gray-500 italic p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                        No specific notes provided for this lecture.
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'attach-file' && (
                            <div className="space-y-4">
                                {activeLecture?.contents?.filter(c => c.type === 'file' || c.type === 'image').length > 0 ? (
                                    activeLecture.contents
                                        .filter(c => c.type === 'file' || c.type === 'image')
                                        .map((content, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                                        {content.type === 'image' ? <Star size={20} /> : <FileText size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{content.title || `Downloadable ${content.type}`}</p>
                                                        <p className="text-xs text-gray-400 capitalize">{content.type} Resource</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={content.data}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-all"
                                                >
                                                    DOWNLOAD
                                                </a>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-gray-500 italic p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                        No supplemental files attached to this lecture.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Curriculum Sidebar */}
            <div className="lg:w-1/4 bg-gray-50 border-l border-gray-100 flex flex-col h-screen overflow-y-auto">
                <div className="p-6 bg-white border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-black text-gray-900">Course Contents</h2>
                        <span className="text-xs font-bold text-orange-600">{Math.round(enrollment?.progressPercentage || 0)}% Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                        />
                    </div>
                </div>

                <div className="flex-grow">
                    {course.curriculum?.map((section, sIdx) => (
                        <div key={section._id} className="border-b border-gray-100 last:border-0">
                            <button
                                onClick={() => toggleSection(section._id)}
                                className={`w-full p-4 flex items-center justify-between text-left hover:bg-white transition-colors ${openSections[section._id] ? 'bg-white font-bold' : 'bg-transparent text-gray-600 font-medium'}`}
                            >
                                <span className="text-sm truncate">Section {sIdx + 1}: {section.title}</span>
                                {openSections[section._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {openSections[section._id] && (
                                <div className="bg-white">
                                    {section.lectures?.map((lecture, lIdx) => (
                                        <button
                                            key={lecture._id}
                                            onClick={() => setActiveLecture(lecture)}
                                            className={`w-full p-4 pl-8 flex items-center gap-3 text-left transition-all border-l-2 ${activeLecture?._id === lecture._id
                                                ? 'bg-orange-50/50 border-orange-500 text-orange-600 font-bold'
                                                : 'border-transparent text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex-shrink-0">
                                                {enrollment?.completedLectures?.includes(lecture._id) ? (
                                                    <CheckCircle size={16} className="text-green-500" />
                                                ) : activeLecture?._id === lecture._id ? (
                                                    <PlayCircle size={16} />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs">{lIdx + 1}. {lecture.title}</p>
                                                <span className="text-[10px] text-gray-400">
                                                    {lecture.contents?.find(c => c.type === 'video')?.duration || 0}m
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star className="text-orange-500 fill-orange-500" size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">You did it!</h2>
                            <p className="text-gray-500 font-medium mb-8">Congratulations on completing the course! How would you rate your experience?</p>

                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                <div className="flex justify-center gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-colors duration-300 ${star <= (hover || rating)
                                                        ? 'text-orange-500 fill-orange-500'
                                                        : 'text-gray-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us what you liked (or didn't)..."
                                    required
                                    className="w-full p-5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all resize-none min-h-[120px] text-sm font-medium"
                                />

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-gray-200 hover:bg-orange-600 transition-all disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRatingModal(false)}
                                        className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        I'll do it later
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursePlayer;
