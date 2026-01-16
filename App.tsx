import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, MapPin, Mail, Phone, ChevronRight, 
  FileSearch, CheckCircle, Factory, TrendingUp, ArrowRight,
  User, LogOut, LayoutDashboard, Users, FileText, Settings, Lock,
  Activity, Globe, Clock, AlertCircle, Search, Bell, Plus, Edit2, Trash2, Save, Monitor, Image,
  Info, Upload, Eye, EyeOff, Layout, Calendar, CheckSquare, MoreHorizontal,
  ChevronDown, ChevronUp, GripVertical, Leaf, Wind, Zap, Droplets, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { TEAM_MEMBERS, SERVICES as INITIAL_SERVICES, EXPERIENCE_DATA, CLIENTS as INITIAL_CLIENTS, PROCESS_STEPS as INITIAL_PROCESS } from './constants';
import { TeamMember, ServiceItem, TimelineStep, ClientCategory } from './types';

// --- Extended Types ---

interface ExtendedTeamMember extends TeamMember {
  showOnHome: boolean;
  educationDetails?: {
    bachelor?: string;
    master?: string;
    doctoral?: string;
  };
}

interface AppSettings {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  faviconUrl: string;
  logoUrl: string;
}

interface PageContent {
  mottoTitle: string;
  mottoSubtitle: string;
  heroBgUrl: string; // New: Background image
  heroImageUrl: string; // New: Main floating image
  aboutText: string;
  aboutImageUrl: string; // New: About section image
  showHeroImage: boolean;
  servicesIntro: string;
  workflowIntro: string;
}

// --- Styles for Animation ---
const styles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-scroll {
    animation: scroll 40s linear infinite;
  }
  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9; 
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; 
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; 
  }
  /* Toggle Switch */
  .toggle-checkbox:checked {
    right: 0;
    border-color: #84cc16;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #84cc16;
  }
