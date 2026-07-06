--
-- PostgreSQL database dump
--

\restrict fZoAbXTasXHP5UVgttDSQGz9Wa0nQFtNn00R9KCa6Puae8ZGJPceu7PN9DUSnDy

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: arohisingh
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    user_id integer,
    message text,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    risk_id integer
);


ALTER TABLE public.alerts OWNER TO arohisingh;

--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: arohisingh
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO arohisingh;

--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arohisingh
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: arohisingh
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO arohisingh;

--
-- Name: risk; Type: TABLE; Schema: public; Owner: arohisingh
--

CREATE TABLE public.risk (
    id integer NOT NULL,
    text character varying(500),
    description character varying(500),
    severity character varying(50),
    category character varying(50),
    impact character varying(500),
    recommendations text,
    priority character varying(50),
    created_at timestamp without time zone
);


ALTER TABLE public.risk OWNER TO arohisingh;

--
-- Name: risk_id_seq; Type: SEQUENCE; Schema: public; Owner: arohisingh
--

CREATE SEQUENCE public.risk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.risk_id_seq OWNER TO arohisingh;

--
-- Name: risk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arohisingh
--

ALTER SEQUENCE public.risk_id_seq OWNED BY public.risk.id;


--
-- Name: risks; Type: TABLE; Schema: public; Owner: arohisingh
--

CREATE TABLE public.risks (
    id integer NOT NULL,
    description text,
    latitude double precision,
    longitude double precision,
    risk_score integer,
    severity text,
    ai_summary text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying DEFAULT 'ACTIVE'::character varying,
    recommendations jsonb,
    user_id integer,
    image_url text,
    image text,
    assigned_team text,
    assigned_at timestamp without time zone,
    assigned_by integer
);


ALTER TABLE public.risks OWNER TO arohisingh;

--
-- Name: risks_id_seq; Type: SEQUENCE; Schema: public; Owner: arohisingh
--

CREATE SEQUENCE public.risks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.risks_id_seq OWNER TO arohisingh;

--
-- Name: risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arohisingh
--

ALTER SEQUENCE public.risks_id_seq OWNED BY public.risks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: arohisingh
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'USER'::text,
    created_at timestamp without time zone DEFAULT now(),
    password text,
    name text
);


ALTER TABLE public.users OWNER TO arohisingh;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: arohisingh
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO arohisingh;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arohisingh
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: risk id; Type: DEFAULT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.risk ALTER COLUMN id SET DEFAULT nextval('public.risk_id_seq'::regclass);


