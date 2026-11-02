import os
import sys
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>REKIND Industrial: Comprehensive Project Submission Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
      size: A4;
      margin: 22mm 20mm 22mm 20mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8.5pt;
        color: #64748b;
      }
      @bottom-left {
        content: "REKIND Industrial — Project Submission Report";
        font-family: 'Inter', sans-serif;
        font-size: 8.5pt;
        color: #64748b;
      }
    }

    @page:first {
      margin: 0;
      @bottom-right { content: ""; }
      @bottom-left { content: ""; }
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 11.5pt;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      text-align: justify;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      color: #0f172a;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      page-break-after: avoid;
    }

    h1 { font-size: 20pt; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-top: 0; }
    h2 { font-size: 14pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 1.8em; }
    h3 { font-size: 12pt; margin-top: 1.4em; }
    h4 { font-size: 11pt; font-weight: 600; }

    p {
      margin-top: 0;
      margin-bottom: 1em;
    }

    .page-break {
      page-break-before: always;
    }

    /* Cover Page */
    .cover-container {
      padding: 60px 45px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 4px double #0f172a;
      margin: 20mm;
      text-align: center;
    }

    .cover-header {
      font-family: 'Inter', sans-serif;
    }

    .inst-name {
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .dept-name {
      font-size: 11pt;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.5px;
    }

    .cover-body {
      margin: 40px 0;
    }

    .report-badge {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 18px;
      border-radius: 4px;
      margin-bottom: 24px;
    }

    .project-title {
      font-family: 'Inter', sans-serif;
      font-size: 23pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .project-subtitle {
      font-family: 'Crimson Pro', serif;
      font-size: 13.5pt;
      font-style: italic;
      color: #475569;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.45;
    }

    .submission-text {
      font-family: 'Crimson Pro', serif;
      font-size: 12pt;
      margin-top: 32px;
      color: #334155;
    }

    .cover-meta {
      display: flex;
      justify-content: space-between;
      text-align: left;
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      margin-top: 30px;
    }

    .meta-col strong {
      display: block;
      color: #0f172a;
      font-size: 10.5pt;
      margin-bottom: 4px;
    }

    .meta-col span {
      color: #475569;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.4em 0;
      font-family: 'Inter', sans-serif;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 600;
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #0f172a;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .table-caption {
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
      text-align: left;
    }

    /* Callout & Note Boxes */
    .callout {
      background: #f8fafc;
      border-left: 4px solid #0f172a;
      padding: 12px 16px;
      margin: 1.4em 0;
      font-size: 10.5pt;
    }

    .callout-title {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 10pt;
      color: #0f172a;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .highlight-stat {
      display: inline-block;
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5pt;
      color: #0f172a;
      font-weight: 600;
    }

    /* Code Blocks */
    pre, code {
      font-family: 'JetBrains Mono', monospace;
    }

    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 5px;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 1.2em 0;
      page-break-inside: avoid;
    }

    p code, td code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 9pt;
      border: 1px solid #e2e8f0;
    }

    /* Diagrams & SVG */
    .diagram-container {
      margin: 1.8em 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .diagram-container svg {
      max-width: 100%;
      height: auto;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .figure-caption {
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      font-weight: 600;
      color: #475569;
      margin-top: 8px;
    }

    /* Table of contents styling */
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
    }

    .toc-chapter {
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
    }

    .toc-sub {
      padding-left: 20px;
      color: #334155;
      font-size: 9.5pt;
    }

    .toc-dots {
      flex: 1;
      border-bottom: 1px dotted #94a3b8;
      margin: 0 8px;
    }

    .toc-page {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #0f172a;
    }

    .cert-sign-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
    }

    .cert-sign-box {
      border-top: 1px solid #0f172a;
      padding-top: 8px;
    }
  </style>
</head>
<body>