`;

// --- Shared Components ---

const Modal = ({ isOpen, onClose, children, title, size = 'md' }: { isOpen: boolean, onClose: () => void, children?: React.ReactNode, title?: string, size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} relative z-10 flex flex-col max-h-[90vh] animate-[fadeInUp_0.3s_ease-out]`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
           <h3 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
             <X size={24} className="text-slate-500" />
           </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const AlertModal = ({ isOpen, onClose, message, type = 'error' }: { isOpen: boolean, onClose: () => void, message: string, type?: 'error' | 'success' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative z-10 text-center animate-[fadeInUp_0.2s_ease-out]">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${type === 'error' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {type === 'error' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{type === 'error' ? 'Attention' : 'Success'}</h3>
                <p className="text-slate-600 mb-6">{message}</p>
                <button onClick={onClose} className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold">
                    Close
                </button>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative z-10 animate-[fadeInUp_0.2s_ease-out]">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold">Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-bold">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const SectionTitle: React.FC<{ children?: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
  <div className="mb-12 text-center fade-in-up">
    {subtitle && (
      <span className="block text-geco-green font-bold tracking-wider uppercase text-sm mb-2">
        {subtitle}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
      {children}
    </h2>
    <div className="w-24 h-1 bg-geco-green mx-auto mt-4 rounded-full"></div>
  </div>
);

// --- Icons Map ---
const ICON_MAP: any = {
    FileSearch: <FileSearch size={32} />,
    CheckCircle: <CheckCircle size={32} />,
    Factory: <Factory size={32} />,
    TrendingUp: <TrendingUp size={32} />,
    Leaf: <Leaf size={32} />,
    Wind: <Wind size={32} />,
    Zap: <Zap size={32} />,
    Droplets: <Droplets size={32} />,
    ShieldCheck: <ShieldCheck size={32} />
};

// --- Landing Page Components ---

const Hero = ({ content, logoUrl }: { content: PageContent, logoUrl: string }) => {
  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={content.heroBgUrl} 
          alt="Background" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-6 fade-in-up">
          <div className="inline-block bg-geco-green text-slate-900 px-4 py-1 rounded-full font-bold text-sm tracking-wide mb-2">
            Company Motto
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight whitespace-pre-line">
            {content.mottoTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-lg italic border-l-4 border-geco-green pl-6">
            "{content.mottoSubtitle}"
          </p>
          <div className="pt-8">
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-geco-green hover:bg-lime-500 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors duration-300 inline-flex items-center shadow-lg shadow-geco-green/20"
            >
              Discover Our Vision <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
        
        {content.showHeroImage && (
          <div className="hidden md:block relative fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="absolute -inset-4 bg-geco-green rounded-3xl transform rotate-3 opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img 
                      src={content.heroImageUrl} 
                      alt="Nature" 
                      className="w-full h-auto object-cover"
                  />
              </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Services = ({ services }: { services: ServiceItem[] }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || <FileSearch size={32} />;
  };

  return (
    <section id="services" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <SectionTitle subtitle="What We Do">Our Services</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-80 flex flex-col items-center justify-center text-center p-8 border border-slate-100 hover:border-geco-green hover:-translate-y-2 fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-slate-300 group-hover:text-geco-green transition-colors duration-500 mb-6 transform group-hover:scale-110">
                 {/* Manually sizing wrapper to control icon size if needed */}
                 <div className="w-16 h-16 flex items-center justify-center [&>svg]:w-16 [&>svg]:h-16">
                    {getIcon(service.iconName)}
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 group-hover:text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-geco-green font-bold uppercase tracking-wider mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                Click for Details
              </p>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.title || ''} size="lg">
         <div className="space-y-6">
            <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl mb-6">
                 <div className="text-geco-green [&>svg]:w-24 [&>svg]:h-24">
                    {selectedService && getIcon(selectedService.iconName)}
                 </div>
            </div>
            <div className="prose prose-slate max-w-none">
                <h4 className="text-xl font-bold text-slate-800 mb-4">Detailed Scope of Work:</h4>
                <ul className="grid md:grid-cols-2 gap-4">
                    {selectedService?.description.map((item, i) => (
                        <li key={i} className="flex items-start p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <CheckCircle className="w-5 h-5 text-geco-green mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
         </div>
      </Modal>
    </section>
  );
};

const Team = ({ members }: { members: ExtendedTeamMember[] }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ExtendedTeamMember | null>(null);
  
  const displayMembers = members.filter(m => m.showOnHome).slice(0, 4);

  // Helper for Org Chart Nodes
  const OrgNode = ({ role, person }: { role: string, person?: ExtendedTeamMember }) => (
     <div className="flex flex-col items-center">
        <div className={`border-2 ${person ? 'border-geco-green bg-white cursor-pointer hover:shadow-xl hover:scale-105' : 'border-slate-700 bg-slate-800'} p-2 rounded-xl transition-all w-48 text-center relative z-10`}
             onClick={() => { if(person) setSelectedMember(person); }}
        >
             {person ? (
                 <>
                    <img src={`https://picsum.photos/seed/${person.imageSeed}/100/100`} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-slate-100" alt={person.name} />
                    <p className="font-bold text-slate-900 text-sm leading-tight">{person.name}</p>
                    <p className="text-[10px] text-geco-green font-bold uppercase mt-1">{role}</p>
                 </>
             ) : (
                 <div className="py-4">
                     <p className="text-white font-bold text-sm">{role}</p>
                     <p className="text-[10px] text-slate-400 mt-1">Vacant / Structural</p>
                 </div>
             )}
        </div>
        {/* Connector Line Vertical */}
        <div className="w-0.5 h-8 bg-slate-300"></div>
     </div>
  );

  return (
    <section id="team" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <SectionTitle subtitle="Meet The Experts">Our Team</SectionTitle>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
          {displayMembers.map((member, index) => (
            <div key={index} className="bg-slate-50 rounded-xl overflow-hidden text-center hover:shadow-xl transition-shadow duration-300 group fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-32 h-32 mx-auto mt-8 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={`https://picsum.photos/seed/${member.imageSeed}/200/200`} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-xs font-bold text-geco-green uppercase tracking-wide">{member.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
            <button 
                onClick={() => setShowDetails(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg inline-flex items-center"
            >
                <Users className="mr-2" size={20} /> Team Details & Org Chart
            </button>
        </div>
      </div>

      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Organizational Structure" size="full">
         <div className="flex flex-col h-full bg-slate-50 rounded-lg p-8 overflow-auto">
            <div className="min-w-[800px] mx-auto flex flex-col items-center pt-8">
                {/* Level 1 */}
                <OrgNode role="Commissioner" person={members[0]} />
                
                {/* Level 2 */}
                <OrgNode role="President Director" person={members[1]} />

                {/* Level 3 Horizontal Bar */}
                <div className="relative w-3/4 h-8">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-300"></div>
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-slate-300"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-slate-300"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
                </div>

                {/* Level 3 Nodes */}
                <div className="flex justify-between w-3/4 space-x-4 -mt-1">
                    <OrgNode role="Operational Director" person={members[2]} />
                    <OrgNode role="Technical Director" person={members[3]} />
                    <OrgNode role="Finance Director" person={members[4]} />
                </div>
            </div>

            <div className="mt-16 border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">All Team Members</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {members.map((member, i) => (
                        <div key={i} onClick={() => setSelectedMember(member)} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer hover:border-geco-green">
                            <img src={`https://picsum.photos/seed/${member.imageSeed}/100/100`} alt={member.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                                <p className="text-[10px] text-geco-green font-bold uppercase">{member.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </Modal>

      {/* Individual Member Detail Popup */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="Member Profile" size="md">
         {selectedMember && (
             <div className="text-center">
                 <img src={`https://picsum.photos/seed/${selectedMember.imageSeed}/200/200`} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-slate-100 shadow-lg" alt={selectedMember.name} />
                 <h2 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h2>
                 <p className="text-geco-green font-bold uppercase tracking-wider mb-6">{selectedMember.title}</p>
                 
                 <div className="space-y-4 text-left bg-slate-50 p-6 rounded-xl">
                     <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Education</span>
                         <ul className="list-disc list-inside text-sm text-slate-700">
                             {selectedMember.educationDetails?.bachelor && <li>{selectedMember.educationDetails.bachelor}</li>}
                             {selectedMember.educationDetails?.master && <li>{selectedMember.educationDetails.master}</li>}
                             {selectedMember.educationDetails?.doctoral && <li>{selectedMember.educationDetails.doctoral}</li>}
                             {selectedMember.education.map((edu, i) => !selectedMember.educationDetails && <li key={i}>{edu}</li>)}
                         </ul>
                     </div>
                     <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Experience</span>
                         <p className="text-sm text-slate-700">{selectedMember.experience} Years of Professional Experience</p>
                     </div>
                     <div>
                         <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Expertise</span>
                         <div className="flex flex-wrap gap-2">
                             {selectedMember.expertise.split(',').map((skill, i) => (
                                 <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                     {skill.trim()}
                                 </span>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
         )}
      </Modal>
    </section>
  );
};

const Clients = ({ clientLogos, clientList }: { clientLogos: string[], clientList: ClientCategory[] }) => {
  const [showDetails, setShowDetails] = useState(false);
  const logos = clientLogos.length > 0 ? clientLogos : Array(8).fill("https://picsum.photos/seed/logo/200/100?grayscale");

  return (
    <section id="clients" className="py-20 bg-slate-50 scroll-mt-20 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
            <SectionTitle subtitle="Trusted Partners">Our Clients</SectionTitle>
        </div>
        
        <div className="relative w-full overflow-hidden mb-16 bg-white py-12 shadow-inner">
            <div className="flex w-[200%] animate-scroll">
                 {[...logos, ...logos].map((logo, idx) => (
                     <div key={idx} className="w-[12.5%] flex justify-center items-center px-8 opacity-60 hover:opacity-100 transition-opacity">
                         <img src={logo.includes('http') || logo.startsWith('data:') ? logo : `https://picsum.photos/seed/${idx}/200/100?grayscale`} className="max-h-16 w-auto object-contain mix-blend-multiply" alt="Client Logo" />
                     </div>
                 ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
        </div>

        <div className="text-center">
             <button 
                onClick={() => setShowDetails(true)}
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
            >
                View Client Detail Information
            </button>
        </div>

        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Client Portfolio & Experience" size="xl">
            <div className="bg-slate-100 p-6 rounded-lg mb-8">
                 <p className="text-slate-700 italic text-center">
                    "We have had the privilege of working with industry leaders across various sectors, ensuring environmental compliance and sustainable operations."
                 </p>
            </div>
            {/* Horizontal Layout for Clients to avoid scrolling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clientList.map((category, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col h-full">
                        <h3 className="font-bold text-sm text-geco-green mb-3 border-b pb-2 uppercase tracking-wide min-h-[40px] flex items-center">{category.category}</h3>
                        <ul className="space-y-2 flex-1">
                            {category.clients.map((client, cIdx) => (
                                <li key={cIdx} className="text-xs text-slate-700 flex items-start leading-tight">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2 mt-1 flex-shrink-0"></span>
                                    {client}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Modal>
    </section>
  )
}

const Workflow = ({ steps }: { steps: TimelineStep[] }) => {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    return (
      <section id="process" className="py-24 bg-slate-900 text-white scroll-mt-20">
        <div className="container mx-auto px-6">
            <SectionTitle subtitle="Workflow">Sanctioning Process</SectionTitle>
            
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-slate-700 rounded-full transform md:-translate-x-1/2"></div>
                
                {steps.map((step, index) => (
                    <div key={step.id} className={`relative flex items-center mb-8 last:mb-0 group ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                         
                         {/* Timeline Dot */}
                         <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-slate-800 border-4 border-geco-green rounded-full transform -translate-x-1/2 z-10 flex items-center justify-center font-bold text-geco-green shadow-lg shadow-geco-green/20">
                            {step.id}
                         </div>

                         {/* Content Card (Expandable) */}
                         <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-0`}>
                             <div 
                                className={`bg-slate-800 rounded-2xl border border-slate-700 hover:border-geco-green transition-all duration-300 overflow-hidden cursor-pointer ${expandedStep === step.id ? 'border-geco-green shadow-xl' : ''}`}
                                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                             >
                                 <div className="p-6 flex justify-between items-center">
                                    <h4 className="text-xl font-bold text-white">{step.title}</h4>
                                    {expandedStep === step.id ? <ChevronUp className="text-geco-green" /> : <ChevronDown className="text-slate-500" />}
                                 </div>
                                 
                                 {expandedStep === step.id && (
                                     <div className="px-6 pb-6 animate-[fadeInUp_0.3s_ease-out]">
                                         <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700 pt-4">
                                             {step.description}
                                         </p>
                                     </div>
                                 )}
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    );
};

const Footer = ({ settings }: { settings: AppSettings }) => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* Contact moved to left */}
                <div className="col-span-1 lg:col-span-2 order-2 lg:order-1">
                    <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider">Contact Us</h4>
                    <div className="grid md:grid-cols-2 gap-8">
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex items-center"><Mail className="w-5 h-5 mr-3 text-geco-green flex-shrink-0" /><span>{settings.contactEmail}</span></li>
                            <li className="flex items-center"><Phone className="w-5 h-5 mr-3 text-geco-green flex-shrink-0" /><span>{settings.contactPhone}</span></li>
                            <li className="flex items-start"><MapPin className="w-5 h-5 mr-3 text-geco-green flex-shrink-0 mt-1" /><span>{settings.contactAddress}</span></li>
                        </ul>
                        {/* Map Widget */}
                        <div className="rounded-xl overflow-hidden shadow-md border border-slate-100 h-48 bg-slate-100">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src="https://www.openstreetmap.org/export/embed.html?bbox=106.7%2C-6.3%2C107.0%2C-6.1&amp;layer=mapnik&amp;marker=-6.2%2C106.85" 
                                title="Map"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Company Branding */}
                <div className="col-span-1 lg:col-span-2 order-1 lg:order-2 lg:text-right">
                    <div className="flex flex-col lg:items-end mb-6">
                         <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto mb-4" /> 
                         <p className="text-slate-600 max-w-sm">
                            We help clients meet environmental laws and align with global sustainability best practices.
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
                <p>&copy; 2025 PT Global Ecocentric Konsultan. All rights reserved.</p>
            </div>
        </div>
    </footer>
  )
}

// --- Admin Components ---

const Dashboard = ({ 
    onLogout, 
    teamData, setTeamData, 
    appSettings, setAppSettings, 
    pageContent, setPageContent,
    services, setServices,
    workflow, setWorkflow,
    clientLogos, setClientLogos
}: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [frontendSubTab, setFrontendSubTab] = useState('headline');
  
  // Dirty state for frontend changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tempPageContent, setTempPageContent] = useState(pageContent);
  const [tempServices, setTempServices] = useState(services);
  const [tempWorkflow, setTempWorkflow] = useState(workflow);
  const [tempClientLogos, setTempClientLogos] = useState(clientLogos);

  // Success Notification
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Team CRUD State
  const [editingMember, setEditingMember] = useState<ExtendedTeamMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<ExtendedTeamMember | null>(null);
  const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);
  
  // Drag and Drop State for Services
  const [draggedServiceIndex, setDraggedServiceIndex] = useState<number | null>(null);

  // Refs for File Uploads
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const clientLogoInputRef = useRef<HTMLInputElement>(null);
  const memberPhotoRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);
  const heroImgInputRef = useRef<HTMLInputElement>(null);
  const aboutImgInputRef = useRef<HTMLInputElement>(null);

  // Other Modals
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setTempPageContent(pageContent);
    setTempServices(services);
    setTempWorkflow(workflow);
    setTempClientLogos(clientLogos);
    setHasUnsavedChanges(false);
  }, [pageContent, services, workflow, clientLogos, activeTab]);

  const handleSaveFrontend = () => {
    setPageContent(tempPageContent);
    setServices(tempServices);
    setWorkflow(tempWorkflow);
    setClientLogos(tempClientLogos);
    setHasUnsavedChanges(false);
    setShowSuccessModal(true);
  };

  const checkUnsaved = (newTab: string) => {
    if (activeTab === 'frontend' && hasUnsavedChanges) {
        setShowSaveWarning(true);
    } else {
        setActiveTab(newTab);
    }
  };

  const handleTeamToggleHome = (seed: number) => {
    setTeamData(teamData.map((m: ExtendedTeamMember) => 
        m.imageSeed === seed ? { ...m, showOnHome: !m.showOnHome } : m
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setter(result);
              setHasUnsavedChanges(true);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setTempClientLogos(prev => [...prev, result]);
              setHasUnsavedChanges(true);
          };
          reader.readAsDataURL(file);
      }
  };
  
  // Member Photo Upload
  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editingMember) {
           setEditingMember({...editingMember, imageSeed: Math.floor(Math.random() * 99999)});
      }
  };

  const handleServiceDragStart = (index: number) => {
      setDraggedServiceIndex(index);
  };

  const handleServiceDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedServiceIndex === null || draggedServiceIndex === index) return;
      
      const newServices = [...tempServices];
      const draggedItem = newServices[draggedServiceIndex];
      newServices.splice(draggedServiceIndex, 1);
      newServices.splice(index, 0, draggedItem);
      
      setTempServices(newServices);
      setDraggedServiceIndex(index);
      setHasUnsavedChanges(true);
  };

  const handleMemberDragStart = (index: number) => {
    setDraggedMemberIndex(index);
  };

  const handleMemberDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedMemberIndex === null || draggedMemberIndex === index) return;

    const newTeam = [...teamData];
    const draggedItem = newTeam[draggedMemberIndex];
    newTeam.splice(draggedMemberIndex, 1);
    newTeam.splice(index, 0, draggedItem);

    setTeamData(newTeam);
    setDraggedMemberIndex(index);
  };

  const COLORS = ['#84cc16', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#06b6d4', '#eab308', '#64748b'];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col z-20 shadow-xl">
        <div className="p-8 border-b border-slate-200 bg-white">
             <div className="flex items-center space-x-2">
                {/* Fixed Logo: Removed brightness-0 invert filter */}
                <img src={appSettings.logoUrl} className="h-8 w-auto" alt="Logo" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Admin</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-geco-green">Portal</span>
                </div>
            </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'team', label: 'Team Manager', icon: Users },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'frontend', label: 'Front-End', icon: Monitor },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => checkUnsaved(item.id)}
              className={`flex items-center space-x-3 p-3 w-full rounded-lg font-bold transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-geco-green text-slate-900 shadow-lg shadow-geco-green/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950">
             <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left p-3 text-red-400 hover:bg-slate-800 rounded-lg text-sm font-bold flex items-center transition-colors">
                <LogOut size={18} className="mr-2"/> Logout
             </button>
             <p className="text-[10px] text-slate-600 text-center mt-4">&copy; 2025 GECO Admin</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 h-screen overflow-y-auto bg-slate-50/50 p-8">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
           <div className="max-w-7xl mx-auto animate-[fadeInUp_0.3s_ease-out]">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h2>
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                   {[
                     { label: 'Total Revenue', value: '$124k', icon: <Activity className="text-white" />, color: 'bg-blue-500', trend: '+12.5%' },
                     { label: 'Active Projects', value: '38', icon: <FileText className="text-white" />, color: 'bg-purple-500', trend: '+4.2%' },
                     { label: 'Total Clients', value: '1,294', icon: <Users className="text-white" />, color: 'bg-orange-500', trend: '+8.1%' },
                     { label: 'Web Visits', value: '42.5k', icon: <Globe className="text-white" />, color: 'bg-geco-green', trend: '+22%' },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl shadow-lg shadow-gray-200 ${stat.color}`}>{stat.icon}</div>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center">
                            <TrendingUp size={12} className="mr-1" /> {stat.trend}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                     </div>
                   ))}
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Traffic Trend</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{name:'Mon',v:120},{name:'Tue',v:180},{name:'Wed',v:150},{name:'Thu',v:250},{name:'Fri',v:310},{name:'Sat',v:190},{name:'Sun',v:140}]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Area type="monotone" dataKey="v" stroke="#84cc16" fill="#84cc16" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Project Distribution</h3>
                    <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={EXPERIENCE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {EXPERIENCE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
           </div>
        )}

        {/* --- ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
            <div className="max-w-7xl mx-auto animate-[fadeInUp_0.3s_ease-out]">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Analytics & Reports</h2>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Globe className="mr-2 text-blue-500"/> Geographic Distribution</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[{name:'Jakarta', v:450}, {name:'Surabaya', v:320}, {name:'Bandung', v:210}, {name:'Medan', v:180}, {name:'Bali', v:150}]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                                    <Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Clock className="mr-2 text-purple-500"/> Average Session Duration</h3>
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{name:'Mon',v:2.4},{name:'Tue',v:3.1},{name:'Wed',v:2.8},{name:'Thu',v:4.5},{name:'Fri',v:3.9},{name:'Sat',v:1.8},{name:'Sun',v:2.1}]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                                    <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={3} dot={{r:4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
            <div className="max-w-7xl mx-auto animate-[fadeInUp_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Active Projects</h2>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-slate-800">
                        <Plus size={18} className="mr-2" /> New Project
                    </button>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-600 text-sm">Project Name</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Client</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Status</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Progress</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Due Date</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'AMDAL Coal Mining Block A', client: 'PT Mineral Trobos', status: 'In Progress', progress: 65, date: 'Oct 24, 2025' },
                                    { name: 'UKL-UPL Warehouse Expansion', client: 'Wilmar Group', status: 'Review', progress: 90, date: 'Aug 12, 2025' },
                                    { name: 'Environmental Audit Q3', client: 'PT Indonesia Power', status: 'Pending', progress: 10, date: 'Nov 01, 2025' },
                                    { name: 'Hazardous Waste Feasibility', client: 'PT BSSTEC', status: 'In Progress', progress: 40, date: 'Sep 15, 2025' },
                                ].map((project, i) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">{project.name}</td>
                                        <td className="p-4 text-slate-600">{project.client}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                                ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                                  project.status === 'Review' ? 'bg-orange-100 text-orange-700' :
                                                  project.status === 'Pending' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                                                <div className="bg-geco-green h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1 inline-block">{project.progress}%</span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">{project.date}</td>
                                        <td className="p-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800"><MoreHorizontal size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- FRONT-END MANAGER --- */}
        {activeTab === 'frontend' && (
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Front-End Manager</h2>
                    {hasUnsavedChanges && (
                        <div className="flex items-center space-x-4 animate-pulse">
                            <span className="text-orange-500 font-bold text-sm">Unsaved Changes</span>
                            <button onClick={handleSaveFrontend} className="bg-geco-green hover:bg-lime-500 text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center shadow-lg">
                                <Save size={18} className="mr-2" /> Save Changes
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
                        {['headline', 'about', 'services', 'workflow', 'clients'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFrontendSubTab(tab)}
                                className={`px-6 py-4 font-bold text-sm uppercase tracking-wider ${frontendSubTab === tab ? 'bg-white text-geco-green border-t-2 border-geco-green' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-8">
                        {frontendSubTab === 'headline' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Motto</label>
                                    <input className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900" value={tempPageContent.mottoTitle} onChange={e => {setTempPageContent({...tempPageContent, mottoTitle: e.target.value}); setHasUnsavedChanges(true)}}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Motto Subtitle</label>
                                    <textarea rows={2} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900" value={tempPageContent.mottoSubtitle} onChange={e => {setTempPageContent({...tempPageContent, mottoSubtitle: e.target.value}); setHasUnsavedChanges(true)}}/>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Background Image</label>
                                        <div onClick={() => heroBgInputRef.current?.click()} className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                            {tempPageContent.heroBgUrl.startsWith('data:') ? <img src={tempPageContent.heroBgUrl} className="h-full w-full object-cover rounded-lg"/> : <span className="text-slate-400 text-sm">Click to change background</span>}
                                            <input type="file" ref={heroBgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (val) => setTempPageContent({...tempPageContent, heroBgUrl: val}))} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Main Hero Image</label>
                                        <div onClick={() => heroImgInputRef.current?.click()} className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                            {tempPageContent.heroImageUrl ? <img src={tempPageContent.heroImageUrl} className="h-full w-full object-contain rounded-lg"/> : <span className="text-slate-400 text-sm">Click to change hero image</span>}
                                            <input type="file" ref={heroImgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (val) => setTempPageContent({...tempPageContent, heroImageUrl: val}))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {frontendSubTab === 'about' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">About Us Description</label>
                                    <textarea rows={6} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900" value={tempPageContent.aboutText} onChange={e => {setTempPageContent({...tempPageContent, aboutText: e.target.value}); setHasUnsavedChanges(true)}}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">About Section Image</label>
                                    <div onClick={() => aboutImgInputRef.current?.click()} className="h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                         {tempPageContent.aboutImageUrl ? <img src={tempPageContent.aboutImageUrl} className="h-full w-full object-cover rounded-lg"/> : <div className="text-center text-slate-400"><Image className="mx-auto mb-2"/><span className="text-sm">Click to upload about image</span></div>}
                                         <input type="file" ref={aboutImgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (val) => setTempPageContent({...tempPageContent, aboutImageUrl: val}))} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {frontendSubTab === 'services' && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center">
                                    <Info size={16} className="mr-2 text-blue-500"/>
                                    Drag items by the handle to reorder. Icons update in real-time.
                                </p>
                                {tempServices.map((service: ServiceItem, idx: number) => (
                                    <div 
                                        key={service.id} 
                                        draggable
                                        onDragStart={() => handleServiceDragStart(idx)}
                                        onDragOver={(e) => handleServiceDragOver(e, idx)}
                                        className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm flex items-start space-x-4 group hover:border-geco-green transition-colors"
                                    >
                                        <div className="cursor-move text-slate-300 hover:text-slate-600 mt-2">
                                            <GripVertical size={24} />
                                        </div>
                                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                                                <input 
                                                    className="w-full p-2 border border-slate-200 rounded bg-white text-slate-900 font-semibold"
                                                    value={service.title}
                                                    onChange={(e) => {
                                                        const newServices = [...tempServices];
                                                        newServices[idx] = { ...service, title: e.target.value };
                                                        setTempServices(newServices);
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Description (List Items)</label>
                                                <textarea 
                                                    rows={3}
                                                    className="w-full p-2 border border-slate-200 rounded bg-white text-slate-900 text-sm"
                                                    value={service.description.join('\n')}
                                                    onChange={(e) => {
                                                        const newServices = [...tempServices];
                                                        newServices[idx] = { ...service, description: e.target.value.split('\n') };
                                                        setTempServices(newServices);
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Select Icon</label>
                                                <div className="relative">
                                                    <select 
                                                        className="w-full p-2 pl-10 border border-slate-200 rounded bg-white text-slate-900 appearance-none"
                                                        value={service.iconName}
                                                        onChange={(e) => {
                                                            const newServices = [...tempServices];
                                                            newServices[idx] = { ...service, iconName: e.target.value as any };
                                                            setTempServices(newServices);
                                                            setHasUnsavedChanges(true);
                                                        }}
                                                    >
                                                        {Object.keys(ICON_MAP).map(icon => (
                                                            <option key={icon} value={icon}>{icon}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute left-2 top-2 pointer-events-none text-geco-green">
                                                        {React.cloneElement(ICON_MAP[service.iconName] || <FileSearch/>, { size: 20 })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {frontendSubTab === 'workflow' && (
                            <div className="space-y-6">
                                {tempWorkflow.map((step: TimelineStep, idx: number) => (
                                    <div key={step.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg bg-white">
                                        <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-full font-bold text-slate-500 flex-shrink-0">
                                            {step.id}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input 
                                                className="w-full p-2 border border-slate-300 rounded text-slate-900 font-bold"
                                                value={step.title}
                                                onChange={(e) => {
                                                    const newWorkflow = [...tempWorkflow];
                                                    newWorkflow[idx] = { ...step, title: e.target.value };
                                                    setTempWorkflow(newWorkflow);
                                                    setHasUnsavedChanges(true);
                                                }}
                                            />
                                            <textarea 
                                                rows={2}
                                                className="w-full p-2 border border-slate-300 rounded text-slate-600 text-sm"
                                                value={step.description}
                                                onChange={(e) => {
                                                    const newWorkflow = [...tempWorkflow];
                                                    newWorkflow[idx] = { ...step, description: e.target.value };
                                                    setTempWorkflow(newWorkflow);
                                                    setHasUnsavedChanges(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {frontendSubTab === 'clients' && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Manage Client Logos</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                                    {tempClientLogos.map((logo: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-video bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-4">
                                            <img src={logo} alt={`Client ${idx}`} className="max-w-full max-h-full object-contain" />
                                            <button 
                                                onClick={() => {
                                                    const newLogos = tempClientLogos.filter((_: any, i: number) => i !== idx);
                                                    setTempClientLogos(newLogos);
                                                    setHasUnsavedChanges(true);
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <div 
                                        onClick={() => clientLogoInputRef.current?.click()}
                                        className="aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-geco-green hover:text-geco-green hover:bg-green-50 transition-all cursor-pointer"
                                    >
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-xs font-bold">Upload Logo</span>
                                        <input 
                                            type="file" 
                                            ref={clientLogoInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleClientLogoUpload}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- TEAM MANAGER --- */}
        {activeTab === 'team' && (
            <div className="max-w-6xl mx-auto">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Team Management</h2>
                    <button 
                        onClick={() => {
                            setEditingMember({
                                name: '', title: '', 
                                education: [], educationDetails: { bachelor: '', master: '', doctoral: '' },
                                experience: '', expertise: '', 
                                imageSeed: Math.floor(Math.random() * 1000), showOnHome: true
                            });
                            setTagInput('');
                            setIsEditModalOpen(true);
                        }}
                        className="bg-geco-green hover:bg-lime-500 text-slate-900 font-bold py-2 px-6 rounded-lg flex items-center shadow-md"
                    >
                        <Plus size={18} className="mr-2" /> Add Member
                    </button>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center">
                    <Info size={16} className="mr-2 text-blue-500"/>
                    Drag team members to reorder their position in the organization chart and list.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamData.map((member: ExtendedTeamMember, index: number) => (
                        <div 
                            key={member.imageSeed} 
                            draggable
                            onDragStart={() => handleMemberDragStart(index)}
                            onDragOver={(e) => handleMemberDragOver(e, index)}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col cursor-move hover:border-geco-green transition-colors"
                        >
                            <div className="p-6 flex items-start space-x-4">
                                <div className="mt-2 text-slate-300">
                                    <GripVertical size={20}/>
                                </div>
                                <img src={`https://picsum.photos/seed/${member.imageSeed}/100/100`} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                                <div>
                                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                                    <p className="text-xs text-geco-green font-bold uppercase">{member.title}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                                {/* Toggle Switch for Shown on Home */}
                                <div className="flex items-center">
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" id={`toggle-${member.imageSeed}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" checked={member.showOnHome} onChange={() => handleTeamToggleHome(member.imageSeed)}/>
                                        <label htmlFor={`toggle-${member.imageSeed}`} className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${member.showOnHome ? 'bg-geco-green' : 'bg-slate-300'}`}></label>
                                    </div>
                                    <label htmlFor={`toggle-${member.imageSeed}`} className={`text-xs font-bold ${member.showOnHome ? 'text-geco-green drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]' : 'text-slate-400'}`}>
                                        {member.showOnHome ? 'Active' : 'Hidden'}
                                    </label>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <button onClick={() => { setEditingMember(member); setTagInput(''); setIsEditModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={16}/></button>
                                    <button onClick={() => setMemberToDelete(member)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- SETTINGS --- */}
        {activeTab === 'settings' && (
             <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">System Settings</h2>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Image className="mr-2"/> Brand Identity</h3>
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo</label>
                            <div 
                                onClick={() => logoInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col items-center justify-center h-48"
                            >
                                {appSettings.logoUrl ? (
                                    <img src={appSettings.logoUrl} className="h-16 mb-4 object-contain" /> 
                                ) : <Upload className="text-slate-400 mb-2" size={32}/>}
                                <span className="text-sm text-slate-500 font-bold group-hover:text-geco-green flex items-center">
                                    <Upload size={14} className="mr-1"/> Upload Logo
                                </span>
                                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (val) => setAppSettings({...appSettings, logoUrl: val}))} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Website Favicon</label>
                            <div 
                                onClick={() => faviconInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col items-center justify-center h-48"
                            >
                                {appSettings.faviconUrl ? (
                                     <img src={appSettings.faviconUrl} className="w-16 h-16 mb-4 object-contain" />
                                ) : <div className="w-16 h-16 bg-geco-green rounded mb-4"></div>}
                                <span className="text-sm text-slate-500 font-bold group-hover:text-geco-green flex items-center">
                                    <Upload size={14} className="mr-1"/> Upload Favicon
                                </span>
                                <input type="file" ref={faviconInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (val) => setAppSettings({...appSettings, faviconUrl: val}))} />
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </main>

      {/* --- MODALS --- */}

      <ConfirmModal 
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={onLogout}
          title="Confirm Logout"
          message="Are you sure you want to end your session?"
      />

      <ConfirmModal 
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={() => {
              if (memberToDelete) {
                  setTeamData(teamData.filter(m => m.imageSeed !== memberToDelete.imageSeed));
                  setMemberToDelete(null);
              }
          }}
          title="Delete Team Member"
          message={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
      />

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingMember?.name ? 'Edit Team Member' : 'Add New Member'} size="lg">
        {editingMember && (
            <form onSubmit={(e) => {
                e.preventDefault();
                // Merge current tag input if not empty
                let finalExpertise = editingMember.expertise;
                if(tagInput.trim()) {
                   const tags = finalExpertise ? finalExpertise.split(',').map(t=>t.trim()) : [];
                   tags.push(tagInput.trim());
                   finalExpertise = tags.join(', ');
                }

                // Construct full education string for backwards compatibility if needed, but primarily rely on educationDetails
                const eduArray = [];
                if(editingMember.educationDetails?.bachelor) eduArray.push(editingMember.educationDetails.bachelor);
                if(editingMember.educationDetails?.master) eduArray.push(editingMember.educationDetails.master);
                if(editingMember.educationDetails?.doctoral) eduArray.push(editingMember.educationDetails.doctoral);

                const finalMember = {
                    ...editingMember,
                    expertise: finalExpertise,
                    education: eduArray
                };

                const exists = teamData.find((m: any) => m.imageSeed === editingMember.imageSeed);
                if(exists) setTeamData(teamData.map((m: any) => m.imageSeed === editingMember.imageSeed ? finalMember : m));
                else setTeamData([...teamData, finalMember]);
                setIsEditModalOpen(false);
            }} className="space-y-6">
                
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => memberPhotoRef.current?.click()}>
                        <img src={`https://picsum.photos/seed/${editingMember.imageSeed}/200/200`} className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-md group-hover:opacity-75 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <Upload className="text-white drop-shadow-md" size={32}/>
                        </div>
                        <input type="file" ref={memberPhotoRef} className="hidden" onChange={handleMemberPhotoUpload} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name (Max 100 char)</label>
                        <input maxLength={100} className="w-full p-2 border border-slate-300 rounded bg-white" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} required placeholder="e.g. John Doe, M.Sc" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Position / Title (Max 200 char)</label>
                        <input maxLength={200} className="w-full p-2 border border-slate-300 rounded bg-white" value={editingMember.title} onChange={e => setEditingMember({...editingMember, title: e.target.value})} required placeholder="e.g. Senior Environmental Consultant"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Years of Experience</label>
                        <input type="number" max="99" className="w-full p-2 border border-slate-300 rounded bg-white" value={editingMember.experience.replace(/[^0-9]/g, '')} onChange={e => setEditingMember({...editingMember, experience: e.target.value.slice(0, 2)})} required placeholder="e.g. 10"/>
                    </div>
                </div>

                {/* Education Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Education Background</label>
                    <div className="space-y-3">
                        {['bachelor', 'master', 'doctoral'].map((level) => (
                            <div key={level}>
                                <div className="flex items-center mb-1">
                                    <CheckSquare size={16} className={`mr-2 ${editingMember.educationDetails?.[level as keyof typeof editingMember.educationDetails] ? 'text-geco-green' : 'text-slate-300'}`} />
                                    <span className="text-xs font-bold uppercase text-slate-600">{level} Degree</span>
                                </div>
                                <input 
                                    maxLength={200}
                                    placeholder={`Enter ${level} degree details...`}
                                    className="w-full p-2 text-sm border border-slate-300 rounded bg-white"
                                    value={editingMember.educationDetails?.[level as keyof typeof editingMember.educationDetails] || ''}
                                    onChange={(e) => {
                                        setEditingMember({
                                            ...editingMember,
                                            educationDetails: {
                                                ...editingMember.educationDetails,
                                                [level]: e.target.value
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expertise Tags */}
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Expertise (Comma separated tags)</label>
                     <div className="border border-slate-300 rounded bg-white p-2 flex flex-wrap gap-2">
                         {editingMember.expertise.split(',').map((tag, i) => tag.trim() && (
                             <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold flex items-center">
                                 {tag}
                                 <button type="button" onClick={() => {
                                     const tags = editingMember.expertise.split(',').filter((_, idx) => idx !== i);
                                     setEditingMember({...editingMember, expertise: tags.join(', ')});
                                 }} className="ml-1 hover:text-blue-800"><X size={12}/></button>
                             </span>
                         ))}
                         <input 
                            className="flex-1 outline-none min-w-[120px] text-sm" 
                            placeholder="Type and press comma..." 
                            value={tagInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.endsWith(',')) {
                                    const newTag = val.slice(0, -1).trim();
                                    if (newTag) {
                                        const current = editingMember.expertise ? editingMember.expertise + ', ' : '';
                                        setEditingMember({...editingMember, expertise: current + newTag});
                                    }
                                    setTagInput('');
                                } else {
                                    setTagInput(val);
                                }
                            }}
                         />
                     </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-geco-green hover:text-slate-900 transition-colors">
                        Save Member Profile
                    </button>
                </div>
            </form>
        )}
      </Modal>

      {/* Success Notification Modal */}
      <AlertModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        message="Changes saved successfully!"
        type="success"
      />

    </div>
  );
};

const App = () => {
  // State for Data
  const [teamData, setTeamData] = useState<ExtendedTeamMember[]>(TEAM_MEMBERS.map(m => ({ ...m, showOnHome: true })));
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [clientLogos, setClientLogos] = useState<string[]>([]); // Initialize empty or with some default
  const [clientList, setClientList] = useState<ClientCategory[]>(INITIAL_CLIENTS);
  const [workflow, setWorkflow] = useState<TimelineStep[]>(INITIAL_PROCESS);

  // App Settings & Content
  const [appSettings, setAppSettings] = useState<AppSettings>({
    contactEmail: "info@geco.co.id",
    contactPhone: "+62 21 555 0199",
    contactAddress: "Gedung GECO, Jl. Sudirman Kav. 52-53, Jakarta Selatan",
    faviconUrl: "",
    logoUrl: "https://via.placeholder.com/150x50?text=GECO+Logo" // Placeholder
  });

  const [pageContent, setPageContent] = useState<PageContent>({
    mottoTitle: "Sustainable Solutions\nFor A Greener Future",
    mottoSubtitle: "Integrating environmental compliance with business growth.",
    heroBgUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
    heroImageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000&auto=format&fit=crop",
    aboutText: "PT Global Ecocentric Konsultan (GECO) is a leading environmental consultancy firm in Indonesia. We specialize in AMDAL, UKL-UPL, and environmental compliance for mining, manufacturing, and infrastructure sectors.",
    aboutImageUrl: "",
    showHeroImage: true,
    servicesIntro: "We provide comprehensive environmental services.",
    workflowIntro: "Our step-by-step process ensures compliance."
  });

  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initial Load (Simulation)
  useEffect(() => {
     // Inject styles
     const styleSheet = document.createElement("style");
     styleSheet.innerText = styles;
     document.head.appendChild(styleSheet);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple direct check without hashing as requested
    if (username.trim() === "dedi" && password.trim() === "veki") {
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginError('');
        setUsername('');
        setPassword('');
    } else {
        setLoginError('Invalid credentials. Access denied.');
    }
  };

  const handleLogout = () => {
      setIsAdmin(false);
  };

  if (isAdmin) {
      return (
          <Dashboard 
             onLogout={handleLogout}
             teamData={teamData} setTeamData={setTeamData}
             appSettings={appSettings} setAppSettings={setAppSettings}
             pageContent={pageContent} setPageContent={setPageContent}
             services={services} setServices={setServices}
             workflow={workflow} setWorkflow={setWorkflow}
             clientLogos={clientLogos} setClientLogos={setClientLogos}
          />
      );
  }

  return (
    <div className="font-sans text-slate-800 antialiased">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                     {appSettings.logoUrl && !appSettings.logoUrl.includes('placeholder') ? <img src={appSettings.logoUrl} alt="GECO" className="h-10 w-auto" /> : <span className="text-2xl font-extrabold text-slate-900 tracking-tighter">GECO<span className="text-geco-green">.</span></span>}
                </div>
                
                <div className="hidden md:flex space-x-8 items-center">
                    {['Home', 'Services', 'Team', 'Clients', 'Process'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-600 hover:text-geco-green uppercase tracking-wider transition-colors">
                            {item}
                        </a>
                    ))}
                    <button onClick={() => setShowLoginModal(true)} className="flex items-center text-slate-400 hover:text-slate-900 transition-colors">
                        <Lock size={18} />
                    </button>
                </div>

                {/* Mobile Menu Button - simplified for this demo */}
                <button className="md:hidden text-slate-900">
                    <Menu size={24} />
                </button>
            </div>
        </nav>

        <Hero content={pageContent} logoUrl={appSettings.logoUrl} />
        
        <div id="about" className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center scroll-mt-20">
             <div className="order-2 md:order-1">
                 <SectionTitle subtitle="Who We Are">About GECO</SectionTitle>
                 <p className="text-lg text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                     {pageContent.aboutText}
                 </p>
                 <div className="grid grid-cols-2 gap-6 mt-8">
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                         <h4 className="text-3xl font-black text-geco-green mb-1">10+</h4>
                         <p className="text-sm font-bold text-slate-600">Years Experience</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                         <h4 className="text-3xl font-black text-geco-green mb-1">500+</h4>
                         <p className="text-sm font-bold text-slate-600">Projects Completed</p>
                     </div>
                 </div>
             </div>
             <div className="order-1 md:order-2">
                 <img src={pageContent.aboutImageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=1000&auto=format&fit=crop"} alt="About Us" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover h-[500px]" />
             </div>
        </div>

        <Services services={services} />
        
        <Team members={teamData} />
        
        <Clients clientLogos={clientLogos} clientList={clientList} />

        <Workflow steps={workflow} />

        <Footer settings={appSettings} />

        {/* Login Modal */}
        <Modal isOpen={showLoginModal} onClose={() => { setShowLoginModal(false); setLoginError(''); }} title="Admin Access">
            <form onSubmit={handleLogin} className="space-y-6 pt-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-geco-green focus:border-transparent outline-none transition-all" 
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            type="password" 
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-geco-green focus:border-transparent outline-none transition-all" 
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                
                {loginError && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {loginError}
                    </div>
                )}

                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-geco-green hover:text-slate-900 transition-colors shadow-lg">
                    Login to Dashboard
                </button>
            </form>
        </Modal>
    </div>
  );
}

export default App;