--
-- Name: risks id; Type: DEFAULT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.risks ALTER COLUMN id SET DEFAULT nextval('public.risks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: arohisingh
--

COPY public.alerts (id, user_id, message, read, created_at, risk_id) FROM stdin;
1	1	Your reported issue "Gas leak near parking area" has been resolved	f	2026-05-05 23:44:48.950825	\N
2	1	Test alert for debugging	f	2026-05-06 00:04:43.616341	35
3	1	Your reported issue "Gas leak near parking area" has been resolved.	f	2026-05-06 01:15:41.572126	36
4	1	Your reported issue "crack in wall" has been resolved.	f	2026-05-06 09:53:02.987642	38
5	1	Your reported issue "big pothole on road " has been resolved.	f	2026-05-06 14:06:50.491801	40
6	1	Your reported issue "minor crack on the wall" has been resolved.	f	2026-05-06 14:22:48.74262	41
7	1	Your reported issue "crack in wall" has been resolved.	f	2026-05-13 02:41:10.034988	39
8	5	Your reported issue "test" has been resolved.	t	2026-05-13 02:56:13.507553	36
9	5	Your reported issue "broken office chair" has been resolved.	f	2026-05-13 15:18:06.004038	46
10	5	Your reported issue "minor crack on wall" has been resolved.	f	2026-05-13 15:33:38.325875	48
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: arohisingh
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	0	<< Flyway Baseline >>	BASELINE	<< Flyway Baseline >>	\N	arohisingh	2026-05-12 14:39:07.956839	0	t
2	1	init	SQL	V1__init.sql	313733491	arohisingh	2026-05-12 14:39:07.990721	9	t
\.


--
-- Data for Name: risk; Type: TABLE DATA; Schema: public; Owner: arohisingh
--

COPY public.risk (id, text, description, severity, category, impact, recommendations, priority, created_at) FROM stdin;
9	Fire hazard due to exposed wiring	Exposed wiring poses a significant fire hazard due to potential electrical sparks or short circuits	High	Safety	Risk of fire, injury, or death to individuals and damage to property	\N	\N	2026-05-02 06:56:48.657637
11	Dim lighting in office hallway	Dim lighting in the office hallway may cause tripping hazards, eye strain, and decreased visibility, potentially leading to accidents or injuries	Medium	Safety	Increased risk of slips, trips, and falls, potentially resulting in employee injuries and workers' compensation claims	\N	\N	2026-05-02 07:07:59.599223
12	Dim lighting in office hallway	Dim lighting in the office hallway can lead to tripping hazards and accidents, particularly in areas with stairs or uneven flooring	Medium	Safety	Potential for employee injuries and workers' compensation claims	\N	\N	2026-05-02 07:10:16.93773
13	Dim lighting in office hallway	Dim lighting in the office hallway can cause tripping hazards, eye strain, and decreased visibility, potentially leading to accidents or injuries	Medium	Safety	Increased risk of slips, trips, and falls, potentially resulting in employee injuries and workers' compensation claims	\N	\N	2026-05-02 07:13:11.483474
14	system slow af during lunch time users complaining	System performance degradation during peak usage hours, specifically lunch time, resulting in user complaints	Medium	Technical	Reduced user satisfaction and potential loss of productivity	\N	\N	2026-05-02 08:53:55.788711
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: arohisingh
--

COPY public.risks (id, description, latitude, longitude, risk_score, severity, ai_summary, created_at, status, recommendations, user_id, image_url, image, assigned_team, assigned_at, assigned_by) FROM stdin;
25	Fire outbreak in warehouse storing flammable chemicals	12.9732913	77.6404672	90	CRITICAL	A fire outbreak in a warehouse storing flammable chemicals poses a significant risk of damage, injury, or loss of life due to the potential for rapid escalation and spread of the fire.	2026-05-05 19:20:10.254441	RESOLVED	["Develop an emergency response plan to ensure rapid evacuation and fire suppression in case of a fire outbreak.", "Conduct regular inspections of the warehouse to identify and mitigate potential fire hazards.", "Ensure proper storage and handling of flammable chemicals, including adherence to relevant safety regulations and standards.", "Train warehouse staff on fire safety procedures and emergency response protocols.", "Implement regular fire drills and exercises to ensure preparedness in case of a fire emergency."]	\N	\N	\N	\N	2026-05-13 02:52:33.834731	3
26	Cracks observed in bridge structure with heavy traffic	12.9957428	77.7579489	90	CRITICAL	Cracks observed in bridge structure with heavy traffic, posing significant risk to vehicle safety.	2026-05-05 19:20:52.535241	ACTIVE	["Immediately halt heavy traffic on the bridge to prevent further damage.", "Inspect bridge structure to identify and assess the extent of damage.", "Develop and implement a repair plan to ensure structural integrity.", "Perform load tests to verify the bridge's ability to handle traffic safely."]	\N	\N	\N	\N	\N	\N
34	Short circuit causing smoke in office electrical panel	13.0709526	77.5902597	85	CRITICAL	Smoke in office electrical panel indicates a short circuit, posing a significant fire hazard and potential life-threatening risk.	2026-05-05 20:08:07.678758	ACTIVE	["Evacuate the area immediately and notify the fire department.", "Disconnect power to the electrical panel to prevent further damage or spark.", "Perform a thorough investigation and inspection of the electrical system to identify and rectify the cause of the short circuit."]	\N	\N	\N	\N	\N	\N
35	Exposed Electrical Wiring	13.1221959	77.6306863	80	HIGH	Exposed electrical wiring poses a serious hazard and requires immediate attention to prevent potential electrical shock or fire.	2026-05-05 22:01:00.106296	RESOLVED	["Disconnect power supply to the affected area", "Call a licensed electrician to repair or replace the exposed wiring", "Ensure all necessary safety precautions are taken to prevent electrical shock or other hazards"]	\N	\N	\N	\N	\N	\N
33	water leakage in building	13.0937807	77.5956148	50	MEDIUM	Moderate risk of water leakage causing injury if ignored	2026-05-05 20:06:19.491935	IN_PROGRESS	["Notify building management or maintenance team to inspect and repair the leak", "Ensure the area is vacated to prevent slipping hazards", "Take steps to minimize water damage"]	\N	\N	\N	\N	2026-05-13 02:52:46.603346	3
36	Gas leak near parking area	12.941559	77.5659889	80	HIGH	Immediate attention is required due to a gas leak near the parking area, which poses a serious hazard.	2026-05-05 23:43:45.099493	RESOLVED	["Evacuate the area immediately and restrict access to the parking lot.", "Notify emergency services and follow their instructions.", "Conduct a thorough investigation to identify the cause of the leak and prevent future incidents."]	1	\N	\N	\N	\N	\N
44	flooding in server room	13.135716140688126	77.57137988468924	70	HIGH	Flooding in the server room poses a significant risk to equipment and data, potentially causing electrical shock, damage to hardware, and disruption of critical services	2026-05-13 14:19:01.594516	RESOLVED	["Immediately shut down all servers and electrical equipment to prevent damage and electrical shock", "Activate the server room drainage system and use wet vacuums to remove water", "Conduct a thorough assessment of the damage and inspect for any potential hazards such as exposed wiring or contaminated water", "Notify the facilities management team to investigate the cause of the flooding and take corrective action to prevent future occurrences"]	\N	\N	uploads/535d400be0f9469b9b8e7f6c83f02ed0	GENERAL_RESPONSE_TEAM	2026-05-13 14:19:42.725238	3
38	crack in wall	13.135497044403726	77.57145979026828	55	MEDIUM	A cracked wall may pose a moderate risk and cause injury if ignored.	2026-05-06 09:52:33.114632	RESOLVED	["Have a professional assess and repair the cracked wall to prevent further damage.", "Inspect the surrounding area for any signs of structural damage or instability."]	1	\N	uploads/7f06416100eebfef5cf386cdb2d51c56	\N	\N	\N
43	Coffee spillage	13.135809400996655	77.57132832473198	50	MEDIUM	The image may contain a hazardous or unsafe condition due to coffee spillage, potentially causing slips, trips, or falls	2026-05-13 03:06:35.612897	ACTIVE	["Clean the spill immediately to prevent slipping hazards", "Place warning signs around the area to alert others of the spill", "Mop the floor with a suitable cleaning solution to remove any remaining residue", "Check for any damage to nearby equipment or property"]	\N	\N	uploads/fb745c9465fb44e380b9f9b1a914b341	GENERAL_RESPONSE_TEAM	\N	\N
37	some wiring issue in office	12.9342358	77.5343239	60	MEDIUM	A moderate risk of injury due to a potential electrical issue.	2026-05-06 02:39:30.893163	IN_PROGRESS	["Immediately shut off the power source to prevent electrical shock.", "Call a licensed electrician to inspect and repair the wiring issue."]	1	\N	uploads/92faf2c0f6f124eb984110b1b0e91f84	\N	2026-05-06 10:50:33.471497	\N
41	minor crack on the wall	13.134432107608804	77.56827618191843	55	MEDIUM	Moderate risk: A minor crack on the wall may cause injury if ignored.	2026-05-06 14:22:10.116225	RESOLVED	["Inspect the crack thoroughly to identify the cause and severity.", "Consider hiring a professional to repair the crack to prevent further damage or hazards.", "Ensure the area around the crack is secure to avoid accidents or injuries."]	1	\N	uploads/8900d48bc2a0fb53f9de88c51da87e6d	CIVIL_ENGINEERING_TEAM	2026-05-06 14:22:36.421749	\N
40	big pothole on road 	13.134834327094033	77.56837128420146	50	MEDIUM	Moderate risk of road damage. A big pothole on the road may cause injury if ignored.	2026-05-06 14:05:46.805513	RESOLVED	["Take caution when driving around the pothole.", "Report the issue to the authorities for prompt repair."]	1	\N	\N	CIVIL_ENGINEERING_TEAM	2026-05-06 14:06:35.650103	\N
42	fire breakout	13.0709526	77.5902597	0	UNKNOWN	AI analysis unavailable	2026-05-13 02:00:50.905747	RESOLVED	["Manual review required"]	\N	\N	uploads/dc36339f55dd4e0e945401db96c75456	FIRE_RESPONSE_TEAM	\N	\N
39	crack in wall	13.0329471	77.7351683	55	MEDIUM	Moderate risk, May cause injury if ignored. Crack in wall can weaken the structure and potentially lead to collapse or sharp edges.	2026-05-06 10:41:11.135529	RESOLVED	["Immediately inspect the wall for further damage or cracks", "Secure the area to prevent accidents and injuries", "Consider consulting a structural engineer or taking prompt repairs"]	1	\N	uploads/5a46ab83fbf41dcc505235a93a2e3e9c	CIVIL_ENGINEERING_TEAM	2026-05-06 10:41:30.183071	\N
32	Water spill near office desk	13.13568246527023	77.57135932177621	5	LOW	Minor water spill near office desk with no immediate danger.	2026-05-05 20:02:37.723288	RESOLVED	["Clean up the spilled water immediately to prevent any slipping hazards.", "Check the office desk and surrounding area for any electrical equipment that may have been damaged by water exposure.", "Dry the area thoroughly to prevent any water damage or mold growth."]	\N	\N	\N	\N	2026-05-13 02:47:12.726826	3
45	broken window	13.13564116688725	77.57145464942806	50	MEDIUM	A broken window may cause physical harm or injury from sharp edges or falling glass	2026-05-13 15:09:51.784956	RESOLVED	["Secure the broken window with a temporary cover to prevent injury from sharp edges", "Clean up any broken glass to prevent slipping hazards", "Schedule a permanent repair or replacement of the window as soon as possible", "Warn others in the vicinity of the broken window to exercise caution"]	\N	\N	uploads/5ba5fc91b07044f492680c016136b754	GENERAL_RESPONSE_TEAM	2026-05-13 15:10:48.072999	3
46	broken office chair	13.1288782	77.5872496	50	MEDIUM	A broken office chair poses a tripping hazard and may cause injury to users	2026-05-13 15:16:26.573928	RESOLVED	["Replace the broken office chair immediately", "Conduct a thorough inspection of all office furniture to identify potential hazards", "Train employees on proper chair usage and maintenance", "Consider implementing a regular furniture inspection and maintenance schedule"]	5	\N	\N	GENERAL_RESPONSE_TEAM	2026-05-13 15:18:03.033772	3
47	Minor flickering in one office light bulb	13.0937807	77.5956148	30	LOW	Minor flickering in one office light bulb, potentially causing distraction or discomfort	2026-05-13 15:19:31.212274	ACTIVE	["Replace the flickering light bulb with a new one", "Check the electrical connection to ensure it is secure", "Inspect other light bulbs in the office for similar issues", "Consider scheduling a routine maintenance check for all office lighting"]	5	\N	\N	GENERAL_RESPONSE_TEAM	\N	\N
48	minor crack on wall	13.135622015651494	77.57142840278831	30	LOW	A minor crack on the wall may indicate a potential structural issue, but it does not pose an immediate threat to safety	2026-05-13 15:32:56.823764	RESOLVED	["Inspect the crack to determine its cause and assess for any signs of structural damage", "Seal the crack with a suitable sealant to prevent further damage from water or pests", "Monitor the crack for any changes or signs of expansion, and consider consulting a structural engineer if necessary", "Develop a plan for regular inspections and maintenance to prevent similar issues in the future"]	5	\N	uploads/2682956afff741d9b332457dfabd31c1	CIVIL_ENGINEERING_TEAM	2026-05-13 15:33:34.008174	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: arohisingh
--

COPY public.users (id, email, role, created_at, password, name) FROM stdin;
3	arohisingh2456@gmail.com	ADMIN	2026-05-05 13:21:26.987423	$2b$10$WN9F54w8kPNjCCuTiEwyouFvpc/ebM1QREn5Xqt.8FZKG6Sj50qVq	\N
5	aro@gmail.com	USER	2026-05-05 17:33:07.618719	$2b$10$ptDVG1GY280Oex5AEVaZnuY9XdmuIu.vNcF47j4yLoPnbeAZsYOSC	aro
6	singh@gmail.com	USER	2026-05-05 22:00:03.009396	$2b$10$54hSXSxkfoKA8S1y1qYAMOn5TqfwEue1uTd6VqSVcLIElRB31BLwm	singh
\.


--
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arohisingh
--

SELECT pg_catalog.setval('public.alerts_id_seq', 10, true);


--
-- Name: risk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arohisingh
--

SELECT pg_catalog.setval('public.risk_id_seq', 14, true);


--
-- Name: risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arohisingh
--

SELECT pg_catalog.setval('public.risks_id_seq', 48, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arohisingh
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: risk risk_pkey; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.risk
    ADD CONSTRAINT risk_pkey PRIMARY KEY (id);


--
-- Name: risks risks_pkey; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: arohisingh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: arohisingh
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_alerts_user; Type: INDEX; Schema: public; Owner: arohisingh
--

CREATE INDEX idx_alerts_user ON public.alerts USING btree (user_id);


--
-- Name: idx_risks_severity; Type: INDEX; Schema: public; Owner: arohisingh
--

CREATE INDEX idx_risks_severity ON public.risks USING btree (severity);


--
-- Name: idx_risks_status; Type: INDEX; Schema: public; Owner: arohisingh
--

CREATE INDEX idx_risks_status ON public.risks USING btree (status);


--
-- PostgreSQL database dump complete
--

\unrestrict fZoAbXTasXHP5UVgttDSQGz9Wa0nQFtNn00R9KCa6Puae8ZGJPceu7PN9DUSnDy