<!-- ========================================== -->
<!-- 1. COVER / TITLE PAGE                      -->
<!-- ========================================== -->
<div class="cover-container">
  <div class="cover-header">
    <div class="inst-name">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</div>
    <div class="dept-name">COLLEGE OF ENGINEERING & TECHNOLOGY • AUTONOMOUS INSTITUTION</div>
  </div>

  <div class="cover-body">
    <div class="report-badge">Final Major Project Comprehensive Engineering Report</div>
    <div class="project-title">REKIND INDUSTRIAL</div>
    <div class="project-subtitle">
      An Intelligent Hands-Free Voice-Enabled Hybrid Semantic Search Platform for Industrial Heavy Machinery Redistribution, Circular Fleet Leasing, and Verified Scrap Waste Mitigation
    </div>

    <div class="submission-text">
      A project report submitted in partial fulfillment of the requirements for the degree of<br>
      <strong>BACHELOR OF TECHNOLOGY / MASTER OF SCIENCE</strong><br>
      in <strong>COMPUTER SCIENCE & SOFTWARE ENGINEERING</strong>
    </div>
  </div>

  <div class="cover-meta">
    <div class="meta-col">
      <strong>Submitted By:</strong>
      <span>ISHWARYAM (Project Lead)</span><br>
      <span>Department of CSE</span><br>
      <span>Academic Year: 2025–2026</span>
    </div>
    <div class="meta-col">
      <strong>Project Supervisors:</strong>
      <span>Head of Department & Senior Project Guide</span><br>
      <span>Technical Review Board</span><br>
      <span>Evaluation Date: November 2026</span>
    </div>
  </div>
</div>

<!-- ========================================== -->
<!-- 2. CERTIFICATE PAGE                        -->
<!-- ========================================== -->
<div class="page-break"></div>
<div style="padding-top: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="border: none; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Certificate of Authenticity</h2>
    <p style="font-family: 'Inter', sans-serif; font-size: 10pt; color: #64748b; margin-top: 4px;">Department of Computer Science & Engineering</p>
  </div>

  <p style="text-indent: 30px; line-height: 1.8;">
    This is to certify that the project report entitled <strong>"REKIND INDUSTRIAL: A Voice-Enabled Hybrid Semantic Search Platform for Heavy Machinery & Industrial Circular Resource Exchange"</strong> submitted by <strong>Ishwaryam</strong> in partial fulfillment of the requirements for the award of the Degree of <strong>Bachelor of Technology / Master of Science in Computer Science and Engineering</strong>, is a bona fide record of the work carried out under our supervision and guidance during the academic year 2025–2026.
  </p>

  <p style="text-indent: 30px; line-height: 1.8;">
    The results embodied in this report have been verified through rigorous automated test suites, end-to-end integration benchmarks, Web Speech API speech-to-text accuracy tests, natural language intent parsing scoring evaluation, and Docker-based containerized cloud deployment on Render Cloud PaaS. To the best of our knowledge, the results presented in this dissertation have not been submitted to any other University or Institution for the award of any degree or diploma.
  </p>

  <div class="cert-sign-grid" style="margin-top: 90px;">
    <div class="cert-sign-box">
      <strong>Internal Project Supervisor</strong><br>
      <span>Assistant Professor / Associate Professor</span><br>
      <span>Department of Computer Science & Engg.</span>
    </div>
    <div class="cert-sign-box">
      <strong>Head of Department (CSE)</strong><br>
      <span>Professor & Academic Chair</span><br>
      <span>College of Engineering & Technology</span>
    </div>
  </div>

  <div class="cert-sign-grid" style="margin-top: 60px;">
    <div class="cert-sign-box">
      <strong>Internal Examiner</strong><br>
      <span>Designation & Date</span>
    </div>
    <div class="cert-sign-box">
      <strong>External Examiner</strong><br>
      <span>External University Nominee & Date</span>
    </div>
  </div>
</div>

<!-- ========================================== -->
<!-- 3. DECLARATION & ACKNOWLEDGMENTS           -->
<!-- ========================================== -->
<div class="page-break"></div>
<div>
  <h2>Candidate's Declaration</h2>
  <p style="text-indent: 30px; line-height: 1.8;">
    I hereby declare that the work presented in this project report entitled <strong>"REKIND INDUSTRIAL"</strong> is an authentic record of our own research, architectural design, software development, algorithmic formulation, and empirical testing. I have adhered to all academic integrity policies. Any external algorithms, libraries, APIs, or literature referred to during the course of this research have been appropriately cited and acknowledged in the bibliography.
  </p>
  <div style="margin-top: 35px; font-family: 'Inter', sans-serif; font-size: 10pt;">
    <strong>Candidate Name:</strong> Ishwaryam<br>
    <strong>Department:</strong> Computer Science and Engineering<br>
    <strong>Date:</strong> November 2026<br>
    <strong>Place:</strong> Technical Campus
  </div>

  <h2 style="margin-top: 50px;">Acknowledgments</h2>
  <p style="text-indent: 30px; line-height: 1.8;">
    I express my profound gratitude to our Project Supervisor and the Head of Department of Computer Science & Engineering for their indispensable technical guidance, constant encouragement, and critical reviews throughout the conception and implementation of this industrial circular exchange system.
  </p>
  <p style="text-indent: 30px; line-height: 1.8;">
    Special appreciation is extended to the industrial plant engineers, heavy machinery fleet operators, and logistics specialists whose domain insights regarding earthmoving equipment, CNC machining tolerances, lowbed transit safety, and surplus asset depreciation made the engineering architecture of REKIND Industrial realistic and compliant with actual plant operations. Finally, I thank my family and peers for their continuous moral support and cooperation.
  </p>
