import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Plus, ChevronDown, Video, FileText, AlignLeft, File, Search, X, Upload, Loader2, Sparkles, Wand2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState({
        thumbnail: false,
        trailer: false,
        lecture: {}
    });
    const [aiLoading, setAiLoading] = useState(false);

    // State for Basic Information
    const [basicData, setBasicData] = useState({
        title: '',
        subtitle: '',
        category: '',
        subCategory: '',
        topic: '',
        language: '',
        subtitleLanguage: '',
        level: '',
        duration: { value: 0, unit: 'Hour' }
    });

    // State for Advance Information
    const [advanceData, setAdvanceData] = useState({
        thumbnail: null,
        trailer: null,
        description: '',
        objectives: ['', '', '', ''],
        targetAudience: ['', '', '', ''],
        requirements: ['', '', '', '']
    });

    // State for Curriculum
    const [curriculum, setCurriculum] = useState([
        { id: 1, title: 'Introduction', lectures: [] }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null); // { sectionId, lectureId }

    // State for Publish Information
    const [publishData, setPublishData] = useState({
        welcomeMessage: '',
        congratulationsMessage: '',
        additionalInstructors: []
    });

    const addSection = () => {
        setCurriculum([...curriculum, { id: Date.now(), title: 'New Section', lectures: [] }]);
    };

    const updateSectionTitle = (id, newTitle) => {
        setCurriculum(curriculum.map(c => c.id === id ? { ...c, title: newTitle } : c));
    };

    const addLecture = (sectionId) => {
        setCurriculum(curriculum.map(c => {
            if (c.id === sectionId) {
                return { ...c, lectures: [...c.lectures, { id: Date.now(), title: 'New Lecture' }] };
            }
            return c;
        }));
    };

    const updateLectureTitle = (sectionId, lectureId, newTitle) => {
        setCurriculum(curriculum.map(c => {
            if (c.id === sectionId) {
                const updatedLectures = c.lectures.map(l => l.id === lectureId ? { ...l, title: newTitle } : l);
                return { ...c, lectures: updatedLectures };
            }
            return c;
        }));
    };

    const addContentItem = (sectionId, lectureId, type, data = '', title = '') => {
        setCurriculum(curriculum.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lectures: section.lectures.map(lecture => {
                        if (lecture.id === lectureId) {
                            return {
                                ...lecture,
                                contents: [...(lecture.contents || []), { id: Date.now(), type, data, title }]
                            };
                        }
                        return lecture;
                    })
                };
            }
            return section;
        }));
        setActiveDropdown(null);
    };

    const removeContentItem = (sectionId, lectureId, contentId) => {
        setCurriculum(curriculum.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lectures: section.lectures.map(lecture => {
                        if (lecture.id === lectureId) {
                            return {
                                ...lecture,
                                contents: lecture.contents.filter(c => c.id !== contentId)
                            };
                        }
                        return lecture;
                    })
                };
            }
            return section;
        }));
    };

    const handleAdvanceChange = (index, field, value) => {
        const updatedList = [...advanceData[field]];
        updatedList[index] = value;
        setAdvanceData({ ...advanceData, [field]: updatedList });
    };

    const addField = (field) => {
        setAdvanceData({ ...advanceData, [field]: [...advanceData[field], ''] });
    };

    const handleFileUpload = async (e, type, sectionId = null, lectureId = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            if (sectionId && lectureId) {
                setUploading(prev => ({ ...prev, lecture: { ...prev.lecture, [lectureId]: true } }));
            } else {
                setUploading(prev => ({ ...prev, [type]: true }));
            }

            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (sectionId && lectureId) {
                setCurriculum(curriculum.map(c => {
                    if (c.id === sectionId) {
                        const updatedLectures = c.lectures.map(l => {
                            if (l.id === lectureId) {
                                const newContent = {
                                    id: Date.now(),
                                    type: file.type.includes('video') ? 'video' :
                                        file.type.includes('image') ? 'image' :
                                            file.type.includes('pdf') ? 'file' : 'file',
                                    data: data.filePath,
                                    title: file.name
                                };
                                return { ...l, contents: [...(l.contents || []), newContent] };
                            }
                            return l;
                        });
                        return { ...c, lectures: updatedLectures };
                    }
                    return c;
                }));
            } else {
                setAdvanceData(prev => ({ ...prev, [type]: data.filePath }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            if (sectionId && lectureId) {
                setUploading(prev => ({ ...prev, lecture: { ...prev.lecture, [lectureId]: false } }));
            } else {
                setUploading(prev => ({ ...prev, [type]: false }));
            }
        }
    };

    const generateAIDescription = async () => {
        if (!basicData.title) {
            toast.error('Please enter a course title first to generate a description');
            setActiveTab('basic');
            return;
        }

        setAiLoading(true);
        try {
            const { data } = await axios.post('/api/ai/generate-description', {
                title: basicData.title,
                category: basicData.category
            }, { withCredentials: true });

            setAdvanceData(prev => ({ ...prev, description: data.description }));
            toast.success('Description generated successfully!');
        } catch (error) {
            console.error('AI Generation failed', error);
            const message = error.response?.data?.message || 'AI Generation failed';
            toast.error(message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const courseData = {
                ...basicData,
                ...advanceData,
                curriculum,
                ...publishData,
                isPublished: true // Directly publish
            };

            await axios.post('/api/courses', courseData);
            alert('Course published successfully!');
            navigate('/instructor/my-courses');
        } catch (error) {
            console.error('Submission failed', error);
            alert(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Create a new course</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {/* Tabs */}
                <div className="border-b mb-6">
                    <nav className="flex space-x-8">
                        <button
                            className={`pb-4 px-1 ${activeTab === 'basic' ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            Basic Information
                        </button>
                        <button
                            className={`pb-4 px-1 ${activeTab === 'advance' ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('advance')}
                        >
                            Advance Information
                        </button>
                        <button
                            className={`pb-4 px-1 ${activeTab === 'curriculum' ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('curriculum')}
                        >
                            Curriculum
                        </button>
                        <button
                            className={`pb-4 px-1 ${activeTab === 'publish' ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('publish')}
                        >
                            Publish Course
                        </button>
                    </nav>
                </div>

                {/* Content */}
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Basic Information</h2>

                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Your course title"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={basicData.title}
                                onChange={(e) => setBasicData({ ...basicData, title: e.target.value })}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">{basicData.title.length}/80</div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Subtitle</label>
                            <input
                                type="text"
                                placeholder="Your course subtitle"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={basicData.subtitle}
                                onChange={(e) => setBasicData({ ...basicData, subtitle: e.target.value })}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">{basicData.subtitle.length}/120</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Course Category</label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    value={basicData.category}
                                    onChange={(e) => setBasicData({ ...basicData, category: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Business</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Course Sub-category</label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    value={basicData.subCategory}
                                    onChange={(e) => setBasicData({ ...basicData, subCategory: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option>Web Development</option>
                                    <option>MERN Stack</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Course Topic</label>
                            <input
                                type="text"
                                placeholder="What is primarily taught in your course?"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={basicData.topic}
                                onChange={(e) => setBasicData({ ...basicData, topic: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Course Language</label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    value={basicData.language}
                                    onChange={(e) => setBasicData({ ...basicData, language: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option>English</option>
                                    <option>Urdu</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Subtitle Language (Optional)</label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    value={basicData.subtitleLanguage}
                                    onChange={(e) => setBasicData({ ...basicData, subtitleLanguage: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option>English</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Course Level</label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    value={basicData.level}
                                    onChange={(e) => setBasicData({ ...basicData, level: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Duration</label>
                                <div className="flex border rounded-lg overflow-hidden">
                                    <input
                                        type="number"
                                        placeholder="Duration"
                                        className="w-full p-3 focus:outline-none"
                                        value={basicData.duration.value}
                                        onChange={(e) => setBasicData({ ...basicData, duration: { ...basicData.duration, value: e.target.value } })}
                                    />
                                    <select
                                        className="bg-gray-50 border-l p-2 focus:outline-none"
                                        value={basicData.duration.unit}
                                        onChange={(e) => setBasicData({ ...basicData, duration: { ...basicData.duration, unit: e.target.value } })}
                                    >
                                        <option>Hour</option>
                                        <option>Min</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <button className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => setActiveTab('advance')} className="px-6 py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600">Save & Next</button>
                        </div>
                    </div>
                )}

                {activeTab === 'advance' && (
                    <div className="space-y-8">
                        {/* Thumbnail & Trailer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-gray-700 font-medium mb-2">Course Thumbnail</h3>
                                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative group">
                                    {advanceData.thumbnail ? (
                                        <img src={advanceData.thumbnail} alt="Thumbnail" className="max-h-40 mb-4 rounded shadow" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
                                            <Upload size={32} />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 text-center mb-4">Upload your course thumbnail here. <span className="font-bold">Important guidelines:</span> 1200x800 pixels or 12:8 ratio. Supported format: .jpg, .jpeg, or .png</p>
                                    <label className="cursor-pointer px-4 py-2 bg-pink-100 text-pink-600 rounded font-medium hover:bg-pink-200 transition-colors flex items-center gap-2">
                                        {uploading.thumbnail ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                        {advanceData.thumbnail ? 'Change Image' : 'Upload Image'}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-700 font-medium mb-2">Course Trailer</h3>
                                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 relative">
                                    {advanceData.trailer ? (
                                        <div className="mb-4 text-green-600 flex items-center gap-2 font-medium">
                                            <Video size={20} /> Trailer Uploaded
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-400">
                                            <Video size={32} />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 text-center mb-4">Students who watch a well-made promo video are 5X more likely to enroll in your course. We've seen that statistic go up to 10X for exceptionally awesome videos.</p>
                                    <label className="cursor-pointer px-4 py-2 bg-pink-100 text-pink-600 rounded font-medium hover:bg-pink-200 transition-colors flex items-center gap-2">
                                        {uploading.trailer ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                        {advanceData.trailer ? 'Change Video' : 'Upload Video'}
                                        <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'trailer')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-gray-700 font-medium">Course Descriptions</h3>
                                <button
                                    onClick={generateAIDescription}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-purple-100 transition-all disabled:opacity-50"
                                >
                                    {aiLoading ? (
                                        <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                        <Sparkles size={14} className="fill-purple-600/20" />
                                    )}
                                    {aiLoading ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea
                                className="w-full border rounded-lg p-4 h-40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter your course description..."
                                value={advanceData.description}
                                onChange={(e) => setAdvanceData({ ...advanceData, description: e.target.value })}
                            ></textarea>
                        </div>

                        {/* Objectives */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-700 font-medium">What you will teach in this course ({advanceData.objectives.length}/8)</h3>
                                <button onClick={() => addField('objectives')} className="text-orange-500 text-sm font-medium hover:underline">+ Add new</button>
                            </div>
                            <div className="space-y-3">
                                {advanceData.objectives.map((item, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleAdvanceChange(index, 'objectives', e.target.value)}
                                            placeholder="What you will teach in this course..."
                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audience */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-700 font-medium">Target Audience ({advanceData.targetAudience.length}/8)</h3>
                                <button onClick={() => addField('targetAudience')} className="text-orange-500 text-sm font-medium hover:underline">+ Add new</button>
                            </div>
                            <div className="space-y-3">
                                {advanceData.targetAudience.map((item, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleAdvanceChange(index, 'targetAudience', e.target.value)}
                                            placeholder="Who this course is for..."
                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-700 font-medium">Course requirements ({advanceData.requirements.length}/8)</h3>
                                <button onClick={() => addField('requirements')} className="text-orange-500 text-sm font-medium hover:underline">+ Add new</button>
                            </div>
                            <div className="space-y-3">
                                {advanceData.requirements.map((item, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleAdvanceChange(index, 'requirements', e.target.value)}
                                            placeholder="What are the requirements..."
                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <button onClick={() => setActiveTab('basic')} className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-50">Previous</button>
                            <button onClick={() => setActiveTab('curriculum')} className="px-6 py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600">Save & Next</button>
                        </div>
                    </div>
                )}



                {activeTab === 'curriculum' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-semibold">Course Curriculum</h2>

                        </div>

                        <div className="space-y-6">
                            {curriculum.map((section, sIndex) => (
                                <div key={section.id} className="border rounded-lg bg-gray-50 p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3 w-full mr-4">
                                            <GripVertical className="text-gray-400 cursor-move" size={20} />
                                            <span className="font-bold text-gray-700 whitespace-nowrap">Section {String(sIndex + 1).padStart(2, '0')}:</span>
                                            <div className="flex-1 flex items-center gap-2">
                                                <FileText size={18} className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none w-full font-medium text-gray-800 transition-colors"
                                                    placeholder="Enter section title"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => addLecture(section.id)} className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Add Lecture">
                                                <Plus size={18} />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit Section">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete Section">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pl-4">
                                        {section.lectures.map((lecture, lIndex) => (
                                            <div className="flex flex-col gap-3 w-full">
                                                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 shadow-sm transition-all">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <GripVertical className="text-gray-300 group-hover:text-gray-400 cursor-move" size={18} />
                                                        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Lecture {lIndex + 1}:</span>
                                                        <input
                                                            type="text"
                                                            value={lecture.title}
                                                            onChange={(e) => updateLectureTitle(section.id, lecture.id, e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none w-full text-gray-700 transition-colors"
                                                            placeholder="Enter lecture title"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setActiveDropdown(activeDropdown?.lectureId === lecture.id ? null : { sectionId: section.id, lectureId: lecture.id })}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 text-sm font-medium rounded hover:bg-orange-100 transition-colors"
                                                            >
                                                                Add Content
                                                                <ChevronDown size={14} className={`transition-transform ${activeDropdown?.lectureId === lecture.id ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            {activeDropdown?.lectureId === lecture.id && (
                                                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                                                    <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                                                                        <Video size={16} className="text-blue-500" />
                                                                        Video
                                                                        <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'lecture', section.id, lecture.id)} />
                                                                    </label>
                                                                    <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                                                                        <File size={16} className="text-green-500" />
                                                                        File / PDF
                                                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => handleFileUpload(e, 'lecture', section.id, lecture.id)} />
                                                                    </label>
                                                                    <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                                                                        <Upload size={16} className="text-purple-500" />
                                                                        Image
                                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'lecture', section.id, lecture.id)} />
                                                                    </label>
                                                                    <button
                                                                        onClick={() => addContentItem(section.id, lecture.id, 'description')}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left text-sm text-gray-700 border-t border-gray-50"
                                                                    >
                                                                        <FileText size={16} className="text-pink-500" />
                                                                        Description
                                                                    </button>
                                                                    <button
                                                                        onClick={() => addContentItem(section.id, lecture.id, 'text')}
                                                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left text-sm text-gray-700"
                                                                    >
                                                                        <AlignLeft size={16} className="text-orange-500" />
                                                                        Text Note
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Contents List */}
                                                {lecture.contents && lecture.contents.length > 0 && (
                                                    <div className="ml-8 space-y-3">
                                                        {lecture.contents.map((content) => (
                                                            <div key={content.id} className="bg-gray-50 rounded border border-gray-100 overflow-hidden">
                                                                <div className="flex justify-between items-center p-2 px-4 bg-white/50 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        {content.type === 'video' && <Video size={14} className="text-blue-500" />}
                                                                        {content.type === 'file' && <File size={14} className="text-green-500" />}
                                                                        {content.type === 'image' && <Upload size={14} className="text-purple-500" />}
                                                                        {(content.type === 'text' || content.type === 'description') && <AlignLeft size={14} className="text-orange-500" />}
                                                                        <span className="text-gray-700 font-medium">{content.title || (content.type.charAt(0).toUpperCase() + content.type.slice(1))}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => removeContentItem(section.id, lecture.id, content.id)}
                                                                            className="text-gray-400 hover:text-red-500 p-1"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {(content.type === 'text' || content.type === 'description') && (
                                                                    <div className="p-3 bg-white">
                                                                        <textarea
                                                                            value={content.data}
                                                                            onChange={(e) => {
                                                                                setCurriculum(curriculum.map(s => s.id === section.id ? {
                                                                                    ...s,
                                                                                    lectures: s.lectures.map(l => l.id === lecture.id ? {
                                                                                        ...l,
                                                                                        contents: l.contents.map(c => c.id === content.id ? { ...c, data: e.target.value } : c)
                                                                                    } : l)
                                                                                } : s))
                                                                            }}
                                                                            placeholder={`Enter your ${content.type}...`}
                                                                            className="w-full text-sm border-none focus:ring-0 resize-none min-h-[60px]"
                                                                        ></textarea>
                                                                    </div>
                                                                )}

                                                                {(content.type === 'video' || content.type === 'image' || content.type === 'file') && content.data && (
                                                                    <div className="px-4 py-2 text-xs text-gray-500 truncate bg-gray-50 border-t border-gray-100">
                                                                        Path: {content.data}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {uploading.lecture[lecture.id] && (
                                                    <div className="ml-8 flex items-center gap-2 text-sm text-gray-500">
                                                        <Loader2 className="animate-spin" size={14} />
                                                        Uploading content...
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-orange-200 bg-orange-50 text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                                <Plus size={20} />
                                Add Section
                            </button>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <button onClick={() => setActiveTab('advance')} className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-50">Previous</button>
                            <button onClick={() => setActiveTab('publish')} className="px-6 py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600">Save & Next</button>
                        </div>
                    </div>
                )}

                {(activeTab !== 'basic' && activeTab !== 'advance' && activeTab !== 'curriculum' && activeTab !== 'publish') && (
                    <div className="text-center py-10 text-gray-500">
                        Content for {activeTab} information is coming soon...
                    </div>
                )}

                {activeTab === 'publish' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-semibold">Publish Course</h2>

                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-gray-700 font-medium mb-4">Message</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Welcome Message</label>
                                        <textarea
                                            value={publishData.welcomeMessage}
                                            onChange={(e) => setPublishData({ ...publishData, welcomeMessage: e.target.value })}
                                            placeholder="Enter course starting message here..."
                                            className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Congratulations Message</label>
                                        <textarea
                                            value={publishData.congratulationsMessage}
                                            onChange={(e) => setPublishData({ ...publishData, congratulationsMessage: e.target.value })}
                                            placeholder="Enter your course completed message here..."
                                            className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-gray-700 font-medium mb-4">Add Instructor (02)</h3>
                                <div className="max-w-xl">
                                    <div className="relative mb-6">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by username"
                                            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {publishData.additionalInstructors.map((inst) => (
                                            <div key={inst.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <img src={inst.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
                                                    <div>
                                                        <div className="font-medium text-gray-800">{inst.name}</div>
                                                        <div className="text-xs text-gray-500">{inst.role}</div>
                                                    </div>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <button onClick={() => setActiveTab('curriculum')} className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-50">Prev Step</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 flex items-center gap-2 disabled:bg-gray-400"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Publish Course'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateCourse;
