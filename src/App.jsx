import { db } from "./firebase";
import React, { useState} from "react";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useRef,useMemo } from "react";
import {
  Heart, MessageCircle, Bookmark, Share2, Search, Bell, Home, Users,
  Briefcase, Calendar, LogOut, Plus, Edit, Trash2, X, Send, Menu,
  Moon, Sun, TrendingUp, UserPlus, Award, Globe, Check, ChevronDown,
  BarChart2, Settings, Zap, BookOpen, Hash, Sparkles, MapPin, Clock,
  ExternalLink, ArrowLeft, CheckCircle, Star, Mail
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
function GS({ dark }) {
  return (

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      :root{
        --bg:#07071a;--bg2:#0c0c24;--bg3:#131330;
        --glass:rgba(255,255,255,0.04);--glass2:rgba(255,255,255,0.07);--glass3:rgba(255,255,255,0.11);
        --border:rgba(255,255,255,0.08);--border2:rgba(139,92,246,0.25);--border3:rgba(139,92,246,0.4);
        --a:#7c3aed;--a2:#a855f7;--a3:#c4b5fd;
        --glow:rgba(124,58,237,0.2);--glow2:rgba(168,85,247,0.12);
        --t1:#f0eeff;--t2:#94a3b8;--t3:#4f566b;
        --grn:#10b981;--yel:#f59e0b;--red:#ef4444;--blu:#3b82f6;
        --sb:260px;
      }
      ${!dark ? `
      :root{
        --bg:#f8f7ff;--bg2:#ede9fe;--bg3:#ddd6fe;
        --glass:rgba(255,255,255,0.85);--glass2:rgba(255,255,255,0.95);--glass3:rgba(255,255,255,1);
        --border:rgba(0,0,0,0.07);--border2:rgba(124,58,237,0.2);
        --t1:#1e1040;--t2:#4c3b8a;--t3:#7c6aaa;
        --glow:rgba(124,58,237,0.08);
      }` : ''}
      html,body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;transition:background 0.3s,color 0.3s;}
      h1,h2,h3,h4,h5{font-family:'Outfit',sans-serif;}
      .gc{background:var(--glass);border:1px solid var(--border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:20px;}
      .gc:hover{background:var(--glass2);}
      .gca{background:var(--glass2);border:1px solid var(--border2);backdrop-filter:blur(20px);border-radius:20px;}
      input.inp,textarea.inp{background:var(--glass);border:1px solid var(--border);color:var(--t1);padding:12px 16px;border-radius:12px;font-size:14px;font-family:'DM Sans',sans-serif;width:100%;outline:none;transition:border 0.2s,box-shadow 0.2s;}
      input.inp:focus,textarea.inp:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--glow);}
      input.inp::placeholder,textarea.inp::placeholder{color:var(--t3);}
      textarea.inp{resize:none;}
      .bp{background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;border:none;padding:11px 22px;border-radius:12px;font-weight:600;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;}
      .bp:hover{transform:translateY(-1px);box-shadow:0 8px 24px var(--glow);}
      .bp:active{transform:translateY(0);}
      .bo{background:transparent;color:var(--t1);border:1px solid var(--border);padding:10px 20px;border-radius:12px;font-weight:500;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;}
      .bo:hover{background:var(--glass2);border-color:var(--border2);}
      .bi{background:transparent;border:none;color:var(--t2);cursor:pointer;padding:7px;border-radius:10px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
      .bi:hover{background:var(--glass2);color:var(--t1);}
      .nl{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:12px;color:var(--t2);cursor:pointer;transition:all 0.15s;font-size:14px;font-weight:500;margin-bottom:2px;user-select:none;}
      .nl:hover{background:var(--glass);color:var(--t1);}
      .nl.active{background:rgba(124,58,237,0.15);color:var(--a3);border:1px solid var(--border2);}
      .fb{padding:7px 17px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
      .fb.fol{background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;border:none;}
      .fb.fol:hover{box-shadow:0 4px 15px var(--glow);}
      .fb.fing{background:transparent;color:var(--t2);border:1px solid var(--border);}
      .fb.fing:hover{background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);}
      .sc{background:rgba(124,58,237,0.12);color:var(--a3);border:1px solid rgba(124,58,237,0.2);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;}
      .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;}
      .ba{background:rgba(139,92,246,0.15);color:#c4b5fd;border:1px solid rgba(139,92,246,0.3);}
      .bs{background:rgba(59,130,246,0.15);color:#93c5fd;border:1px solid rgba(59,130,246,0.3);}
      .bf{background:rgba(245,158,11,0.15);color:#fcd34d;border:1px solid rgba(245,158,11,0.3);}
      .bad{background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);}
      .bv{background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3);}
      .bm{background:rgba(236,72,153,0.15);color:#f9a8d4;border:1px solid rgba(236,72,153,0.3);}
      .pab{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--t2);font-size:13px;cursor:pointer;padding:7px 11px;border-radius:10px;transition:all 0.15s;font-family:'DM Sans',sans-serif;font-weight:500;}
      .pab:hover{background:var(--glass2);color:var(--t1);}
      .pab.lkd{color:#f87171;}.pab.lkd:hover{background:rgba(239,68,68,0.1);}
      .pab.svd{color:var(--a3);}.pab.svd:hover{background:rgba(124,58,237,0.1);}
      .sidebar{width:var(--sb);min-height:100vh;background:var(--bg2);border-right:1px solid var(--border);position:fixed;left:0;top:0;display:flex;flex-direction:column;z-index:100;overflow-y:auto;transition:transform 0.3s;}
      .mwrap{margin-left:var(--sb);min-height:100vh;transition:margin 0.3s;}
      .tbar{position:sticky;top:0;z-index:50;height:60px;display:flex;align-items:center;padding:0 24px;gap:14px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
      .tbar{background:${dark ? 'rgba(7,7,26,0.88)' : 'rgba(248,247,255,0.88)'};}
      .moverlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi 0.2s ease;}
      .mbox{background:var(--bg2);border:1px solid var(--border);border-radius:24px;padding:28px;width:100%;max-width:540px;max-height:88vh;overflow-y:auto;animation:fu 0.3s ease;}
      .cib{display:flex;align-items:center;gap:9px;padding:8px 12px;background:var(--glass);border:1px solid var(--border);border-radius:50px;}
      .cib input{background:none;border:none;outline:none;color:var(--t1);font-size:13px;font-family:'DM Sans',sans-serif;flex:1;}
      .cib input::placeholder{color:var(--t3);}
      .mbo{border-radius:18px 18px 4px 18px;padding:10px 14px;max-width:75%;font-size:14px;background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;}
      .mbi{background:var(--glass);border:1px solid var(--border);border-radius:18px 18px 18px 4px;padding:10px 14px;max-width:75%;font-size:14px;color:var(--t1);}
      .tj{background:rgba(16,185,129,0.12);color:#6ee7b7;border:1px solid rgba(16,185,129,0.22);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;}
      .te{background:rgba(59,130,246,0.12);color:#93c5fd;border:1px solid rgba(59,130,246,0.22);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;}
      .tm{background:rgba(236,72,153,0.12);color:#f9a8d4;border:1px solid rgba(236,72,153,0.22);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;}
      .tac{background:rgba(245,158,11,0.12);color:#fcd34d;border:1px solid rgba(245,158,11,0.22);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;}
      @keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fi{from{opacity:0}to{opacity:1}}
      @keyframes gs{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes blob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
      @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      .aup{animation:fu 0.4s ease forwards;}
      .gt{background:linear-gradient(135deg,#7c3aed,#ec4899,#a855f7);background-size:200%;animation:gs 3s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
      .nbd{width:8px;height:8px;background:var(--a2);border-radius:50%;position:absolute;top:1px;right:1px;}
      ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.3);border-radius:2px;}
      @media(max-width:768px){
        .sidebar{transform:translateX(-100%);}
        .sidebar.open{transform:translateX(0);box-shadow:4px 0 40px rgba(0,0,0,0.5);}
        .mwrap{margin-left:0!important;}
      }
        
    `}</style>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────────────────────── 
//const D = 86400000;
//const SEED = {
  //users: [
    //{ id:"u1",name:"Arjun Sharma",email:"arjun@rnsit.ac.in",password:"arjun123",role:"Alumni",dept:"Computer Science",batch:"2020",bio:"Senior SWE at Google Bangalore. Loves open source, AI/ML, and helping RNSIT students crack top tech. Happy to mentor!",skills:["React","Node.js","Python","ML","AWS","TypeScript"],avatar:null,banner:null,linkedin:"https://linkedin.com",achievements:["Google Code Jam Finalist 2023","Hacktoberfest Top Contributor"],certs:["AWS Solutions Architect","Google Cloud Pro"],mentor:true,verified:true,followers:["u2","u3","u4"],following:["u2","u3"],joined:Date.now()-D*90 },
    //{ id:"u2",name:"Priya Nair",email:"priya@rnsit.ac.in",password:"priya123",role:"Student",dept:"Electronics & Communication",batch:"2024",bio:"Final year ECE student. Exploring IoT, embedded systems, and making things blink. IEEE Student Member 📡",skills:["Arduino","Python","VLSI","IoT","Embedded C"],avatar:null,banner:null,linkedin:"",achievements:["IEEE Paper Published 2024"],certs:["NPTEL Python","Coursera IoT Specialization"],mentor:false,verified:true,followers:["u1","u4"],following:["u1","u3","u4"],joined:Date.now()-D*60 },
    //{ id/:"u3",name:"Dr. Meera Iyer",email:"meera@rnsit.ac.in",password:"meera123",role:"Faculty",dept:"Computer Science",batch:"2005",bio:"Associate Prof, CS Dept. PhD IIT Bombay. Research: Deep Learning, NLP, Explainable AI. Open for project collaborations.",skills:["Deep Learning","NLP","TensorFlow","Research","Python","Computer Vision"],avatar:null,banner:null,linkedin:"",achievements:["Best Paper IEEE 2023","SERB Research Grant 2022","PhD IIT Bombay"],certs:["Stanford ML Certificate"],mentor:true,verified:true,followers:["u1","u2","u4"],following:[],joined:Date.now()-D*200 },
    //{ id:"u4",name:"Vikram Reddy",email:"vikram@rnsit.ac.in",password:"vikram123",role:"Alumni",dept:"Mechanical Engineering",batch:"2018",bio:"PM @ Swiggy. Mech Eng → Product Management journey. Forbes 30U30 nominee. Helping RNSIT folks break into Product!",skills:["Product Management","SQL","Data Analysis","Agile","Leadership"],avatar:null,banner:null,linkedin:"",achievements:["Forbes 30U30 Nominee 2024","Built Swiggy Hyperlocal Product"],certs:["PMP","Google PM Certificate"],mentor:true,verified:true,followers:["u1","u2","u3"],following:["u1","u2"],joined:Date.now()-D*120 },
    //{ id:"ua",name:"RNSIT Official",email:"admin@rnsit.ac.in",password:"admin123",role:"Admin",dept:"Administration",batch:"2000",bio:"Official RNSIT Alumni Network Admin. Campus news, events, and announcements. Est. 1984.",skills:["Administration"],avatar:null,banner:null,linkedin:"",achievements:[],certs:[],mentor:false,verified:true,followers:["u1","u2","u3","u4"],following:[],joined:Date.now()-D*300 },
 // ],
  //posts: [
    //{ id:"p1",authorId:"u1",content:"🚀 IT'S OFFICIAL — I joined Google as a Senior Software Engineer!\n\nThe journey from RNSIT's CS labs to Google Bangalore has been 3 incredible years of grind, learning, and growth.\n\nTo every RNSIT student preparing for big tech right now: the path is real. Keep going.\n\n💡 I'm opening MENTORSHIP SLOTS for RNSIT students targeting Google, Amazon, Microsoft, and top startups. DM me or hit the Mentorship section!\n\nThank you RNSIT 🙏 #Google #RNSIT #Alumni #BigTech #Mentorship",image:null,category:"achievement",likes:["u2","u3","u4"],comments:[{id:"c1",userId:"u2",text:"Congratulations Arjun!! You DESERVE this! 🎉🔥",ts:Date.now()-D+3600*1000},{id:"c2",userId:"u3",text:"So proud of you! RNSIT shines through every success story like yours!",ts:Date.now()-D+7200*1000},{id:"c3",userId:"u4",text:"🔥🔥 Absolute legend. The path you paved makes it easier for all of us!",ts:Date.now()-D+9000*1000}],bookmarks:["u2","u4"],ts:Date.now()-D*2 },
    //{ id:"p2",authorId:"u3",content:"📢 Applications open: AI/ML Summer Workshop Series 2026!\n\n6 sessions covering Deep Learning, NLP with Transformers, Computer Vision with PyTorch, MLOps & Deployment.\n\n✅ All branches welcome — 3rd & 4th year preferred\n📅 Every Saturday, June–July 2026\n📍 CS Block Room 301, RNSIT\n🎯 Limited to 50 students\n\nRegister through the Events section. Early applications prioritized!\n\n#RNSIT #AIWorkshop #MachineLearning #DeepLearning",image:null,category:"event",likes:["u1","u2","u4"],comments:[{id:"c4",userId:"u2",text:"Registered! SO excited for this workshop series! 🙌",ts:Date.now()-D/4}],bookmarks:["u2","u1"],ts:Date.now()-D },
    //{ id:"p3",authorId:"u1",content:"💼 HIRING: Frontend Developer Intern @ Google India, Bangalore\n\nLooking for talented RNSIT students for a 6-month internship with PPO!\n\n🔹 Role: Frontend Developer Intern\n🏢 Google India — Maps Team\n📍 Koramangala, Bangalore\n💰 Stipend: ₹60,000/month + perks\n⏰ Duration: July 2026 – January 2027\n\nRequirements: React, TypeScript, basic DSA, CGPA ≥ 3.0. RNSIT students get priority!\n\nApply through Jobs section! #Hiring #Google #Internship #Frontend",image:null,category:"job",likes:["u2","u4"],comments:[],bookmarks:["u2"],ts:Date.now()-D*3 },
    //{ id:"p4",authorId:"u4",content:"💡 From Mechanical Engineering → Product Manager at Swiggy.\n\nHere's what nobody tells you:\n\n1. Your technical background is a SUPERPOWER — don't hide it\n2. Product is 70% communication, 30% everything else\n3. Build things. Ship things. That's the portfolio.\n4. The best PMs studied problems, not business schools\n\nRunning a FREE 'Intro to Product Management' session this Saturday!\n\nOpen to ALL branches. Register in the Events section. See you there 🚀\n\n#ProductManagement #RNSIT #CareerAdvice #PM",image:null,category:"mentorship",likes:["u1","u2","u3"],comments:[{id:"c5",userId:"u2",text:"This is so inspiring! Registered for Saturday's session! 🙏",ts:Date.now()-3600*2000}],bookmarks:["u1","u2"],ts:Date.now()-3600*8000 },
  //],
 // messages: [
   // {id:"m1",from:"u2",to:"u1",text:"Hi Arjun! Saw your mentorship offer — I'm targeting product-based companies this placement season. Would you have 30 min this week?",ts:Date.now()-3600*3000,read:false},
    //{id:"m2",from:"u1",to:"u2",text:"Hi Priya! Absolutely happy to help. Yes, let's connect this weekend — send me your resume when you get a chance!",ts:Date.now()-3600*2000,read:true},
  //],
  //notifications: [
   // {id:"n1",for:"u1",type:"follow",from:"u2",text:"Priya Nair started following you",read:false,ts:Date.now()-3600*5000},
    //{id:"n2",for:"u1",type:"like",from:"u3",text:"Dr. Meera Iyer liked your post",read:false,ts:Date.now()-3600*3000},
    //{id:"n3",for:"u2",type:"comment",from:"u1",text:"Arjun Sharma replied to your comment",read:true,ts:Date.now()-3600*8000},
    //{id:"n4",for:"u2",type:"follow",from:"u4",text:"Vikram Reddy started following you",read:false,ts:Date.now()-3600*1000},
  //],
  //jobs: [
   // {id:"j1",by:"u1",title:"Frontend Developer Intern",company:"Google India",loc:"Bangalore",type:"Internship",desc:"Work on Google Maps frontend infrastructure. 6-month internship with PPO opportunity. You'll be embedded in the core Maps team working with React and TypeScript.",skills:["React","TypeScript","Web Performance","CSS"],salary:"₹60,000/month",deadline:Date.now()+D*20,verified:true,ts:Date.now()-D*3,applicants:["u2"]},
    //{id:"j2",by:"u4",title:"Product Manager — Hyperlocal",company:"Swiggy",loc:"Bangalore (Hybrid)",type:"Full-time",desc:"Join Swiggy's hyperlocal product team. Drive strategy for last-mile delivery in Tier-2/3 cities. Ideal for engineers wanting to transition into product roles.",skills:["Product Management","Data Analysis","SQL","Stakeholder Management"],salary:"₹18–24 LPA",deadline:Date.now()+D*30,verified:true,ts:Date.now()-D*5,applicants:[]},
  //],
  //events: [
   // {id:"ev1",by:"ua",title:"RNSIT Annual Tech Fest 2026",desc:"The biggest tech event of the year! Hackathons, design sprints, workshop tracks, and guest lectures from Google, Amazon & Flipkart. 3 days of pure engineering and innovation! Open to all students.",date:Date.now()+D*18,venue:"RNSIT Main Auditorium & Campus Grounds",type:"fest",registrations:["u1","u2"],ts:Date.now()-D*2},
    //{id:"ev2",by:"u4",title:"Intro to Product Management — Free Workshop",desc:"Breaking into PM from engineering: a no-BS practical guide. Portfolio building, case studies, mock interviews. Special focus on RNSIT students with non-traditional backgrounds.",date:Date.now()+D*3,venue:"Online (Zoom — link sent on registration)",type:"workshop",registrations:["u2","u3"],ts:Date.now()-3600*8000},
  //],
//};
*/

/* ─────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function ago(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`;
  if (d < D) return `${Math.floor(d/3600000)}h ago`;
  if (d < D*7) return `${Math.floor(d/D)}d ago`;
  return new Date(ts).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
}

function ini(n="?") { return n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2); }

function catPost(text) {
  const t = text.toLowerCase();
  if (/(hiring|intern|apply|vacancy|opening|salary|stipend|lpa|job)/i.test(t)) return "job";
  if (/(event|workshop|fest|seminar|webinar|register|session|hackathon)/i.test(t)) return "event";
  if (/(mentor|mentorship|career advice|help wanted|guide)/i.test(t)) return "mentorship";
  if (/(congratul|achievement|award|proud|milestone|promoted|joined|selected|offer)/i.test(t)) return "achievement";
  return "general";
}

function aiScore(me, u) {
  let s = 0;
  const ms = me.skills||[], us = u.skills||[];
  s += ms.filter(x => us.includes(x)).length * 15;
  if (me.dept === u.dept) s += 20;
  if (me.role==="Student" && (u.role==="Alumni"||u.role==="Faculty")) s += 30;
  if (me.role==="Alumni" && u.role==="Student") s += 10;
  if (u.mentor) s += 15;
  s += (u.followers?.length||0) * 2;
  return s;
}

function countdown(ts) {
  const d = ts - Date.now();
  if (d <= 0) return "Happening now!";
  const days = Math.floor(d/D);
  const hrs = Math.floor((d%D)/3600000);
  if (days > 0) return `${days}d ${hrs}h remaining`;
  return `${hrs}h ${Math.floor((d%3600000)/60000)}m remaining`;
}

/* ─────────────────────────────────────────────────────────────
   BASE COMPONENTS
───────────────────────────────────────────────────────────── */
const GRADS = [["#7c3aed","#a855f7"],["#2563eb","#7c3aed"],["#ec4899","#a855f7"],["#0891b2","#2563eb"],["#059669","#0891b2"],["#d97706","#ef4444"]];

function Avatar({ user, size=40 }) {
  if (!user) return <div style={{width:size,height:size,borderRadius:"50%",background:"#333"}} />;
  const [c1,c2] = GRADS[(user.name?.charCodeAt(0)||0)%GRADS.length];
  if (user.avatar) return <img src={user.avatar} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}} alt={user.name}/>;
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.37,fontFamily:"Outfit,sans-serif",flexShrink:0,letterSpacing:"0.5px"}}>
      {ini(user.name)}
    </div>
  );
}

function RoleBadge({ role }) {
  const m={Alumni:["ba","✦"],Student:["bs","◈"],Faculty:["bf","★"],Admin:["bad","⬡"]};
  const [c,i]=m[role]||["",""]; 
  return <span className={`badge ${c}`}>{i} {role}</span>;
}

function CatTag({ cat }) {
  if (!cat||cat==="general") return null;
  const m={job:["tj","💼 Job"],event:["te","📅 Event"],mentorship:["tm","🤝 Mentorship"],achievement:["tac","🏆 Achievement"]};
  const [c,l]=m[cat]||[];
  return c ? <span className={c}>{l}</span> : null;
}

/* ─────────────────────────────────────────────────────────────
   POST CARD
───────────────────────────────────────────────────────────── */
function PostCard({ post, db, setDb, me, onProfile }) {
  const [showCmt, setShowCmt] = useState(false);
  const [cmtTxt, setCmtTxt] = useState("");
  const [showOpts, setShowOpts] = useState(false);

  const author = db.users.find(u=>u.id===post.authorId);
  const isLiked = post.likes.includes(me.id);
  const isSaved = post.bookmarks.includes(me.id);
  const isOwn   = post.authorId === me.id;

  function toggleLike() {
    setDb(p=>({...p,posts:p.posts.map(x=>x.id!==post.id?x:{...x,likes:isLiked?x.likes.filter(i=>i!==me.id):[...x.likes,me.id]})}));
  }
  function toggleSave() {
    setDb(p=>({...p,posts:p.posts.map(x=>x.id!==post.id?x:{...x,bookmarks:isSaved?x.bookmarks.filter(i=>i!==me.id):[...x.bookmarks,me.id]})}));
  }
  function addCmt() {
    if(!cmtTxt.trim())return;
    setDb(p=>({...p,posts:p.posts.map(x=>x.id!==post.id?x:{...x,comments:[...x.comments,{id:uid(),userId:me.id,text:cmtTxt.trim(),ts:Date.now()}]})}));
    setCmtTxt("");
  }
  function delPost() {
    setDb(p=>({...p,posts:p.posts.filter(x=>x.id!==post.id)}));
  }
  if (!author) return null;

  return (
    <div className="gc aup" style={{padding:"20px",marginBottom:"12px",cursor:"default"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"11px",cursor:"pointer"}} onClick={()=>onProfile(author.id)}>
          <Avatar user={author} size={44}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"7px",flexWrap:"wrap"}}>
              <span style={{fontWeight:600,fontSize:"15px"}}>{author.name}</span>
              {author.verified&&<span style={{color:"var(--grn)",fontSize:11}}>✓</span>}
              <RoleBadge role={author.role}/>
              {author.mentor&&<span className="badge bm">🎓 Mentor</span>}
            </div>
            <div style={{fontSize:"12px",color:"var(--t2)",marginTop:"2px"}}>{author.dept} · {ago(post.ts)}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <CatTag cat={post.category}/>
          {isOwn&&(
            <div style={{position:"relative"}}>
              <button className="bi" onClick={()=>setShowOpts(!showOpts)}><ChevronDown size={15}/></button>
              {showOpts&&(
                <div className="gc" style={{position:"absolute",right:0,top:"100%",zIndex:20,minWidth:140,padding:4,marginTop:4}}>
                  <button onClick={()=>{delPost();setShowOpts(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:"none",border:"none",color:"#f87171",padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"DM Sans,sans-serif"}}>
                    <Trash2 size={13}/> Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p style={{fontSize:"14px",lineHeight:"1.75",whiteSpace:"pre-wrap",marginBottom:"14px"}}>{post.content}</p>
      {post.image&&<img src={post.image} style={{width:"100%",borderRadius:12,marginBottom:14,maxHeight:360,objectFit:"cover"}}/>}

      {/* Stats */}
      <div style={{display:"flex",gap:"16px",fontSize:"12px",color:"var(--t3)",marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid var(--border)"}}>
        <span>{post.likes.length} likes</span>
        <span>{post.comments.length} comments</span>
        <span>{post.bookmarks.length} saved</span>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:"2px",flexWrap:"wrap"}}>
        <button className={`pab ${isLiked?"lkd":""}`} onClick={toggleLike}>
          <Heart size={14} fill={isLiked?"currentColor":"none"}/> {isLiked?"Liked":"Like"}
        </button>
        <button className="pab" onClick={()=>setShowCmt(!showCmt)}>
          <MessageCircle size={14}/> Comment
        </button>
        <button className={`pab ${isSaved?"svd":""}`} onClick={toggleSave}>
          <Bookmark size={14} fill={isSaved?"currentColor":"none"}/> {isSaved?"Saved":"Save"}
        </button>
        <button className="pab"><Share2 size={14}/> Share</button>
      </div>

      {/* Comments */}
      {showCmt&&(
        <div style={{marginTop:14}}>
          {post.comments.map(c=>{
            const cu=db.users.find(u=>u.id===c.userId);
            return (
              <div key={c.id} style={{display:"flex",gap:"9px",marginBottom:"10px"}}>
                <Avatar user={cu} size={30}/>
                <div style={{flex:1}}>
                  <div className="gc" style={{padding:"8px 12px",borderRadius:12}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{cu?.name}</div>
                    <div style={{fontSize:13,lineHeight:1.5}}>{c.text}</div>
                  </div>
                  <div style={{fontSize:11,color:"var(--t3)",marginTop:3,marginLeft:12}}>{ago(c.ts)}</div>
                </div>
              </div>
            );
          })}
          <div className="cib" style={{marginTop:8}}>
            <Avatar user={me} size={26}/>
            <input placeholder="Write a comment…" value={cmtTxt} onChange={e=>setCmtTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCmt()}/>
            <button className="bi" style={{color:"var(--a2)"}} onClick={addCmt}><Send size={15}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CREATE POST MODAL
───────────────────────────────────────────────────────────── */
function CreatePostModal({ db, setDb, me, onClose }) {
  const [txt, setTxt] = useState("");
  const [img, setImg] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (!txt.trim()) { setErr("Post content cannot be empty."); return; }
    const post = { id:uid(), authorId:me.id, content:txt.trim(), image:img.trim()||null, category:catPost(txt), likes:[], comments:[], bookmarks:[], ts:Date.now() };
    setDb(p=>({...p,posts:[post,...p.posts]}));
    onClose();
  }

  return (
    <div className="moverlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h3 style={{fontSize:20,fontWeight:700}}>Create Post</h3>
          <button className="bi" onClick={onClose}><X size={18}/></button>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:14}}>
          <Avatar user={me} size={42}/>
          <div>
            <div style={{fontWeight:600}}>{me.name}</div>
            <div style={{fontSize:12,color:"var(--t2)"}}>{me.role} · {me.dept}</div>
          </div>
        </div>
        <textarea className="inp" rows={6} placeholder="What's on your mind? Share updates, opportunities, or insights with the RNSIT network…" value={txt} onChange={e=>setTxt(e.target.value)} style={{marginBottom:12}}/>
        <input className="inp" placeholder="Image URL (optional)" value={img} onChange={e=>setImg(e.target.value)} style={{marginBottom:12}}/>
        {err&&<p style={{color:"var(--red)",fontSize:13,marginBottom:12}}>{err}</p>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="bo" onClick={onClose}>Cancel</button>
          <button className="bp" onClick={submit}><Zap size={15}/> Publish</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EDIT PROFILE MODAL
───────────────────────────────────────────────────────────── */
function EditProfileModal({ db, setDb, me, onClose }) {
  const cur = db.users.find(u=>u.id===me.id)||me;
  const [f, setF] = useState({ name:cur.name, bio:cur.bio, dept:cur.dept, batch:cur.batch, linkedin:cur.linkedin||"", skills:cur.skills.join(", "), mentor:cur.mentor, avatar:cur.avatar||"" });

  function save() {
    const skills = f.skills.split(",").map(s=>s.trim()).filter(Boolean);
    setDb(p=>({...p,users:p.users.map(u=>u.id!==me.id?u:{...u,...f,skills,avatar:f.avatar||null})}));
    onClose();
  }

  return (
    <div className="moverlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h3 style={{fontSize:20,fontWeight:700}}>Edit Profile</h3>
          <button className="bi" onClick={onClose}><X size={18}/></button>
        </div>
        {[["Name","name","text"],["Department","dept","text"],["Batch Year","batch","text"],["LinkedIn URL","linkedin","text"],["Profile Photo URL","avatar","text"]].map(([lbl,key,type])=>(
          <div key={key} style={{marginBottom:12}}>
            <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>{lbl}</label>
            <input className="inp" type={type} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}/>
          </div>
        ))}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Bio</label>
          <textarea className="inp" rows={3} value={f.bio} onChange={e=>setF({...f,bio:e.target.value})}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Skills (comma-separated)</label>
          <input className="inp" value={f.skills} onChange={e=>setF({...f,skills:e.target.value})}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <input type="checkbox" id="mentor" checked={f.mentor} onChange={e=>setF({...f,mentor:e.target.checked})} style={{width:16,height:16,accentColor:"var(--a)"}}/>
          <label htmlFor="mentor" style={{fontSize:14,cursor:"pointer"}}>Available as Mentor</label>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="bo" onClick={onClose}>Cancel</button>
          <button className="bp" onClick={save}><Check size={15}/> Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────────────── */
function LandingPage({ onGetStarted }) {
  const stats=[["10,000+","Alumni Connected"],["500+","Jobs Posted"],["300+","Events Hosted"],["50+","Companies Hiring"]];
  const feats=[
    {icon:<Zap size={22}/>,title:"AI-Powered Matching",desc:"Smart recommendations connect you with the right mentors, alumni, and opportunities based on your skills and goals."},
    {icon:<Users size={22}/>,title:"Network that Matters",desc:"Build meaningful connections across students, alumni, and faculty in one intelligent, unified platform."},
    {icon:<Briefcase size={22}/>,title:"Exclusive Opportunities",desc:"Access internships and jobs posted exclusively by RNSIT alumni. Get insider referrals from your network."},
    {icon:<Award size={22}/>,title:"Mentorship Engine",desc:"Get matched with expert alumni and faculty mentors aligned to your career goals and technical interests."},
    {icon:<Calendar size={22}/>,title:"Events & Workshops",desc:"Stay updated on campus events, hackathons, and industry workshops. Register in one click."},
    {icon:<TrendingUp size={22}/>,title:"Growth Analytics",desc:"Track your network growth, engagement, and skill visibility with a modern analytics dashboard."},
  ];
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",overflow:"hidden"}}>
      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",borderBottom:"1px solid var(--border)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:50,background:"rgba(7,7,26,0.85)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontWeight:900,fontSize:16,fontFamily:"Outfit"}}>U</span>
          </div>
          <span style={{fontFamily:"Outfit",fontWeight:800,fontSize:20,color:"var(--t1)"}}>UniConnect</span>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button className="bo" onClick={()=>onGetStarted("login")}>Sign In</button>
          <button className="bp" onClick={()=>onGetStarted("signup")}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{position:"relative",textAlign:"center",padding:"100px 24px 80px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",left:"10%",width:400,height:400,background:"#7c3aed",borderRadius:"50%",filter:"blur(120px)",opacity:0.12}}/>
        <div style={{position:"absolute",bottom:"5%",right:"8%",width:350,height:350,background:"#ec4899",borderRadius:"50%",filter:"blur(100px)",opacity:0.1}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:760,margin:"0 auto"}}>
          <div className="gca" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:30,marginBottom:28,fontSize:13,color:"var(--a3)"}}>
            <Sparkles size={14}/> AI-Powered Alumni Networking Platform
          </div>
          <h1 style={{fontSize:"clamp(40px,7vw,76px)",fontWeight:900,lineHeight:1.1,marginBottom:24}}>
            Your College Network,<br/>
            <span className="gt">Supercharged by AI</span>
          </h1>
          <p style={{fontSize:"clamp(16px,2vw,20px)",color:"var(--t2)",lineHeight:1.7,maxWidth:580,margin:"0 auto 40px"}}>
            UniConnect bridges students, alumni, and faculty — delivering intelligent mentorship matching, exclusive job opportunities, and a vibrant professional community.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="bp" style={{padding:"14px 32px",fontSize:16}} onClick={()=>onGetStarted("signup")}>
              <Zap size={17}/> Start Networking Free
            </button>
            <button className="bo" style={{padding:"14px 28px",fontSize:16}} onClick={()=>onGetStarted("login")}>
              View Demo →
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,maxWidth:900,margin:"0 auto",padding:"0 24px 80px"}}>
        {stats.map(([num,lbl])=>(
          <div key={lbl} className="gc" style={{textAlign:"center",padding:"28px 20px"}}>
            <div style={{fontFamily:"Outfit",fontSize:36,fontWeight:800,background:"linear-gradient(135deg,var(--a),var(--a2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{num}</div>
            <div style={{color:"var(--t2)",fontSize:14,marginTop:4}}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 100px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <h2 style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:800,marginBottom:12}}>Everything you need to thrive</h2>
          <p style={{color:"var(--t2)",fontSize:16}}>One platform connecting your entire college ecosystem</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {feats.map(f=>(
            <div key={f.title} className="gc" style={{padding:"24px 22px"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--a3)",marginBottom:16}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</div>
              <div style={{fontSize:14,color:"var(--t2)",lineHeight:1.65}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FOOTER */}
      <div style={{textAlign:"center",padding:"60px 24px",borderTop:"1px solid var(--border)"}}>
        <h2 style={{fontSize:32,fontWeight:800,marginBottom:12}}>Ready to join your network?</h2>
        <p style={{color:"var(--t2)",marginBottom:28}}>Join thousands of RNSIT alumni, students, and faculty already connected.</p>
        <button className="bp" style={{padding:"14px 36px",fontSize:16}} onClick={()=>onGetStarted("signup")}>
          Create Your Account →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AUTH PAGE
───────────────────────────────────────────────────────────── */
function AuthPage({ db, setDb, onLogin, tab:initTab }) {
  const [tab, setTab] = useState(initTab||"login");
  const [f, setF] = useState({name:"",email:"",password:"",role:"Student"});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
  setErr("");

  if (!f.email || !f.password) {
    setErr("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      f.email,
      f.password
    );

    const firebaseUser = userCredential.user;

    const user = {
      id: firebaseUser.uid,
      name: firebaseUser.email.split("@")[0],
      email: firebaseUser.email,
      role: "Student",
    };

    setLoading(false);
    onLogin(user);

  } catch (error) {
    setLoading(false);
    setErr(error.message);
  }
}
  async function signup() {

  setErr("");

  if (!f.name || !f.email || !f.password) {
    setErr("All fields are required.");
    return;
  }

  try {

    setLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      f.email,
      f.password
    );

    const firebaseUser = userCredential.user;

    const newUser = {
      id: firebaseUser.uid,
      name: f.name,
      email: f.email,
      role: f.role,
    };

    setLoading(false);

    onLogin(newUser);

  } catch (error) {

    setLoading(false);
    setErr(error.message);

  }
}

  //const hints=[["arjun@rnsit.ac.in","arjun123","Alumni"],["priya@rnsit.ac.in","priya123","Student"],["meera@rnsit.ac.in","meera123","Faculty"],["admin@rnsit.ac.in","admin123","Admin"]];

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"20%",left:"15%",width:300,height:300,background:"#7c3aed",borderRadius:"50%",filter:"blur(100px)",opacity:0.12}}/>
      <div style={{position:"absolute",bottom:"15%",right:"15%",width:250,height:250,background:"#ec4899",borderRadius:"50%",filter:"blur(90px)",opacity:0.1}}/>
      <div style={{width:"100%",maxWidth:460,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <span style={{color:"#fff",fontWeight:900,fontSize:24,fontFamily:"Outfit"}}>U</span>
          </div>
          <h1 style={{fontFamily:"Outfit",fontWeight:800,fontSize:28}}>UniConnect</h1>
          <p style={{color:"var(--t2)",fontSize:14,marginTop:6}}>RNSIT Alumni Network</p>
        </div>

        <div className="gc" style={{padding:"32px 28px",borderRadius:24}}>
          {/* Tabs */}
          <div style={{display:"flex",background:"var(--glass)",borderRadius:12,padding:4,marginBottom:24}}>
            {["login","signup"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setErr("");}} style={{flex:1,padding:"9px",borderRadius:9,background:tab===t?"linear-gradient(135deg,var(--a),var(--a2))":"transparent",color:tab===t?"#fff":"var(--t2)",border:"none",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"DM Sans,sans-serif",transition:"all 0.2s"}}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {tab==="signup"&&(
            <div style={{marginBottom:14}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Full Name</label>
              <input className="inp" placeholder="Your full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
            </div>
          )}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Email Address</label>
            <input className="inp" type="email" placeholder="you@rnsit.ac.in" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
          </div>
          <div style={{marginBottom:tab==="signup"?14:20}}>
            <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Password</label>
            <input className="inp" type="password" placeholder={tab==="signup"?"Min 6 chars, at least 1 number":"••••••••"} value={f.password} onChange={e=>setF({...f,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&(tab==="login"?login():signup())}/>
          </div>
          {tab==="signup"&&(
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>I am a</label>
              <select className="inp" value={f.role} onChange={e=>setF({...f,role:e.target.value})} style={{cursor:"pointer"}}>
                {["Student","Alumni","Faculty"].map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}
          {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#f87171",marginBottom:14}}>{err}</div>}
          <button className="bp" style={{width:"100%",justifyContent:"center",padding:"13px"}} onClick={tab==="login"?login:signup} disabled={loading}>
            {loading ? "Please wait…" : (tab==="login"?"Sign In →":"Create Account →")}
          </button>

          {tab==="login"&&(
            <div style={{marginTop:20,padding:"14px",background:"var(--glass)",borderRadius:12,border:"1px solid var(--border)"}}>
              <div style={{fontSize:12,color:"var(--t2)",marginBottom:8,fontWeight:600}}>Quick Login Hints:</div>
              {hints.map(([em,pw,role])=>(
                <div key={em} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"var(--t3)"}}>{em}</span>
                  <button onClick={()=>setF({...f,email:em,password:pw})} style={{fontSize:11,color:"var(--a3)",background:"none",border:"none",cursor:"pointer",fontFamily:"DM Sans"}}>{role} →</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p style={{textAlign:"center",color:"var(--t3)",fontSize:13,marginTop:16}}>
          {tab==="login"?"Don't have an account? ":"Already have an account? "}
          <button onClick={()=>{setTab(tab==="login"?"signup":"login");setErr("");}} style={{background:"none",border:"none",color:"var(--a3)",cursor:"pointer",fontFamily:"DM Sans",fontSize:13,fontWeight:600}}>
            {tab==="login"?"Create Account":"Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEED PAGE
───────────────────────────────────────────────────────────── */
function FeedPage({ db, setDb, me, onProfile }) {
  const [showCreate, setShowCreate] = useState(false);
  const meLatest = db.users.find(u=>u.id===me.id)||me;

  const feed = useMemo(()=>{
    const followed = new Set(meLatest.following||[]);
    return [...db.posts].sort((a,b)=>{
      const aF=followed.has(a.authorId)?1:0, bF=followed.has(b.authorId)?1:0;
      if (aF!==bF) return bF-aF;
      return b.ts-a.ts;
    });
  },[db.posts,meLatest.following]);

  const recs = useMemo(()=>
    db.users.filter(u=>u.id!==me.id&&!meLatest.following?.includes(u.id))
      .sort((a,b)=>aiScore(meLatest,b)-aiScore(meLatest,a)).slice(0,4)
  ,[db.users,meLatest]);

  function follow(uid) {
    setDb(p=>({...p,users:p.users.map(u=>{
      if(u.id===me.id) return {...u,following:[...(u.following||[]),uid]};
      if(u.id===uid)   return {...u,followers:[...(u.followers||[]),me.id]};
      return u;
    })}));
  }

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24,maxWidth:1020,margin:"0 auto",padding:"24px 20px",alignItems:"start"}}>
      {/* Feed */}
      <div>
        {/* Create Post */}
        <div className="gc" style={{padding:18,marginBottom:14,cursor:"pointer"}} onClick={()=>setShowCreate(true)}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Avatar user={meLatest} size={42}/>
            <div style={{flex:1,background:"var(--glass2)",border:"1px solid var(--border)",borderRadius:50,padding:"11px 18px",color:"var(--t3)",fontSize:14}}>
              Share something with the RNSIT network…
            </div>
          </div>
          <div style={{display:"flex",gap:12,marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)"}}>
            {[["📸","Photo"],["💼","Job"],["📅","Event"],["🏆","Achievement"]].map(([i,l])=>(
              <button key={l} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"var(--t2)",fontSize:13,cursor:"pointer",fontFamily:"DM Sans",fontWeight:500,padding:"4px 8px",borderRadius:8,transition:"all 0.15s"}}>{i} {l}</button>
            ))}
          </div>
        </div>
        {feed.map(p=><PostCard key={p.id} post={p} db={db} setDb={setDb} me={meLatest} onProfile={onProfile}/>)}
      </div>

      {/* Sidebar */}
      <div>
        {/* Profile Card */}
        <div className="gc" style={{padding:20,marginBottom:14,textAlign:"center"}}>
          <Avatar user={meLatest} size={60}/>
          <div style={{fontWeight:700,fontSize:17,marginTop:10}}>{meLatest.name}</div>
          <div style={{fontSize:13,color:"var(--t2)",margin:"4px 0 8px"}}>{meLatest.dept||"Complete your profile"}</div>
          <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <RoleBadge role={meLatest.role}/>
            {meLatest.verified&&<span className="badge bv">✓ Verified</span>}
            {meLatest.mentor&&<span className="badge bm">🎓 Mentor</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"var(--glass)",borderRadius:12,padding:12}}>
            <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:18}}>{(meLatest.followers||[]).length}</div><div style={{fontSize:12,color:"var(--t2)"}}>Followers</div></div>
            <div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:18}}>{(meLatest.following||[]).length}</div><div style={{fontSize:12,color:"var(--t2)"}}>Following</div></div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="gc" style={{padding:20,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <Sparkles size={16} color="var(--a3)"/>
            <span style={{fontWeight:700,fontSize:15}}>People You May Know</span>
          </div>
          {recs.map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{cursor:"pointer"}} onClick={()=>onProfile(u.id)}><Avatar user={u} size={38}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} onClick={()=>onProfile(u.id)}>{u.name}</div>
                <div style={{fontSize:11,color:"var(--t2)"}}><RoleBadge role={u.role}/></div>
              </div>
              <button className="fb fol" style={{padding:"5px 12px",fontSize:12}} onClick={()=>follow(u.id)}>Follow</button>
            </div>
          ))}
        </div>

        {/* Trending Skills */}
        <div className="gc" style={{padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <TrendingUp size={16} color="var(--a3)"/>
            <span style={{fontWeight:700,fontSize:15}}>Trending Skills</span>
          </div>
          {["React","Python","Machine Learning","Node.js","Data Science","TypeScript"].map(s=>(
            <div key={s} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Hash size={13} color="var(--t3)"/>
                <span style={{fontSize:13}}>{s}</span>
              </div>
              <span style={{fontSize:11,color:"var(--t3)"}}>{Math.floor(Math.random()*200+50)} posts</span>
            </div>
          ))}
        </div>
      </div>
      {showCreate&&<CreatePostModal db={db} setDb={setDb} me={meLatest} onClose={()=>setShowCreate(false)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────────────────────── */
function ProfilePage({ userId, db, setDb, me, onProfile, onBack, onMessage }) {
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const user = db.users.find(u=>u.id===userId);
  const meLatest = db.users.find(u=>u.id===me.id)||me;
  const isMe = userId===me.id;
  const isFollowing = (meLatest.following||[]).includes(userId);

  function toggleFollow() {
    if (isMe) return;
    setDb(p=>({...p,users:p.users.map(u=>{
      if(u.id===me.id) return {...u,following:isFollowing?(u.following||[]).filter(x=>x!==userId):[...(u.following||[]),userId]};
      if(u.id===userId) return {...u,followers:isFollowing?(u.followers||[]).filter(x=>x!==me.id):[...(u.followers||[]),me.id]};
      return u;
    })}));
  }

  if (!user) return <div style={{padding:40,textAlign:"center",color:"var(--t2)"}}>User not found</div>;

  const userPosts = db.posts.filter(p=>p.authorId===userId);
  const bookmarked = db.posts.filter(p=>(p.bookmarks||[]).includes(userId));

  const completion = [user.bio,user.dept,user.batch,user.linkedin,(user.skills||[]).length>0,(user.achievements||[]).length>0].filter(Boolean).length;
  const pct = Math.round((completion/6)*100);

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px"}}>
      <button className="bi" style={{marginBottom:16,display:"flex",alignItems:"center",gap:6,fontSize:14,color:"var(--t2)"}} onClick={onBack}>
        <ArrowLeft size={16}/> Back to Feed
      </button>

      {/* Banner + Avatar */}
      <div className="gc" style={{marginBottom:16,overflow:"hidden"}}>
        <div style={{height:160,background:"linear-gradient(135deg,#1a0040,#3d006e,#7c3aed)",position:"relative"}}>
          <div style={{position:"absolute",bottom:-44,left:28}}>
            <div style={{border:"4px solid var(--bg2)",borderRadius:"50%"}}>
              <Avatar user={user} size={88}/>
            </div>
          </div>
        </div>
        <div style={{padding:"52px 28px 24px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <h2 style={{fontSize:24,fontWeight:800}}>{user.name}</h2>
              {user.verified&&<span style={{color:"var(--grn)",fontSize:14}}>✓</span>}
              <RoleBadge role={user.role}/>
              {user.mentor&&<span className="badge bm">🎓 Mentor</span>}
            </div>
            {user.dept&&<div style={{color:"var(--t2)",fontSize:14,marginTop:4}}>{user.dept}{user.batch&&` · Batch of ${user.batch}`}</div>}
            {user.bio&&<p style={{fontSize:14,color:"var(--t1)",lineHeight:1.65,maxWidth:520,marginTop:8}}>{user.bio}</p>}
            {user.linkedin&&(
              <a href={user.linkedin} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:"var(--a3)",fontSize:13,marginTop:8,textDecoration:"none"}}>
                <Globe size={13}/> LinkedIn Profile <ExternalLink size={11}/>
              </a>
            )}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {isMe&&<button className="bo" onClick={()=>setEditOpen(true)}><Edit size={14}/> Edit Profile</button>}
            {!isMe&&<>
              <button className={`fb ${isFollowing?"fing":"fol"}`} onClick={toggleFollow}>
                {isFollowing?"Following":"Follow"}
              </button>
              <button className="bo" onClick={()=>onMessage(userId)}><Mail size={14}/> Message</button>
            </>}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{display:"flex",gap:0,borderTop:"1px solid var(--border)"}}>
          {[[(user.followers||[]).length,"Followers"],[(user.following||[]).length,"Following"],[userPosts.length,"Posts"]].map(([v,l])=>(
            <div key={l} style={{flex:1,textAlign:"center",padding:"14px 0",borderRight:"1px solid var(--border)"}}>
              <div style={{fontWeight:700,fontSize:20}}>{v}</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>{l}</div>
            </div>
          ))}
          <div style={{flex:1,textAlign:"center",padding:"14px 0"}}>
            <div style={{fontWeight:700,fontSize:20}}>{pct}%</div>
            <div style={{fontSize:12,color:"var(--t2)"}}>Profile Complete</div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
        {/* Posts / Saved Tabs */}
        <div>
          <div style={{display:"flex",background:"var(--glass)",borderRadius:12,padding:4,marginBottom:16,border:"1px solid var(--border)"}}>
            {["posts","saved"].map(t=>(
              <button key={t} onClick={()=>setActiveTab(t)} style={{flex:1,padding:"9px",borderRadius:9,background:activeTab===t?"linear-gradient(135deg,var(--a),var(--a2))":"transparent",color:activeTab===t?"#fff":"var(--t2)",border:"none",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"DM Sans,sans-serif",transition:"all 0.2s",textTransform:"capitalize"}}>
                {t==="posts"?"Posts":"Saved"}
              </button>
            ))}
          </div>
          {activeTab==="posts"&&(userPosts.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t2)"}}>No posts yet.</div>:userPosts.sort((a,b)=>b.ts-a.ts).map(p=><PostCard key={p.id} post={p} db={db} setDb={setDb} me={meLatest} onProfile={onProfile}/>))}
          {activeTab==="saved"&&(isMe?(bookmarked.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t2)"}}>No saved posts.</div>:bookmarked.map(p=><PostCard key={p.id} post={p} db={db} setDb={setDb} me={meLatest} onProfile={onProfile}/>)):<div style={{textAlign:"center",padding:40,color:"var(--t2)"}}>Saved posts are private.</div>)}
        </div>

        {/* Skills & About */}
        <div>
          {(user.skills||[]).length>0&&(
            <div className="gc" style={{padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,marginBottom:12}}>Skills</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {user.skills.map(s=><span key={s} className="sc">{s}</span>)}
              </div>
            </div>
          )}
          {(user.achievements||[]).length>0&&(
            <div className="gc" style={{padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,marginBottom:12}}>Achievements</div>
              {user.achievements.map((a,i)=>(
                <div key={i} style={{display:"flex",gap:9,marginBottom:9}}>
                  <Award size={15} style={{color:"var(--yel)",marginTop:2,flexShrink:0}}/>
                  <span style={{fontSize:13,color:"var(--t1)"}}>{a}</span>
                </div>
              ))}
            </div>
          )}
          {(user.certs||[]).length>0&&(
            <div className="gc" style={{padding:20}}>
              <div style={{fontWeight:700,marginBottom:12}}>Certifications</div>
              {user.certs.map((c,i)=>(
                <div key={i} style={{display:"flex",gap:9,marginBottom:9}}>
                  <CheckCircle size={15} style={{color:"var(--grn)",marginTop:2,flexShrink:0}}/>
                  <span style={{fontSize:13}}>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {editOpen&&<EditProfileModal db={db} setDb={setDb} me={me} onClose={()=>setEditOpen(false)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEARCH PAGE
───────────────────────────────────────────────────────────── */
function SearchPage({ db, setDb, me, onProfile }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const meLatest = db.users.find(u=>u.id===me.id)||me;

  const results = useMemo(()=>{
    let users = db.users.filter(u=>u.id!==me.id);
    if (filter!=="All") users = users.filter(u=>u.role===filter);
    if (q.trim()) {
      const ql = q.toLowerCase();
      users = users.filter(u=>
        u.name.toLowerCase().includes(ql)||
        (u.dept||"").toLowerCase().includes(ql)||
        (u.skills||[]).some(s=>s.toLowerCase().includes(ql))||
        u.role.toLowerCase().includes(ql)
      );
    }
    return users.sort((a,b)=>aiScore(meLatest,b)-aiScore(meLatest,a));
  },[q,filter,db.users,meLatest]);

  function toggleFollow(uid) {
    const isF=(meLatest.following||[]).includes(uid);
    setDb(p=>({...p,users:p.users.map(u=>{
      if(u.id===me.id) return {...u,following:isF?(u.following||[]).filter(x=>x!==uid):[...(u.following||[]),uid]};
      if(u.id===uid)   return {...u,followers:isF?(u.followers||[]).filter(x=>x!==me.id):[...(u.followers||[]),me.id]};
      return u;
    })}));
  }

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px"}}>
      <h2 style={{fontSize:24,fontWeight:800,marginBottom:20}}>Find People</h2>

      <div style={{position:"relative",marginBottom:14}}>
        <Search size={16} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--t3)"}}/>
        <input className="inp" placeholder="Search by name, skill, department…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:42}}/>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {["All","Student","Alumni","Faculty","Admin"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 16px",borderRadius:20,background:filter===f?"linear-gradient(135deg,var(--a),var(--a2))":"var(--glass)",color:filter===f?"#fff":"var(--t2)",border:`1px solid ${filter===f?"transparent":"var(--border)"}`,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"DM Sans,sans-serif",transition:"all 0.2s"}}>
            {f}
          </button>
        ))}
      </div>

      {results.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--t2)"}}>No users found for "{q}"</div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {results.map(u=>{
          const isF=(meLatest.following||[]).includes(u.id);
          return (
            <div key={u.id} className="gc aup" style={{padding:20}}>
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{cursor:"pointer",display:"inline-block"}} onClick={()=>onProfile(u.id)}>
                  <Avatar user={u} size={60}/>
                </div>
                <div style={{fontWeight:700,fontSize:15,marginTop:10,cursor:"pointer"}} onClick={()=>onProfile(u.id)}>{u.name}</div>
                <div style={{fontSize:12,color:"var(--t2)",marginTop:3}}>{u.dept||"RNSIT"}</div>
                <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
                  <RoleBadge role={u.role}/>
                  {u.verified&&<span className="badge bv">✓</span>}
                  {u.mentor&&<span className="badge bm">🎓 Mentor</span>}
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:14}}>
                {(u.skills||[]).slice(0,3).map(s=><span key={s} className="sc" style={{fontSize:11}}>{s}</span>)}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"center",fontSize:13,color:"var(--t2)",marginBottom:14}}>
                <span>{(u.followers||[]).length} followers</span>
                <span>·</span>
                <span>{db.posts.filter(p=>p.authorId===u.id).length} posts</span>
              </div>
              <button className={`fb ${isF?"fing":"fol"}`} style={{width:"100%"}} onClick={()=>toggleFollow(u.id)}>
                {isF?"Following":"Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MESSAGES PAGE
───────────────────────────────────────────────────────────── */
function MessagesPage({ db, setDb, me, initContact }) {
  const [selId, setSelId] = useState(initContact||null);
  const [txt, setTxt] = useState("");
  const endRef = useRef(null);

  const conversations = useMemo(()=>{
    const seen = new Set();
    const convs = [];
    db.messages.forEach(m=>{
      const otherId = m.from===me.id?m.to:m.from;
      if (m.from===me.id||m.to===me.id) {
        if(!seen.has(otherId)){seen.add(otherId);convs.push(otherId);}
      }
    });
    return convs.map(uid=>({user:db.users.find(u=>u.id===uid),msgs:db.messages.filter(m=>(m.from===me.id&&m.to===uid)||(m.from===uid&&m.to===me.id)).sort((a,b)=>a.ts-b.ts)}));
  },[db.messages,db.users,me.id]);

  const selConv = conversations.find(c=>c.user?.id===selId);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[selConv?.msgs.length]);

  function send() {
    if(!txt.trim()||!selId)return;
    const msg={id:uid(),from:me.id,to:selId,text:txt.trim(),ts:Date.now(),read:false};
    setDb(p=>({...p,messages:[...p.messages,msg]}));
    setTxt("");
  }

  const unread = (uid)=>db.messages.filter(m=>m.from===uid&&m.to===me.id&&!m.read).length;

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px"}}>
      <h2 style={{fontSize:24,fontWeight:800,marginBottom:20}}>Messages</h2>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14,height:"70vh"}}>
        {/* Conversation List */}
        <div className="gc" style={{overflow:"auto",padding:8}}>
          {conversations.length===0&&<div style={{padding:20,color:"var(--t2)",fontSize:14,textAlign:"center"}}>No conversations yet.</div>}
          {conversations.map(({user:u,msgs})=>{
            const last=msgs[msgs.length-1];
            const ur=unread(u?.id||"");
            return (
              <div key={u?.id} onClick={()=>setSelId(u?.id)} style={{display:"flex",gap:10,padding:"12px 10px",borderRadius:12,cursor:"pointer",background:selId===u?.id?"rgba(124,58,237,0.12)":"transparent",transition:"all 0.15s",marginBottom:2}}>
                <div style={{position:"relative"}}>
                  <Avatar user={u} size={42}/>
                  {ur>0&&<span style={{position:"absolute",top:-2,right:-2,background:"var(--a2)",color:"#fff",borderRadius:"50%",width:17,height:17,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{ur}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u?.name}</div>
                  <div style={{fontSize:12,color:"var(--t2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{last?.text||"Start a conversation"}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className="gc" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {!selConv?
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"var(--t3)",gap:12}}>
              <MessageCircle size={40} opacity={0.4}/>
              <span style={{fontSize:15}}>Select a conversation</span>
            </div>:
            <>
              {/* Chat Header */}
              <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12}}>
                <Avatar user={selConv.user} size={38}/>
                <div>
                  <div style={{fontWeight:600}}>{selConv.user?.name}</div>
                  <div style={{fontSize:12,color:"var(--t2)"}}>{selConv.user?.role} · {selConv.user?.dept}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{flex:1,overflow:"auto",padding:"16px"}}>
                {selConv.msgs.map(m=>(
                  <div key={m.id} style={{display:"flex",justifyContent:m.from===me.id?"flex-end":"flex-start",marginBottom:10}}>
                    <div>
                      <div className={m.from===me.id?"mbo":"mbi"} style={{lineHeight:1.55}}>{m.text}</div>
                      <div style={{fontSize:10,color:"var(--t3)",marginTop:3,textAlign:m.from===me.id?"right":"left"}}>{ago(m.ts)}</div>
                    </div>
                  </div>
                ))}
                <div ref={endRef}/>
              </div>

              {/* Input */}
              <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)"}}>
                <div className="cib">
                  <input placeholder="Type a message…" value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
                  <button className="bi" style={{color:"var(--a2)"}} onClick={send}><Send size={17}/></button>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   JOBS PAGE
───────────────────────────────────────────────────────────── */
function JobsPage({ db, setDb, me }) {
  const [showPost, setShowPost] = useState(false);
  const [f, setF] = useState({title:"",company:"",loc:"",type:"Internship",desc:"",skills:"",salary:"",deadline:""});
  const canPost = me.role==="Alumni"||me.role==="Faculty"||me.role==="Admin";

  function post() {
    if(!f.title||!f.company||!f.desc)return;
    const job={id:uid(),by:me.id,title:f.title,company:f.company,loc:f.loc,type:f.type,desc:f.desc,skills:f.skills.split(",").map(s=>s.trim()).filter(Boolean),salary:f.salary,deadline:f.deadline?new Date(f.deadline).getTime():Date.now()+D*30,verified:me.verified,ts:Date.now(),applicants:[]};
    setDb(p=>({...p,jobs:[job,...p.jobs]}));
    setShowPost(false);
    setF({title:"",company:"",loc:"",type:"Internship",desc:"",skills:"",salary:"",deadline:""});
  }

  function apply(jid) {
    setDb(p=>({...p,jobs:p.jobs.map(j=>j.id!==jid?j:{...j,applicants:[...new Set([...(j.applicants||[]),me.id])]})}));
  }

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800}}>Jobs & Internships</h2>
          <p style={{color:"var(--t2)",fontSize:14,marginTop:4}}>Exclusive opportunities from RNSIT alumni</p>
        </div>
        {canPost&&<button className="bp" onClick={()=>setShowPost(true)}><Plus size={15}/> Post Job</button>}
      </div>

      <div style={{display:"grid",gap:14}}>
        {db.jobs.map(j=>{
          const poster=db.users.find(u=>u.id===j.by);
          const hasApplied=(j.applicants||[]).includes(me.id);
          return (
            <div key={j.id} className="gc aup" style={{padding:24}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <h3 style={{fontSize:18,fontWeight:700}}>{j.title}</h3>
                    {j.verified&&<span className="badge bv">✓ Verified</span>}
                    <span style={{background:"rgba(124,58,237,0.15)",color:"var(--a3)",border:"1px solid rgba(124,58,237,0.25)",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{j.type}</span>
                  </div>
                  <div style={{display:"flex",gap:16,color:"var(--t2)",fontSize:14,flexWrap:"wrap"}}>
                    <span style={{display:"flex",alignItems:"center",gap:5}}><Briefcase size={13}/>{j.company}</span>
                    <span style={{display:"flex",alignItems:"center",gap:5}}><MapPin size={13}/>{j.loc}</span>
                    <span style={{display:"flex",alignItems:"center",gap:5}}><Clock size={13}/>Closes {ago(j.deadline)}</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,fontSize:18,color:"var(--grn)"}}>{j.salary}</div>
                  <div style={{fontSize:12,color:"var(--t2)",marginTop:4}}>{(j.applicants||[]).length} applicants</div>
                </div>
              </div>
              <p style={{fontSize:14,color:"var(--t1)",lineHeight:1.7,marginBottom:14}}>{j.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
                {(j.skills||[]).map(s=><span key={s} className="sc">{s}</span>)}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Avatar user={poster} size={28}/>
                  <span style={{fontSize:13,color:"var(--t2)"}}>Posted by <strong style={{color:"var(--t1)"}}>{poster?.name}</strong></span>
                </div>
                {me.role!=="Admin"&&(
                  <button className={hasApplied?"bo":"bp"} style={{padding:"8px 20px"}} onClick={()=>!hasApplied&&apply(j.id)}>
                    {hasApplied?<><Check size={13}/>Applied</>:"Apply Now"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showPost&&(
        <div className="moverlay" onClick={e=>e.target===e.currentTarget&&setShowPost(false)}>
          <div className="mbox">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h3 style={{fontSize:20,fontWeight:700}}>Post a Job</h3>
              <button className="bi" onClick={()=>setShowPost(false)}><X size={18}/></button>
            </div>
            {[["Job Title","title","text"],["Company","company","text"],["Location","loc","text"],["Salary / Stipend","salary","text"]].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>{lbl}</label>
                <input className="inp" type={type} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}/>
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Type</label>
              <select className="inp" value={f.type} onChange={e=>setF({...f,type:e.target.value})}>
                {["Internship","Full-time","Part-time","Contract"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Description</label>
              <textarea className="inp" rows={4} value={f.desc} onChange={e=>setF({...f,desc:e.target.value})}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Required Skills (comma-separated)</label>
              <input className="inp" value={f.skills} onChange={e=>setF({...f,skills:e.target.value})}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Application Deadline</label>
              <input className="inp" type="date" value={f.deadline} onChange={e=>setF({...f,deadline:e.target.value})}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button className="bo" onClick={()=>setShowPost(false)}>Cancel</button>
              <button className="bp" onClick={post}><Plus size={15}/> Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EVENTS PAGE
───────────────────────────────────────────────────────────── */
function EventsPage({ db, setDb, me }) {
  const [showPost, setShowPost] = useState(false);
  const [f, setF] = useState({title:"",desc:"",date:"",venue:"",type:"workshop"});
  const canPost = me.role==="Admin"||me.role==="Faculty"||me.role==="Alumni";

  function post() {
    if(!f.title||!f.date)return;
    const ev={id:uid(),by:me.id,title:f.title,desc:f.desc,date:new Date(f.date).getTime(),venue:f.venue,type:f.type,registrations:[],ts:Date.now()};
    setDb(p=>({...p,events:[ev,...p.events]}));
    setShowPost(false);
    setF({title:"",desc:"",date:"",venue:"",type:"workshop"});
  }

  function register(eid) {
    setDb(p=>({...p,events:p.events.map(e=>e.id!==eid?e:{...e,registrations:[...new Set([...(e.registrations||[]),me.id])]})}));
  }

  const typeColors={fest:"linear-gradient(135deg,#7c3aed,#ec4899)",workshop:"linear-gradient(135deg,#0891b2,#2563eb)",seminar:"linear-gradient(135deg,#059669,#0891b2)",hackathon:"linear-gradient(135deg,#d97706,#ef4444)"};

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:800}}>Events & Announcements</h2>
          <p style={{color:"var(--t2)",fontSize:14,marginTop:4}}>Campus events, workshops, and fests</p>
        </div>
        {canPost&&<button className="bp" onClick={()=>setShowPost(true)}><Plus size={15}/> Post Event</button>}
      </div>

      <div style={{display:"grid",gap:16}}>
        {db.events.sort((a,b)=>a.date-b.date).map(ev=>{
          const poster=db.users.find(u=>u.id===ev.by);
          const isReg=(ev.registrations||[]).includes(me.id);
          const isPast=ev.date<Date.now();
          return (
            <div key={ev.id} className="gc aup" style={{overflow:"hidden"}}>
              <div style={{height:8,background:typeColors[ev.type]||typeColors.workshop}}/>
              <div style={{padding:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                      <h3 style={{fontSize:18,fontWeight:700}}>{ev.title}</h3>
                      <span style={{background:typeColors[ev.type]||typeColors.workshop,color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,textTransform:"capitalize"}}>{ev.type}</span>
                      {poster?.role==="Admin"&&<span className="badge bad">📣 Official</span>}
                    </div>
                    <div style={{display:"flex",gap:16,color:"var(--t2)",fontSize:14,flexWrap:"wrap"}}>
                      <span style={{display:"flex",alignItems:"center",gap:5}}><Calendar size={13}/>{new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
                      <span style={{display:"flex",alignItems:"center",gap:5}}><MapPin size={13}/>{ev.venue}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:600,color:isPast?"var(--t3)":"var(--a3)"}}>{isPast?"Event Ended":countdown(ev.date)}</div>
                    <div style={{fontSize:12,color:"var(--t2)",marginTop:4}}>{(ev.registrations||[]).length} registered</div>
                  </div>
                </div>
                <p style={{fontSize:14,lineHeight:1.7,marginBottom:16}}>{ev.desc}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid var(--border)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Avatar user={poster} size={26}/>
                    <span style={{fontSize:12,color:"var(--t2)"}}>By <strong style={{color:"var(--t1)"}}>{poster?.name}</strong></span>
                  </div>
                  {!isPast&&me.role!=="Admin"&&(
                    <button className={isReg?"bo":"bp"} style={{padding:"8px 20px"}} onClick={()=>!isReg&&register(ev.id)}>
                      {isReg?<><Check size={13}/>Registered</>:"Register Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPost&&(
        <div className="moverlay" onClick={e=>e.target===e.currentTarget&&setShowPost(false)}>
          <div className="mbox">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h3 style={{fontSize:20,fontWeight:700}}>Post an Event</h3>
              <button className="bi" onClick={()=>setShowPost(false)}><X size={18}/></button>
            </div>
            {[["Event Title","title","text"],["Venue / Location","venue","text"]].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>{lbl}</label>
                <input className="inp" type={type} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}/>
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Date & Time</label>
              <input className="inp" type="datetime-local" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Event Type</label>
              <select className="inp" value={f.type} onChange={e=>setF({...f,type:e.target.value})}>
                {["workshop","fest","seminar","hackathon","webinar"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,color:"var(--t2)",display:"block",marginBottom:5}}>Description</label>
              <textarea className="inp" rows={4} value={f.desc} onChange={e=>setF({...f,desc:e.target.value})}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button className="bo" onClick={()=>setShowPost(false)}>Cancel</button>
              <button className="bp" onClick={post}><Plus size={15}/> Post Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANALYTICS PAGE (Admin / basic for all)
───────────────────────────────────────────────────────────── */
function AnalyticsPage({ db, me }) {
  const totalUsers = db.users.length;
  const totalPosts = db.posts.length;
  const totalJobs  = db.jobs.length;
  const totalEvents= db.events.length;
  const totalLikes = db.posts.reduce((s,p)=>s+p.likes.length,0);
  const topSkills = db.users.flatMap(u=>u.skills||[]).reduce((a,s)=>{a[s]=(a[s]||0)+1;return a;},{});
  const topSkillList = Object.entries(topSkills).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const roleData = ["Student","Alumni","Faculty","Admin"].map(r=>({r,n:db.users.filter(u=>u.role===r).length}));

  const cards=[["👥",totalUsers,"Total Members"],["📝",totalPosts,"Total Posts"],["💼",totalJobs,"Jobs Posted"],["📅",totalEvents,"Events"],["❤️",totalLikes,"Total Likes"]];

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px"}}>
      <h2 style={{fontSize:24,fontWeight:800,marginBottom:6}}>Network Analytics</h2>
      <p style={{color:"var(--t2)",fontSize:14,marginBottom:24}}>Platform-wide insights and trends</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        {cards.map(([i,v,l])=>(
          <div key={l} className="gc" style={{padding:20,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>{i}</div>
            <div style={{fontFamily:"Outfit",fontSize:28,fontWeight:800,background:"linear-gradient(135deg,var(--a),var(--a2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
            <div style={{fontSize:12,color:"var(--t2)",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="gc" style={{padding:20}}>
          <div style={{fontWeight:700,marginBottom:16}}>Community Breakdown</div>
          {roleData.map(({r,n})=>(
            <div key={r} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:14}}>{r}</span>
                <span style={{fontSize:14,fontWeight:600}}>{n}</span>
              </div>
              <div style={{height:6,background:"var(--glass2)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.round((n/totalUsers)*100)}%`,background:"linear-gradient(90deg,var(--a),var(--a2))",borderRadius:3,transition:"width 0.8s ease"}}/>
              </div>
            </div>
          ))}
        </div>

        <div className="gc" style={{padding:20}}>
          <div style={{fontWeight:700,marginBottom:16}}>Top Skills in Network</div>
          {topSkillList.map(([s,n])=>(
            <div key={s} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13}}>{s}</span>
                <span style={{fontSize:12,color:"var(--t2)"}}>{n} people</span>
              </div>
              <div style={{height:5,background:"var(--glass2)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.round((n/(topSkillList[0]?.[1]||1))*100)}%`,background:"linear-gradient(90deg,var(--a2),#ec4899)",borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gc" style={{padding:20}}>
        <div style={{fontWeight:700,marginBottom:16}}>Top Contributors</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {db.users.filter(u=>u.id!=="ua").sort((a,b)=>{
            const aScore=db.posts.filter(p=>p.authorId===a.id).reduce((s,p)=>s+p.likes.length+p.comments.length,0);
            const bScore=db.posts.filter(p=>p.authorId===b.id).reduce((s,p)=>s+p.likes.length+p.comments.length,0);
            return bScore-aScore;
          }).slice(0,4).map((u,i)=>(
            <div key={u.id} className="gca" style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:"Outfit",fontWeight:800,fontSize:20,color:"var(--a3)",minWidth:28}}>#{i+1}</div>
              <Avatar user={u} size={36}/>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
                <div style={{fontSize:11,color:"var(--t2)"}}>{u.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NOTIFICATIONS DROPDOWN
───────────────────────────────────────────────────────────── */
function NotifDropdown({ db, setDb, me, onClose }) {
  const notifs = db.notifications.filter(n=>n.for===me.id).sort((a,b)=>b.ts-a.ts);
  const fromU = (id)=>db.users.find(u=>u.id===id);

  function markAll() {
    setDb(p=>({...p,notifications:p.notifications.map(n=>n.for===me.id?{...n,read:true}:n)}));
  }

  const icons={follow:<UserPlus size={14}/>,like:<Heart size={14}/>,comment:<MessageCircle size={14}/>};
  const icColors={follow:"var(--a3)",like:"#f87171",comment:"var(--grn)"};

  return (
    <div className="gc" style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:340,zIndex:999,padding:4,maxHeight:420,overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid var(--border)"}}>
        <span style={{fontWeight:700,fontSize:15}}>Notifications</span>
        <button className="bi" style={{fontSize:12,color:"var(--a3)"}} onClick={markAll}>Mark all read</button>
      </div>
      {notifs.length===0&&<div style={{padding:24,textAlign:"center",color:"var(--t2)"}}>No notifications yet</div>}
      {notifs.map(n=>{
        const u=fromU(n.from);
        return (
          <div key={n.id} style={{display:"flex",gap:10,padding:"10px 14px",borderRadius:10,background:n.read?"transparent":"rgba(124,58,237,0.06)",cursor:"pointer",marginBottom:2}} onClick={()=>{setDb(p=>({...p,notifications:p.notifications.map(x=>x.id===n.id?{...x,read:true}:x)}));onClose();}}>
            <div style={{position:"relative"}}>
              <Avatar user={u} size={36}/>
              <div style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,borderRadius:"50%",background:"var(--bg2)",display:"flex",alignItems:"center",justifyContent:"center",color:icColors[n.type]||"var(--t2)",border:"1px solid var(--border)"}}>
                {icons[n.type]||<Bell size={10}/>}
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,lineHeight:1.5,fontWeight:n.read?400:600}}>{n.text}</div>
              <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{ago(n.ts)}</div>
            </div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--a2)",marginTop:4,flexShrink:0}}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
function Sidebar({ nav, setNav, me, db, isOpen, onClose, dark, toggleDark, onLogout }) {
  const meL = db.users.find(u=>u.id===me.id)||me;
  const unread = db.notifications.filter(n=>n.for===me.id&&!n.read).length;
  const unreadMsg = db.messages.filter(m=>m.to===me.id&&!m.read).length;

  const links = [
    {id:"feed",icon:<Home size={18}/>,label:"Feed"},
    {id:"search",icon:<Search size={18}/>,label:"Explore"},
    {id:"messages",icon:<MessageCircle size={18}/>,label:"Messages",badge:unreadMsg},
    {id:"jobs",icon:<Briefcase size={18}/>,label:"Jobs"},
    {id:"events",icon:<Calendar size={18}/>,label:"Events"},
    {id:"analytics",icon:<BarChart2 size={18}/>,label:"Analytics"},
  ];

  return (
    <>
      {isOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:99,display:"none"}} className="sidebar-overlay" onClick={onClose}/>}
      <div className={`sidebar ${isOpen?"open":""}`}>
        {/* Logo */}
        <div style={{padding:"20px 16px 16px",borderBottom:"1px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:900,fontSize:18,fontFamily:"Outfit"}}>U</span>
            </div>
            <div>
              <div style={{fontFamily:"Outfit",fontWeight:800,fontSize:17,color:"var(--t1)"}}>UniConnect</div>
              <div style={{fontSize:11,color:"var(--t3)"}}>RNSIT Network</div>
            </div>
          </div>
        </div>

        {/* Profile Snippet */}
        <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>{setNav({page:"profile",id:me.id});onClose();}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Avatar user={meL} size={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{meL.name}</div>
              <div style={{fontSize:11,color:"var(--t2)"}}>{meL.role} · {meL.verified?"✓ Verified":""}</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{flex:1,padding:"8px 8px"}}>
          {links.map(l=>(
            <div key={l.id} className={`nl ${nav.page===l.id?"active":""}`} onClick={()=>{setNav({page:l.id});onClose();}}>
              <span style={{position:"relative"}}>
                {l.icon}
                {(l.badge||0)>0&&<span style={{position:"absolute",top:-6,right:-6,background:"var(--a2)",color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{l.badge}</span>}
              </span>
              <span>{l.label}</span>
              {(l.badge||0)>0&&<span style={{marginLeft:"auto",background:"rgba(168,85,247,0.2)",color:"var(--a3)",borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:600}}>{l.badge}</span>}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{padding:"8px 8px",borderTop:"1px solid var(--border)"}}>
          <div className="nl" onClick={toggleDark}>
            {dark?<Sun size={17}/>:<Moon size={17}/>}
            <span>{dark?"Light Mode":"Dark Mode"}</span>
          </div>
          <div className="nl" onClick={onLogout} style={{color:"#f87171"}}>
            <LogOut size={17}/>
            <span>Sign Out</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────────────────────── */
function TopBar({ db, setDb, me, nav, setNav, dark, toggleDark, onMenu }) {
  const [showNotif, setShowNotif] = useState(false);
  const [sq, setSq] = useState("");
  const meL = db.users.find(u=>u.id===me.id)||me;
  const unread = db.notifications.filter(n=>n.for===me.id&&!n.read).length;

  const titles = {feed:"Feed",search:"Explore",messages:"Messages",jobs:"Jobs & Internships",events:"Events",analytics:"Analytics",profile:"Profile"};

  return (
    <div className="tbar">
      <button className="bi" style={{display:"none",flexShrink:0}} id="menu-btn" onClick={onMenu}><Menu size={20}/></button>
      <style>{`@media(max-width:768px){#menu-btn{display:flex!important;}}`}</style>

      <h2 style={{fontFamily:"Outfit",fontSize:18,fontWeight:700,flex:"none"}}>{titles[nav.page]||""}</h2>

      <div style={{flex:1,maxWidth:360,position:"relative",marginLeft:8}}>
        <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--t3)"}}/>
        <input className="inp" placeholder="Quick search…" value={sq} onChange={e=>setSq(e.target.value)} onFocus={()=>setNav({page:"search"})} style={{paddingLeft:34,height:38,fontSize:13}}/>
      </div>

      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
        <button className="bi" onClick={toggleDark}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>

        <div style={{position:"relative"}}>
          <button className="bi" style={{position:"relative"}} onClick={()=>setShowNotif(!showNotif)}>
            <Bell size={18}/>
            {unread>0&&<span style={{position:"absolute",top:2,right:2,background:"var(--a2)",borderRadius:"50%",width:9,height:9,border:`2px solid var(--bg2)`}}/>}
          </button>
          {showNotif&&<NotifDropdown db={db} setDb={setDb} me={meL} onClose={()=>setShowNotif(false)}/>}
        </div>

        <div style={{width:32,height:32,cursor:"pointer",borderRadius:"50%",overflow:"hidden",border:"2px solid var(--border2)"}} onClick={()=>setNav({page:"profile",id:me.id})}>
          <Avatar user={meL} size={28}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(SEED);
  const [nav, setNav] = useState({page:"feed"});
  const [sideOpen, setSideOpen] = useState(false);
  const [msgContact, setMsgContact] = useState(null);

  const me = useMemo(()=>user?db.users.find(u=>u.id===user.id)||user:null,[user,db.users]);



  
async function login(email, password) {

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    setUser(user);

    setScreen("app");

    setNav({page:"feed"});

  } catch(err) {

    alert(err.message);

  }

}

  function logout() { setUser(null); setScreen("landing"); setNav({page:"feed"}); }

  function goProfile(uid) { setNav({page:"profile",id:uid}); setSideOpen(false); }
  function goMessage(uid) { setMsgContact(uid); setNav({page:"messages"}); setSideOpen(false); }

  function renderPage() {
    if (!me) return null;
    switch(nav.page) {
      case "feed":      return <FeedPage db={db} setDb={setDb} me={me} onProfile={goProfile}/>;
      case "profile":   return <ProfilePage userId={nav.id||me.id} db={db} setDb={setDb} me={me} onProfile={goProfile} onBack={()=>setNav({page:"feed"})} onMessage={goMessage}/>;
      case "search":    return <SearchPage db={db} setDb={setDb} me={me} onProfile={goProfile}/>;
      case "messages":  return <MessagesPage db={db} setDb={setDb} me={me} initContact={msgContact}/>;
      case "jobs":      return <JobsPage db={db} setDb={setDb} me={me}/>;
      case "events":    return <EventsPage db={db} setDb={setDb} me={me}/>;
      case "analytics": return <AnalyticsPage db={db} me={me}/>;
      default:          return <FeedPage db={db} setDb={setDb} me={me} onProfile={goProfile}/>;
    }
  }

  return (
    
    <div className={dark?"":"light"}>
      <GS dark={dark}/>
      {screen==="landing"&&<LandingPage onGetStarted={t=>{setAuthTab(t);setScreen("auth");}}/>}
      {screen==="auth"&&<AuthPage db={db} setDb={setDb} onLogin={login} tab={authTab}/>}
      {screen==="app"&&me&&(
        <>
          <Sidebar nav={nav} setNav={n=>{setNav(n);setSideOpen(false);}} me={me} db={db} isOpen={sideOpen} onClose={()=>setSideOpen(false)} dark={dark} toggleDark={()=>setDark(!dark)} onLogout={logout}/>
          <div className="mwrap" style={{marginLeft:"var(--sb)"}}>
            <TopBar db={db} setDb={setDb} me={me} nav={nav} setNav={setNav} dark={dark} toggleDark={()=>setDark(!dark)} onMenu={()=>setSideOpen(!sideOpen)}/>
            {renderPage()}
          </div>
        </>
      )}
    </div>
  );
}
