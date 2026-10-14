# ShikshaSetu (शिक्षासेतु)
> **"Report the Problem. Track the Solution."**  
> *College Ideathon Project for GNIOT INNOVEX 2026*

---

## 📌 Problem Statement & Context
Government schools and Anganwadi centres across India often struggle with critical infrastructure issues:
- Broken drinking water taps and pipeline leakages
- Dysfunctional toilets and sanitation barriers
- Damaged roofs, ceiling seepage, and civil cracks
- Broken classroom benches and furniture
- Electrical sparking and power hazards

In traditional setups, complaints are either verbal or trapped in paper registers, leading to lost records, endless contractor delays, or false claims of completion. **ShikshaSetu** bridges this accountability gap by providing a frictionless mobile reporting interface, transparent audit tracking, and **mandatory community verification** before any complaint can be closed.

---

## 🎯 Core Modules & Architecture

1. **Home & Live KPI Summary**
   - Dynamic metrics calculated from persistent storage (Total, Pending, In-Progress, Verified Resolved).
   - Real-time recent complaints list with one-click tracking.

2. **Report an Issue (Core Workflow)**
   - School name, block location, issue category, description, reporter role (Teacher, Parent, SMC, Admin).
   - Optional photograph upload with instant preview.
   - Anti-duplicate submission protection & instant unique ID generation (`SS-1001`, `SS-1006`, etc.).

3. **Track a Complaint**
   - Direct search by ID or quick demo selectors.
   - Comprehensive audit timeline showing who changed what status and when.
   - Configurable overdue benchmark highlighting (e.g. 14 days) to demonstrate automatic escalation.

4. **School Dashboard**
   - Filterable view by school, issue category, and status.
   - Inspection drawer to record administrative notes and advance stages.
   - **System Safeguard**: Plain dropdowns cannot mark a complaint "Verified Resolved" without physical inspection.

5. **Authority Dashboard**
   - Triage queues: Awaiting Assignment, Open Tickets, Overdue, and Repairs Pending Verification.
   - Department auto-suggestion (e.g. Drinking Water → Water Supply / Maintenance; Roof → Building Maintenance).
   - Work order logging, delay reason recording, and repair completion hand-off.

6. **Verify Repairs (Crucial Feature)**
   - Side-by-side comparison of **Original Reported Problem** vs. **Contractor After-Repair Work**.
   - Community inspector credentials (SMC Member, Headmaster, Pradhan).
   - Two unambiguous outcomes: **Verified Resolved** (closes ticket) or **Repair Incomplete — Reopen Complaint** (preserves history and reopens ticket).

7. **Campus QR Code Noticeboard Poster**
   - High-contrast printable poster for school boundary walls and staff rooms.
   - Allows parents and teachers to report problems in 30 seconds from any smartphone camera.

---

## 🏆 10-Step Judge Demonstration Walkthrough

When presenting to judges at GNIOT INNOVEX 2026, follow this 2-minute end-to-end lifecycle:

1. **Step 1**: Open **Report an Issue**.
2. **Step 2**: Click **Quick Demo Sample** (loads a drinking water tap issue) and submit with a photo.
3. **Step 3**: Notice the newly generated unique Complaint ID (e.g., `SS-1006`).
4. **Step 4**: Open **Track a Complaint** and view the newly created ticket, its days open counter, and initial audit log.
5. **Step 5**: Switch to **Authority View**, open the ticket, and click **Auto-suggest** to assign it to *Water Supply / Maintenance*.
6. **Step 6**: Click **Start Work (Mark In Progress)** to simulate contractor mobilization.
7. **Step 7**: Click **Report Repair as Completed** and submit completion notes.
8. **Step 8**: Notice the ticket automatically moves to **Verification Pending** (it is **NOT** closed yet!).
9. **Step 9**: Switch to **Verify Repairs**, inspect before vs. after evidence, and submit a **Verified Resolved** or **Reopen** decision.
10. **Step 10**: Return to **School Dashboard** and observe the live KPIs reflect the verified resolution.

---

## 💻 How to Run the Application

### Method 1: Web Interface (React + Vite + Tailwind CSS)
Runs immediately in your browser preview:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 2: Python / Streamlit Application (Local SQLite)
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run Streamlit app
streamlit run app.py
```
Open [http://localhost:8501](http://localhost:8501) in your browser.

---

## 🔒 Ethical & Demonstration Disclaimers
- **Demonstration Prototype**: District department mappings and notification dispatches are simulated for this ideathon prototype.
- **Privacy First**: No unnecessary personally identifiable information (PII) is collected or displayed publicly.
- **Independent Verification**: Demonstrates a multi-party accountability workflow to prevent contractor self-closure.
