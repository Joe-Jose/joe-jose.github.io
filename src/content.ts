/**
 * Single source of truth for Joe Jose's portfolio copy, links, and placeholders.
 * Leave any optional placeholder string empty ("") to hide that element cleanly.
 */

export const PLACEHOLDERS = {
  GITHUB_URL: 'https://github.com/Joe-Jose',
  STM_JOURNAL_LINK:
    'https://stmjournals.celnet.in/rtsrt/2026/aquasential-autonomous-uav-based-water-quality-monitoring-system/',
  RESUME_PDF: '/resume.pdf',
  PROFILE_PHOTO: '/profile.jpg',
} as const;

export interface ProjectItem {
  id: string;
  ref: string;
  packageCode: string;
  title: string;
  subtitle: string;
  period: string;
  featured?: boolean;
  summary: string;
  highlights: string[];
  pins: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface ExperienceItem {
  rev: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface SkillRow {
  ref: string;
  component: string;
  category:
    | 'Languages'
    | 'Embedded & Firmware'
    | 'Hardware & MCUs'
    | 'Protocols & HDLs'
    | 'Tools & EDA'
    | 'Engineering';
  specNote: string;
}

export const SITE_META = {
  boardName: 'JJ-BOARD // REV 2026',
  title: 'Joe Jose — Embedded Software & Firmware Engineer',
  location: 'Kottayam, Kerala',
  footerSilkscreen: 'REV 2026 / DESIGNED & ROUTED IN KERALA',
} as const;

export const HERO_CONTENT = {
  ref: 'U0',
  chipLabel: 'JJ-SOC-26',
  name: 'JOE JOSE',
  role: 'Embedded Software / Firmware Engineer',
  tagline: 'Low-power firmware, RTOS, sensor interfacing and TinyML at the edge.',
  statusText: 'Open to Embedded / Firmware roles',
  bootLines: [
    '[ OK ] clk 80MHz',
    '[ OK ] i2c scan',
    '[ OK ] freertos scheduler',
    '[ OK ] tflm init',
    '[ OK ] ready',
  ],
  primaryCta: 'View projects',
  secondaryCta: 'Download resume',
} as const;

export const ABOUT_CONTENT = {
  ref: 'U1',
  partNumber: 'JJ-2005',
  packageType: 'QFP // B.Tech ECE (Honors in VLSI)',
  generalDescription:
    'ECE undergraduate (Honors in VLSI) seeking an Embedded Software / Firmware Engineer role. Hands-on across the embedded stack: low-power firmware in Embedded C/C++ on ESP32 C3/S3, RTOS-based development with FreeRTOS and ESP-IDF, sensor interfacing over I2C/SPI/UART, hardware debugging, and TinyML at the edge. Published IoT research in STM Journals and currently building a real-time vibration-diagnostics module with TensorFlow Lite Micro.',
  keyFeatures: [
    'Low-power Embedded C/C++ firmware on ESP32-C3 and ESP32-S3 (~97% deep-sleep power reduction demonstrated)',
    'RTOS firmware architecture with FreeRTOS tasks and queues on ESP-IDF',
    'Sensor interfacing over I2C, SPI, and UART with prototype-level hardware debugging',
    'On-device edge inference using TinyML / TensorFlow Lite Micro',
    'Published IoT research in STM Journals (AquaSential autonomous water monitoring)',
    'B.Tech ECE with Honors in VLSI (Digital System Design, Verilog/VHDL, Microcontroller Architecture)',
  ],
  pinSpecs: [
    { pin: 'PIN 01', parameter: 'ROLE', value: 'Embedded Software / Firmware Engineer' },
    { pin: 'PIN 02', parameter: 'LOCATION', value: 'Kottayam, Kerala' },
    { pin: 'PIN 03', parameter: 'EDUCATION', value: 'B.Tech ECE (Honors in VLSI) · 2023–2027' },
    { pin: 'PIN 04', parameter: 'FOCUS', value: 'Low-Power Firmware, FreeRTOS, Edge TinyML, VLSI DV' },
  ],
} as const;

export const PROJECTS_CONTENT: ProjectItem[] = [
  {
    id: 'adaptive-compute-module',
    ref: 'U2',
    packageCode: 'QFP-48 // ACTIVE',
    title: 'Adaptive Compute Module for Rotary Diagnostics',
    subtitle: 'Real-time vibration monitoring & TinyML edge-to-cloud inference',
    period: 'June 2026 – Present',
    featured: true,
    summary:
      'TinyML edge module for rotary machinery performing continuous vibration monitoring and failure detection directly on-device.',
    highlights: [
      'Developing a TinyML edge module for rotary machinery that performs continuous vibration monitoring and failure detection on-device.',
      'Firmware on ESP-IDF with FreeRTOS tasks and queues, separating vibration sampling, feature extraction and TensorFlow Lite Micro inference so sampling stays uninterrupted.',
      'Implementing adaptive edge-to-cloud inference to balance on-device and cloud compute load in real time.',
    ],
    pins: ['ESP32-S3', 'ESP-IDF', 'FreeRTOS', 'TFLM', 'TinyML', 'I2C/SPI'],
    githubUrl: '',
    demoUrl: '',
  },
  {
    id: 'aquasential',
    ref: 'U3',
    packageCode: 'SOIC-16 // PUBLISHED',
    title: 'AquaSential — UAV Deployed Water Monitor',
    subtitle: 'Autonomous drone-deployable multi-sensor IoT node',
    period: 'March 2026',
    summary:
      'Drone-deployable IoT module integrating a multi-sensor array to monitor water parameters and autonomously predict amoeba development in remote environments.',
    highlights: [
      'Engineered a drone-deployable IoT module with a multi-sensor array to monitor water parameters and autonomously predict amoeba development in remote environments.',
      'Published the research in STM Journals, detailing the module’s autonomous prediction capability.',
    ],
    pins: ['ESP32-S3', 'Multi-Sensor Array', 'C++', 'UART'],
    githubUrl: '',
    demoUrl: '',
  },
  {
    id: 'havncraft-firmware',
    ref: 'U4',
    packageCode: 'QFN-24 // PRODUCTION',
    title: 'Low-Power DAQ Firmware (HAVNCRAFT)',
    subtitle: 'Battery-operated ESP32-C3 acquisition & deep-sleep pipeline',
    period: 'Jan 2026 – July 2026',
    summary:
      'End-to-end sensor acquisition, firmware optimization, and hardware debugging engineered within strict cost and power envelopes.',
    highlights: [
      'Developed optimized C++ firmware for the ESP32-C3 using deep-sleep cycles, reducing power consumption by ~97% for battery-operated deployment.',
      'Designed an end-to-end data acquisition pipeline (sensor interfacing, firmware, data transfer) under a bill-of-materials constraint of Rs. 1,500.',
      'Carried out hardware debugging on the prototype while meeting both cost and power constraints.',
    ],
    pins: ['ESP32-C3', 'C++', 'Deep-Sleep', 'I2C', 'SPI'],
    githubUrl: '',
    demoUrl: '',
  },
  {
    id: 'sign-language-translator',
    ref: 'U5',
    packageCode: 'SOP-14 // VISION',
    title: 'ESP32-CAM Sign Language Translator',
    subtitle: 'Low-latency edge vision gesture capture & translation',
    period: 'April 2025',
    summary:
      'Low-latency edge device combining embedded camera capture with OpenCV and Python processing to translate sign-language gestures in real time.',
    highlights: [
      'Built a low-latency edge device using computer vision to capture, process and translate sign-language gestures in real time.',
    ],
    pins: ['ESP32-CAM', 'OpenCV', 'Python', 'UART'],
    githubUrl: '',
    demoUrl: '',
  },
];

export const EXPERIENCE_CONTENT: ExperienceItem[] = [
  {
    rev: 'REV A',
    role: 'Embedded Systems Intern',
    organization: 'HAVNCRAFT Technologies',
    location: 'Kerala',
    period: 'Jan 2026 – July 2026',
    bullets: [
      'Developed optimized C++ firmware for the ESP32-C3 using deep-sleep cycles, reducing power consumption by ~97% for battery-operated deployment.',
      'Designed an end-to-end data acquisition pipeline (sensor interfacing, firmware, data transfer) under a bill-of-materials constraint of Rs. 1,500.',
      'Carried out hardware debugging on the prototype while meeting both cost and power constraints.',
    ],
  },
];

export const PUBLICATION_CONTENT = {
  ref: 'DOC1',
  badge: 'Published in STM Journals',
  title: 'AquaSential: Autonomous UAV-Based Water Quality Monitoring System',
  description:
    'Peer-reviewed IoT publication detailing the drone-deployable multi-sensor water monitoring module and its autonomous amoeba-development prediction capability in remote environments.',
  linkLabel: 'Read paper in STM Journals',
  url: PLACEHOLDERS.STM_JOURNAL_LINK,
} as const;

export const BOM_SKILLS: SkillRow[] = [
  { ref: 'SW1', component: 'C', category: 'Languages', specNote: 'Embedded firmware & systems programming' },
  { ref: 'SW2', component: 'C++', category: 'Languages', specNote: 'ESP32 firmware & OOP drivers' },
  { ref: 'SW3', component: 'Python', category: 'Languages', specNote: 'OpenCV pipelines, tooling & automation' },

  { ref: 'FW1', component: 'FreeRTOS (tasks, queues)', category: 'Embedded & Firmware', specNote: 'Deterministic multi-task scheduling' },
  { ref: 'FW2', component: 'ESP-IDF', category: 'Embedded & Firmware', specNote: 'Native Espressif SDK & driver stack' },
  { ref: 'FW3', component: 'TinyML / TensorFlow Lite Micro', category: 'Embedded & Firmware', specNote: 'On-device edge vibration inference' },

  { ref: 'IC1', component: 'ESP32 (C3, S3, CAM)', category: 'Hardware & MCUs', specNote: 'RISC-V / Xtensa dual-core & camera SoCs' },
  { ref: 'IC2', component: 'Arduino', category: 'Hardware & MCUs', specNote: 'Rapid sensor bring-up & prototyping' },
  { ref: 'IC3', component: 'Raspberry Pi', category: 'Hardware & MCUs', specNote: 'Linux SBC & edge compute integration' },
  { ref: 'HW1', component: 'Circuit Design', category: 'Hardware & MCUs', specNote: 'Schematic capture & BOM-constrained design' },
  { ref: 'HW2', component: 'Hardware Debugging', category: 'Hardware & MCUs', specNote: 'Board bring-up, power & signal checks' },

  { ref: 'BUS1', component: 'I2C', category: 'Protocols & HDLs', specNote: 'Multi-sensor synchronous serial bus' },
  { ref: 'BUS2', component: 'SPI', category: 'Protocols & HDLs', specNote: 'High-rate sensor & peripheral bus' },
  { ref: 'BUS3', component: 'UART', category: 'Protocols & HDLs', specNote: 'Serial telemetry, console & bridges' },
  { ref: 'HDL1', component: 'Verilog / VHDL', category: 'Protocols & HDLs', specNote: 'RTL modeling & VLSI Honors track' },

  { ref: 'EDA1', component: 'KiCad', category: 'Tools & EDA', specNote: 'Schematic & PCB layout' },
  { ref: 'EDA2', component: 'Proteus', category: 'Tools & EDA', specNote: 'Circuit & MCU simulation' },
  { ref: 'EDA3', component: 'MATLAB', category: 'Tools & EDA', specNote: 'Signal processing & modeling' },
  { ref: 'DEV1', component: 'Git · Linux · VS Code · PlatformIO', category: 'Tools & EDA', specNote: 'Version control & embedded toolchain' },

  { ref: 'ENG1', component: 'Rapid Learning · Adaptability · Problem Solving', category: 'Engineering', specNote: 'Cross-stack debug & constraint execution' },
];

export const BOM_FOOTER_NOTE = 'Project BOM constraint met: Rs. 1,500';

export const EDUCATION_CONTENT = {
  ref: 'U6',
  institution: 'Amal Jyothi College of Engineering',
  degree: 'B.Tech in Electronics & Communication Engineering (ECE)',
  honors: 'Honors in VLSI',
  gpa: '8.15 / 10',
  period: '2023 – 2027',
  coursework: [
    'Microcontroller Architecture',
    'C Programming',
    'Digital System Design',
    'Logic Circuit Design',
    'Analog Circuits',
    'Network Theory',
    'Information Theory',
    'Analog Communication',
  ],
} as const;

export const CONTACT_CONTENT = {
  ref: 'J1',
  connectorLabel: '4-PIN SIL HEADER // J1',
  email: 'JoeJose2005p@gmail.com',
  linkedin: 'https://linkedin.com/in/joe-jose-298372271',
  github: PLACEHOLDERS.GITHUB_URL,
  resume: PLACEHOLDERS.RESUME_PDF,
} as const;

export const NAV_ITEMS = [
  { id: 'about', tp: 'TP1', label: 'ABOUT' },
  { id: 'projects', tp: 'TP2', label: 'PROJECTS' },
  { id: 'experience', tp: 'TP3', label: 'REV LOG' },
  { id: 'skills', tp: 'TP4', label: 'BOM' },
  { id: 'contact', tp: 'TP5', label: 'CONTACT' },
] as const;
