// Story 1 v3 edit decision list (24 fps). Clip frames live in frames/<id>/NNNN.jpg.
window.CLIPS=[{id:'c0',n:145},{id:'c1',n:145},{id:'c2',n:145},{id:'p0',n:145},{id:'p1',n:145},{id:'p2',n:145},{id:'m1',n:145},{id:'m2',n:145},{id:'c4',n:145},{id:'c5',n:145},{id:'c6',n:145},{id:'c7',n:145}];
const LIGHT='light',RED2='#D30038',SL='#7A95A5';
window.SHOTS=[
 {clip:'c0',t0:0,   t1:5.6, in:0.2},
 {clip:'c1',t0:5.6, t1:10.0,in:0.6,people:true,txt:{lines:['Every visit'],at:[6.46],mode:LIGHT}},
 {clip:'c2',t0:10.0,t1:14.4,in:0.6,people:true,txt:{lines:['Every enrollment'],at:[10.54],mode:LIGHT}},
 {clip:'p0',t0:14.4,t1:15.9,in:0.6,people:true,txt:{lines:['Every record'],at:[14.96],mode:LIGHT,keep:true}},
 {clip:'p1',t0:15.9,t1:17.4,in:0.3,people:true,txt:{lines:['Every record'],at:[14.96],mode:LIGHT,keep:true}},
 {clip:'p2',t0:17.4,t1:18.8,in:0.3,people:true,txt:{lines:['Every record'],at:[14.96],mode:LIGHT}},
 {clip:'m1',t0:18.8,t1:21.0,in:0.3,people:true,txt:{lines:['Every claim'],at:[19.27],mode:LIGHT,keep:true}},
 {clip:'m2',t0:21.0,t1:23.2,in:0.5,people:true,txt:{lines:['Every claim'],at:[19.27],mode:LIGHT}},
 {clip:'c4',t0:23.2,t1:28.4,in:0.4,people:true,txt:{lines:['Something has to work.','Every time.'],at:[23.88,25.42],mode:'topdark',cols:['#FFFFFF',RED2],size:139.5,track:-8.37}},
 {clip:'c5',t0:28.4,t1:34.0,in:0.0,people:true,txt:{lines:['Built','Modernized','Operated'],at:[31.32,32.22,33.14],mode:'leftdark',cols:[SL,'#FFFFFF',RED2]}},
 {clip:'c6',t0:34.0,t1:40.0,in:0.0,people:true,txt:{lines:['Reliable','Accountable','Secure'],at:[36.24,37.34,38.44],mode:'leftdark',cols:[SL,'#FFFFFF',RED2]}},
 {clip:'c7',t0:40.0,t1:45.0,in:0.0},
];
window.TRI={t0:45.0,at:[45.8,48.32,50.04],cost:'m2',quality:'p2',access:'c1'};
window.END={t0:52.4,clip:'c1'};