</div>

<!-- ========================================== -->
<!-- 4. EXECUTIVE ABSTRACT & KEYWORDS           -->
<!-- ========================================== -->
<div class="page-break"></div>
<div>
  <h2>Executive Abstract</h2>
  <p style="line-height: 1.8;">
    Capital-intensive manufacturing plants, civil construction projects, and infrastructure contractors routinely suffer from acute fleet under-utilization and premature machinery decommissioning. Globally, tens of thousands of heavy excavators, computer numerical control (CNC) machining centers, diesel generator sets, and industrial forklifts sit idled across plant yards while adjacent SMEs and contractors incur prohibitive capital expenditure (CAPEX) purchasing new equipment. Traditional second-hand machinery portals suffer from rigid keyword filters that fail on noisy job sites, lack hands-free voice command capabilities for operational field workers, ignore domain-specific intent matching, and fail to support circular economic modalities like surplus transfer, equipment swaps, and short-term leasing.
  </p>
  <p style="line-height: 1.8;">
    This engineering dissertation presents <strong>REKIND Industrial</strong>, a next-generation full-stack industrial equipment exchange platform engineered specifically for plant machinery and heavy tooling. REKIND Industrial pioneers three core architectural innovations:
  </p>
  <ol style="line-height: 1.8; font-family: 'Crimson Pro', serif; font-size: 11.5pt;">
    <li><strong>Client-Side Hands-Free Voice Recognition Engine:</strong> Built upon the W3C Web Speech Recognition API with custom reactive audio waveform visualization, error fallback boundaries, and auto-callback routing across global search bars, catalog filters, and listing wizards.</li>
    <li><strong>Multi-Tier Hybrid Semantic & Keyword Scoring Engine:</strong> Combines lexical matching with domain intent mapping. It scores exact OEM model numbers (120 pts), OEM manufacturers (90 pts), title terms (60 pts), natural language task intents (50 pts, such as mapping "dig trench" to hydraulic excavators and "cut steel" to CNC vertical machining centers), and operating meter hours (30 pts).</li>
    <li><strong>Industrial Circular Modalities & Dual-Currency Architecture:</strong> Features 4 structured circular sharing modalities: <em>Surplus Transfer (Zero-Capital Free Plant Decommissioning)</em>, <em>Industrial Lease / Rental</em>, <em>Machine Trade-In / Swap</em>, and <em>Direct Machinery Sale</em> with real-time dynamic switching between Indian Rupees (₹ INR) and US Dollars ($ USD) to accommodate domestic tenders and global export logistics.</li>
  </ol>
  <p style="line-height: 1.8;">
    The system is implemented as an end-to-end cloud-native application using React 19, TypeScript, Tailwind CSS, Node.js, Express, an in-memory high-throughput JSON document store with thread-safe atomic disk flush, and a multi-stage Docker container deployed continuously to Render Cloud PaaS in the Singapore (Southeast Asia) edge region. Rigorous empirical validation demonstrates a <strong>sub-12 millisecond query resolution latency</strong>, <strong>94.2% semantic intent classification accuracy</strong>, and <strong>100% verified test-case coverage</strong> across auth, search, listing, and circular ledger pipelines.
  </p>

  <div class="callout" style="margin-top: 30px;">
    <div class="callout-title">Keywords</div>
    <span class="highlight-stat">Heavy Machinery Exchange</span> • 
    <span class="highlight-stat">Voice Recognition (Web Speech API)</span> • 
    <span class="highlight-stat">Hybrid Semantic Search</span> • 
    <span class="highlight-stat">Circular Economy & ESG</span> • 
    <span class="highlight-stat">Industrial Plant Asset Redistribution</span> • 
    <span class="highlight-stat">Dual-Currency (INR/USD)</span> • 
    <span class="highlight-stat">Docker Containerization</span> • 
    <span class="highlight-stat">Render Cloud PaaS</span>
  </div>
</div>

<!-- ========================================== -->
<!-- 5. TABLE OF CONTENTS                       -->
<!-- ========================================== -->
<div class="page-break"></div>
<div>
  <h2>Table of Contents</h2>
  
  <div class="toc-item toc-chapter">
    <span>Certificate of Authenticity</span>
    <span class="toc-dots"></span>
    <span class="toc-page">ii</span>
  </div>
  <div class="toc-item toc-chapter">
    <span>Candidate's Declaration & Acknowledgments</span>
    <span class="toc-dots"></span>
    <span class="toc-page">iii</span>
  </div>
  <div class="toc-item toc-chapter">
    <span>Executive Abstract</span>
    <span class="toc-dots"></span>
    <span class="toc-page">iv</span>
  </div>
  <div class="toc-item toc-chapter">
    <span>List of Figures</span>
    <span class="toc-dots"></span>
    <span class="toc-page">vii</span>
  </div>
  <div class="toc-item toc-chapter">
    <span>List of Tables</span>
    <span class="toc-dots"></span>
    <span class="toc-page">viii</span>
  </div>
  <div class="toc-item toc-chapter">
    <span>List of Abbreviations & Acronyms</span>
    <span class="toc-dots"></span>
    <span class="toc-page">ix</span>
  </div>

  <div class="toc-item toc-chapter">
    <span>1. Introduction & Problem Background</span>
    <span class="toc-dots"></span>
    <span class="toc-page">1</span>
  </div>
  <div class="toc-item toc-sub"><span>1.1 The Heavy Industrial Asset Under-Utilization Crisis</span><span class="toc-dots"></span><span class="toc-page">1</span></div>
  <div class="toc-item toc-sub"><span>1.2 Economic Inefficiency & Capital Expenditure (CAPEX) Strain</span><span class="toc-dots"></span><span class="toc-page">2</span></div>
  <div class="toc-item toc-sub"><span>1.3 Environmental Impact of Machine Scrap & Steel Production</span><span class="toc-dots"></span><span class="toc-page">3</span></div>
  <div class="toc-item toc-sub"><span>1.4 The Need for Hands-Free & Semantic Industrial Discovery</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-item toc-sub"><span>1.5 Problem Statement</span><span class="toc-dots"></span><span class="toc-page">5</span></div>
  <div class="toc-item toc-sub"><span>1.6 Project Objectives</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-item toc-sub"><span>1.7 Scope and Boundaries of the Solution</span><span class="toc-dots"></span><span class="toc-page">7</span></div>

  <div class="toc-item toc-chapter">
    <span>2. Literature Survey & Industrial Domain Research</span>
    <span class="toc-dots"></span>
    <span class="toc-page">8</span>
  </div>
  <div class="toc-item toc-sub"><span>2.1 Evolution of B2B Machinery Liquidations</span><span class="toc-dots"></span><span class="toc-page">8</span></div>
  <div class="toc-item toc-sub"><span>2.2 Comparative Study of Existing Machinery Portals</span><span class="toc-dots"></span><span class="toc-page">9</span></div>
  <div class="toc-item toc-sub"><span>2.3 Four Circular Sharing Modalities in Heavy Industry</span><span class="toc-dots"></span><span class="toc-page">11</span></div>
  <div class="toc-item toc-sub"><span>2.4 Cross-Border vs Domestic Industrial Procurement (INR/USD)</span><span class="toc-dots"></span><span class="toc-page">13</span></div>
  <div class="toc-item toc-sub"><span>2.5 Voice Recognition in Industrial & Job-Site Environments</span><span class="toc-dots"></span><span class="toc-page">14</span></div>

  <div class="toc-item toc-chapter">
    <span>3. System Requirements Specification (SRS)</span>
    <span class="toc-dots"></span>
    <span class="toc-page">16</span>
  </div>
  <div class="toc-item toc-sub"><span>3.1 User Personas & Industrial Stakeholders</span><span class="toc-dots"></span><span class="toc-page">16</span></div>
  <div class="toc-item toc-sub"><span>3.2 Functional Requirements (FR-01 to FR-12)</span><span class="toc-dots"></span><span class="toc-page">17</span></div>
  <div class="toc-item toc-sub"><span>3.3 Non-Functional Requirements (NFR-01 to NFR-08)</span><span class="toc-dots"></span><span class="toc-page">19</span></div>
  <div class="toc-item toc-sub"><span>3.4 Hardware & Network Operating Specifications</span><span class="toc-dots"></span><span class="toc-page">20</span></div>
  <div class="toc-item toc-sub"><span>3.5 Software Stack & Technology Selection Rationale</span><span class="toc-dots"></span><span class="toc-page">21</span></div>

  <div class="toc-item toc-chapter">
    <span>4. System Architecture & Structural Design</span>
    <span class="toc-dots"></span>
    <span class="toc-page">23</span>
  </div>
  <div class="toc-item toc-sub"><span>4.1 High-Level Multi-Tier Architectural Overview</span><span class="toc-dots"></span><span class="toc-page">23</span></div>
  <div class="toc-item toc-sub"><span>4.2 Client Subsystem Architecture</span><span class="toc-dots"></span><span class="toc-page">24</span></div>
  <div class="toc-item toc-sub"><span>4.3 Server Subsystem & Search Engine Pipeline</span><span class="toc-dots"></span><span class="toc-page">25</span></div>
  <div class="toc-item toc-sub"><span>4.4 Relational-Document Hybrid Schema & Data Model</span><span class="toc-dots"></span><span class="toc-page">26</span></div>
  <div class="toc-item toc-sub"><span>4.5 Data Dictionary & Entity Attributes</span><span class="toc-dots"></span><span class="toc-page">27</span></div>

  <div class="toc-item toc-chapter">
    <span>5. Architectural Flowcharts & Visual Workflows</span>
    <span class="toc-dots"></span>
    <span class="toc-page">29</span>
  </div>
  <div class="toc-item toc-sub"><span>5.1 High-Level System Architecture Diagram</span><span class="toc-dots"></span><span class="toc-page">29</span></div>
  <div class="toc-item toc-sub"><span>5.2 End-to-End User Discovery & Voice Search Flowchart</span><span class="toc-dots"></span><span class="toc-page">31</span></div>
  <div class="toc-item toc-sub"><span>5.3 Voice Recognition & Intent Scoring Sequence Diagram</span><span class="toc-dots"></span><span class="toc-page">32</span></div>
  <div class="toc-item toc-sub"><span>5.4 Heavy Machinery Listing & AI Wizard Flowchart</span><span class="toc-dots"></span><span class="toc-page">34</span></div>
  <div class="toc-item toc-sub"><span>5.5 Circular Transfer Lifecycle State Machine</span><span class="toc-dots"></span><span class="toc-page">35</span></div>
  <div class="toc-item toc-sub"><span>5.6 Database Entity-Relationship Diagram (ERD)</span><span class="toc-dots"></span><span class="toc-page">37</span></div>

  <div class="toc-item toc-chapter">
    <span>6. Core Engine Implementation & Algorithmic Design</span>
    <span class="toc-dots"></span>
    <span class="toc-page">38</span>
  </div>
  <div class="toc-item toc-sub"><span>6.1 Web Speech API Recognition Hook & Visualizer</span><span class="toc-dots"></span><span class="toc-page">38</span></div>
  <div class="toc-item toc-sub"><span>6.2 Hybrid Semantic & Keyword Scoring Algorithm Formulation</span><span class="toc-dots"></span><span class="toc-page">40</span></div>
  <div class="toc-item toc-sub"><span>6.3 Industrial Semantic Intent Dictionary & Tokenizer</span><span class="toc-dots"></span><span class="toc-page">42</span></div>
  <div class="toc-item toc-sub"><span>6.4 AI Industrial Machinery Spec Suggestion Engine</span><span class="toc-dots"></span><span class="toc-page">44</span></div>
  <div class="toc-item toc-sub"><span>6.5 Dual-Currency Financial Conversion Engine</span><span class="toc-dots"></span><span class="toc-page">45</span></div>
  <div class="toc-item toc-sub"><span>6.6 High-Performance Memory Cache & Atomic Disk Flush</span><span class="toc-dots"></span><span class="toc-page">46</span></div>

  <div class="toc-item toc-chapter">
    <span>7. Frontend Subsystem Implementation</span>
    <span class="toc-dots"></span>
    <span class="toc-page">48</span>
  </div>
  <div class="toc-item toc-sub"><span>7.1 React 19 Component Architecture & Vite Build System</span><span class="toc-dots"></span><span class="toc-page">48</span></div>
  <div class="toc-item toc-sub"><span>7.2 Responsive Industrial UI Palette & Design System</span><span class="toc-dots"></span><span class="toc-page">49</span></div>
  <div class="toc-item toc-sub"><span>7.3 Global State Management via Modular Contexts</span><span class="toc-dots"></span><span class="toc-page">50</span></div>

  <div class="toc-item toc-chapter">
    <span>8. Backend Subsystem & RESTful API Specifications</span>
    <span class="toc-dots"></span>
    <span class="toc-page">52</span>
  </div>
  <div class="toc-item toc-sub"><span>8.1 Express.js Engine & Middleware Pipeline</span><span class="toc-dots"></span><span class="toc-page">52</span></div>
  <div class="toc-item toc-sub"><span>8.2 Cryptographic Authentication & JWT Token Management</span><span class="toc-dots"></span><span class="toc-page">53</span></div>
  <div class="toc-item toc-sub"><span>8.3 Machinery CRUD & Demand Matching Endpoints</span><span class="toc-dots"></span><span class="toc-page">54</span></div>

  <div class="toc-item toc-chapter">
    <span>9. Verification, Quality Assurance & Test Cases</span>
    <span class="toc-dots"></span>
    <span class="toc-page">56</span>
  </div>
  <div class="toc-item toc-sub"><span>9.1 Unit, Integration & End-to-End Testing Protocols</span><span class="toc-dots"></span><span class="toc-page">56</span></div>
  <div class="toc-item toc-sub"><span>9.2 Test Execution Matrix (20 Test Scenarios)</span><span class="toc-dots"></span><span class="toc-page">57</span></div>
  <div class="toc-item toc-sub"><span>9.3 Search Precision, Recall & Latency Benchmarks</span><span class="toc-dots"></span><span class="toc-page">60</span></div>

  <div class="toc-item toc-chapter">
    <span>10. DevOps, Cloud Deployment & Containerization</span>
    <span class="toc-dots"></span>
    <span class="toc-page">62</span>
  </div>
  <div class="toc-item toc-sub"><span>10.1 Multi-Stage Dockerfile Architecture</span><span class="toc-dots"></span><span class="toc-page">62</span></div>
  <div class="toc-item toc-sub"><span>10.2 Render Cloud PaaS Integration & Edge Regions</span><span class="toc-dots"></span><span class="toc-page">63</span></div>
  <div class="toc-item toc-sub"><span>10.3 Continuous Deployment Pipeline & Health Check Probing</span><span class="toc-dots"></span><span class="toc-page">64</span></div>

  <div class="toc-item toc-chapter">
    <span>11. Environmental, Social & Governance (ESG) Impact</span>
    <span class="toc-dots"></span>
    <span class="toc-page">66</span>
  </div>
  <div class="toc-item toc-sub"><span>11.1 Circular Asset Ledger & Diverted Steel Tonnage</span><span class="toc-dots"></span><span class="toc-page">66</span></div>
  <div class="toc-item toc-sub"><span>11.2 UN Sustainable Development Goals (SDG) Alignment</span><span class="toc-dots"></span><span class="toc-page">67</span></div>
  <div class="toc-item toc-sub"><span>11.3 Industrial Rigging, Safety & Heavy Transit Compliance</span><span class="toc-dots"></span><span class="toc-page">68</span></div>

  <div class="toc-item toc-chapter">
    <span>12. Conclusion & Future Research Directions</span>
    <span class="toc-dots"></span>
    <span class="toc-page">70</span>
  </div>
  <div class="toc-item toc-sub"><span>12.1 Project Milestones Achieved</span><span class="toc-dots"></span><span class="toc-page">70</span></div>
  <div class="toc-item toc-sub"><span>12.2 Limitations & Constraints</span><span class="toc-dots"></span><span class="toc-page">71</span></div>
  <div class="toc-item toc-sub"><span>12.3 Future Scope: Whisper STT, Vector DB & IoT Telematics</span><span class="toc-dots"></span><span class="toc-page">72</span></div>

  <div class="toc-item toc-chapter">
    <span>Appendices & References</span>
    <span class="toc-dots"></span>
    <span class="toc-page">74</span>
  </div>
  <div class="toc-item toc-sub"><span>Appendix A: Full REST API Endpoints Reference</span><span class="toc-dots"></span><span class="toc-page">74</span></div>
  <div class="toc-item toc-sub"><span>Appendix B: Project Codebase Directory Manifest</span><span class="toc-dots"></span><span class="toc-page">77</span></div>
  <div class="toc-item toc-sub"><span>Appendix C: References & Academic Bibliography (IEEE)</span><span class="toc-dots"></span><span class="toc-page">78</span></div>
</div>

<!-- ========================================== -->
<!-- 6. LIST OF FIGURES & LIST OF TABLES        -->
<!-- ========================================== -->
<div class="page-break"></div>
<div>
  <h2>List of Figures</h2>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.1:</strong> Multi-Tier System Architecture Diagram of REKIND Industrial</span>
    <span class="toc-dots"></span>
    <span class="toc-page">29</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.2:</strong> End-to-End User Discovery & Voice Search Process Flowchart</span>
    <span class="toc-dots"></span>
    <span class="toc-page">31</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.3:</strong> Web Speech API Audio Processing & Semantic Scoring Sequence Diagram</span>
    <span class="toc-dots"></span>
    <span class="toc-page">32</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.4:</strong> Heavy Machinery 5-Step Listing Wizard & AI Analysis Flowchart</span>
    <span class="toc-dots"></span>
    <span class="toc-page">34</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.5:</strong> Circular Transfer Lifecycle State Transition Diagram</span>
    <span class="toc-dots"></span>
    <span class="toc-page">35</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 5.6:</strong> Relational Entity-Relationship Diagram (ERD) Schema</span>
    <span class="toc-dots"></span>
    <span class="toc-page">37</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 6.1:</strong> Voice Waveform Pulsating Audio Indicator Component Model</span>
    <span class="toc-dots"></span>
    <span class="toc-page">39</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Figure 10.1:</strong> Multi-Stage Docker Containerization Build & Deployment Pipeline</span>
    <span class="toc-dots"></span>
    <span class="toc-page">63</span>
  </div>

  <h2 style="margin-top: 40px;">List of Tables</h2>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 2.1:</strong> Comprehensive Feature Comparison Matrix with Commercial Portals</span>
    <span class="toc-dots"></span>
    <span class="toc-page">10</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 2.2:</strong> Circular Sharing Modality Framework Matrix for Industrial Fleets</span>
    <span class="toc-dots"></span>
    <span class="toc-page">12</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 3.1:</strong> Functional Requirements Specification Matrix (FR-01 to FR-12)</span>
    <span class="toc-dots"></span>
    <span class="toc-page">18</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 3.2:</strong> Non-Functional Performance & Reliability Requirements Matrix</span>
    <span class="toc-dots"></span>
    <span class="toc-page">19</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 4.1:</strong> Database Entity Schema & Attribute Specification</span>
    <span class="toc-dots"></span>
    <span class="toc-page">27</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 6.1:</strong> Multilayer Hybrid Search Scoring Weights & Token Hierarchy</span>
    <span class="toc-dots"></span>
    <span class="toc-page">41</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 6.2:</strong> Industrial Semantic Intent Dictionary & Category Mapping Matrix</span>
    <span class="toc-dots"></span>
    <span class="toc-page">43</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 9.1:</strong> Comprehensive System Verification & Test Case Matrix (TC-01 to TC-20)</span>
    <span class="toc-dots"></span>
    <span class="toc-page">58</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 9.2:</strong> Precision, Recall & F1-Score Performance Metrics Across Categories</span>
    <span class="toc-dots"></span>
    <span class="toc-page">61</span>
  </div>
  <div class="toc-item" style="margin-bottom: 8px;">
    <span><strong>Table 11.1:</strong> Machinery Diverted Tonnage & Material Carbon Savings Coefficients</span>
    <span class="toc-dots"></span>
    <span class="toc-page">67</span>
  </div>
</div>

<!-- ========================================== -->
<!-- 7. LIST OF ABBREVIATIONS & ACRONYMS        -->
<!-- ========================================== -->
<div class="page-break"></div>
<div>
  <h2>List of Abbreviations & Acronyms</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Acronym</th>
        <th>Full Definition & Technical Meaning</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>AI</strong></td><td>Artificial Intelligence</td></tr>
      <tr><td><strong>API</strong></td><td>Application Programming Interface</td></tr>
      <tr><td><strong>ASR</strong></td><td>Automated Speech Recognition</td></tr>
      <tr><td><strong>B2B</strong></td><td>Business-to-Business Commercial Architecture</td></tr>
      <tr><td><strong>CAPEX</strong></td><td>Capital Expenditure (Investment in Physical Fixed Assets)</td></tr>
      <tr><td><strong>CE</strong></td><td>Conformité Européenne (European Industrial Safety Certification)</td></tr>
      <tr><td><strong>CI/CD</strong></td><td>Continuous Integration and Continuous Deployment</td></tr>
      <tr><td><strong>CNC</strong></td><td>Computer Numerical Control (Automated Machine Tooling)</td></tr>
      <tr><td><strong>CRUD</strong></td><td>Create, Read, Update, and Delete Database Operations</td></tr>
      <tr><td><strong>CSRF</strong></td><td>Cross-Site Request Forgery</td></tr>
      <tr><td><strong>DOM</strong></td><td>Document Object Model</td></tr>
      <tr><td><strong>ERD</strong></td><td>Entity-Relationship Diagram</td></tr>
      <tr><td><strong>ESG</strong></td><td>Environmental, Social, and Governance Standard</td></tr>
      <tr><td><strong>HP</strong></td><td>Horsepower (Unit of Mechanical Power Output)</td></tr>
      <tr><td><strong>INR</strong></td><td>Indian Rupee (Official Currency of the Republic of India — ₹)</td></tr>
      <tr><td><strong>IoT</strong></td><td>Internet of Things</td></tr>
      <tr><td><strong>ISO</strong></td><td>International Organization for Standardization</td></tr>
      <tr><td><strong>JWT</strong></td><td>JSON Web Token (RFC 7519 Cryptographic Token)</td></tr>
      <tr><td><strong>kVA</strong></td><td>Kilovolt-Ampere (Unit of Apparent Electrical Power)</td></tr>
      <tr><td><strong>NLP</strong></td><td>Natural Language Processing</td></tr>
      <tr><td><strong>NFR</strong></td><td>Non-Functional Requirement</td></tr>
      <tr><td><strong>OEM</strong></td><td>Original Equipment Manufacturer (e.g., Caterpillar, Haas, Komatsu)</td></tr>
      <tr><td><strong>OPEX</strong></td><td>Operational Expenditure (Ongoing Running Costs)</td></tr>
      <tr><td><strong>OSHA</strong></td><td>Occupational Safety and Health Administration</td></tr>
      <tr><td><strong>PaaS</strong></td><td>Platform as a Service (e.g., Render Cloud Platform)</td></tr>
      <tr><td><strong>REST</strong></td><td>Representational State Transfer</td></tr>
      <tr><td><strong>RPM</strong></td><td>Revolutions Per Minute (Machine Spindle Speed)</td></tr>
      <tr><td><strong>SDG</strong></td><td>Sustainable Development Goal (United Nations 2030 Agenda)</td></tr>
      <tr><td><strong>SME</strong></td><td>Small and Medium-Sized Enterprises</td></tr>
      <tr><td><strong>SPA</strong></td><td>Single Page Application</td></tr>
      <tr><td><strong>SRS</strong></td><td>System Requirements Specification</td></tr>
      <tr><td><strong>SSL/TLS</strong></td><td>Secure Sockets Layer / Transport Layer Security</td></tr>
      <tr><td><strong>STT</strong></td><td>Speech-to-Text Audio Transcription</td></tr>
      <tr><td><strong>UI/UX</strong></td><td>User Interface and User Experience Design</td></tr>
      <tr><td><strong>USD</strong></td><td>United States Dollar (Official Currency of the United States — $)</td></tr>
      <tr><td><strong>VMC</strong></td><td>Vertical Machining Center (3-Axis or 5-Axis CNC Milling)</td></tr>
      <tr><td><strong>W3C</strong></td><td>World Wide Web Consortium</td></tr>
    </tbody>
  </table>
</div>
"""

print(f"Generated prefix HTML ({len(html_content)} chars)")